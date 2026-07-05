import { JSX, useEffect, useRef, useState } from 'react';
import AppGridContainer from '~/components/common/AppGridContainer';
import AppProgressBar from '~/components/common/AppProgressBar';
import { Bold, Regular } from '~/components/common/Text';
import appTool from '~/helpers/appTool';
import useScheduleService from '~/hooks/services/useScheduleService';
import useResources from '~/hooks/useResources';
import useWs from '~/hooks/useWs';
import { ScheduleApiModel } from '~/models/Schedule';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import dayjs from 'dayjs';
// #endregion IMPORTS -> //////////////////////////////////

// #region SINGLETON --> ////////////////////////////////////
type ScheduleMessage = { data: { field: string; value: unknown }[] };
// #endregion SINGLETON --> /////////////////////////////////

export default function ScheduleMonitor({ data }: IScheduleMonitor): JSX.Element {
    // #region STATE --> ///////////////////////////////////////
    const [task, setTask] = useState<ScheduleApiModel>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const logsDiv = useRef<HTMLDivElement>(null);
    const isUserAtBottom = useRef(true);
    // #endregion STATE --> ////////////////////////////////////

    // #region HOOKS --> ///////////////////////////////////////
    const ScheduleService = useScheduleService();
    const Resources = useResources();
    // #endregion HOOKS --> ////////////////////////////////////

    // #region METHODS --> /////////////////////////////////////
    const refreshContent = (m: unknown): void => {
        if (!(m as ScheduleMessage).data) return;
        const data = (m as ScheduleMessage).data;

        data.forEach((d) => {
            setTask((prevState) => {
                if (!prevState) return prevState; // Sécurité

                if (d.field === 'logs') {
                    if (Array.isArray(d.value)) return { ...prevState, logs: [] };
                    return {
                        ...prevState,
                        logs: [...prevState.logs, d.value as string],
                    };
                } else {
                    return {
                        ...prevState,
                        lastTask: {
                            ...prevState.lastTask,
                            [d.field]: d.value,
                        },
                    };
                }
            });
        });
    };
    const WS = useWs({ url: 'schedule', onMessage: refreshContent });

    const subscribe = (): void => {
        WS.send('subscribe', { type: 'Schedule', id: data.id });
    };
    const load = async (): Promise<void> => {
        try {
            const dataMonitor = await ScheduleService.getScheduleMonitoring(data.id);
            if (dataMonitor) setTask(dataMonitor);
            subscribe();
        } catch {
            console.error('error');
        } finally {
            setIsLoading(false);
        }
    };
    // #endregion METHODS --> //////////////////////////////////

    // #region USEEFFECT --> ///////////////////////////////////
    useEffect(() => {
        if (WS.isConnected && data) {
            load();
        }
    }, [WS.isConnected, data]);

    useEffect(() => {
        if (!logsDiv.current) return;

        const el = logsDiv.current;

        requestAnimationFrame(() => {
            if (isUserAtBottom.current) {
                el.scrollTop = el.scrollHeight;
            }
        });
    }, [task?.logs?.length]); // 👈 utilise `.length` pour déclencher le scroll uniquement si un log est ajouté

    useEffect(() => {
        return (): void => {
            WS.close(); // si WS est bien une instance et pas un hook sans `.close()`
        };
    }, []);
    // #endregion USEEFFECT --> ////////////////////////////////

    // #region RENDER --> //////////////////////////////////////
    return (
        <Box>
            {isLoading ? (
                <Box className="d-flex flex-column justify-content-center w-100 align-items-center">
                    <CircularProgress size={70} />
                    <Bold className="mt-4">
                        <i>{Resources.translate('schedule.monitoringLoading')}</i>
                    </Bold>
                </Box>
            ) : (
                <Box>
                    <Box className="mb-3">
                        <AppGridContainer>
                            <Grid size={4}>
                                <Bold>{Resources.translate('common.name')}</Bold>
                                {task?.name}
                            </Grid>
                            <Grid size={4}>
                                <Bold>{Resources.translate('common.description')}</Bold>
                                {task?.description}
                            </Grid>
                            <Grid size={4}>
                                <Bold>{Resources.translate('schedule.lastExec')}</Bold>
                                {task?.lastTask?.startedAt ? dayjs(task.lastTask.startedAt).format('DD/MM/YYYY HH:mm:ss') : '--'}
                            </Grid>
                        </AppGridContainer>
                    </Box>
                    <Divider />
                    <Box className="my-3">
                        <AppGridContainer>
                            <Grid size={8}>
                                <Bold>{Resources.translate('schedule.endedAt')}</Bold>
                                {task?.lastTask?.endedAt ? dayjs(task.lastTask.endedAt).format('DD/MM/YYYY HH:mm:ss') : '--'}
                            </Grid>
                            <Grid size={4}>
                                <Bold>Statut</Bold>
                                {Resources.translateScheduleStatusNode(task?.lastTask?.status)}
                            </Grid>
                        </AppGridContainer>
                    </Box>
                    <Divider />
                    {task?.lastTask?.totalStep > 0 && (
                        <Box className="my-3">
                            <Regular>
                                <b>Étape : </b>
                                {task.lastTask.stepName}
                            </Regular>
                            <AppProgressBar alwaysStripped={appTool.calcPercent(task.lastTask.current, task.lastTask.total) < 100} percent={appTool.calcPercent(task.lastTask.nStep, task.lastTask.totalStep)} />
                        </Box>
                    )}
                    <Box className="my-3">
                        <Regular>
                            <b>Traités : </b> {task?.lastTask?.current} / {task?.lastTask?.total}
                        </Regular>
                        <AppProgressBar percent={appTool.calcPercent(task?.lastTask?.current, task?.lastTask?.total)} />
                    </Box>
                    <Divider />
                    <Box
                        ref={logsDiv}
                        onScroll={() => {
                            if (!logsDiv.current) return;
                            const el = logsDiv.current;
                            const atBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 10;
                            isUserAtBottom.current = atBottom;
                        }}
                        className="border mt-3 d-flex flex-column"
                        sx={{ height: '300px', overflowY: 'auto', overflowX: 'hidden' }}
                    >
                        {task.logs?.length > 0 ? (
                            task.logs.map((l, i) => (
                                <code key={i} className={`p-2 text-nowrap my-2${l.includes('ERROR!') ? ' bg-danger-subtle' : ''}`}>
                                    {l}
                                </code>
                            ))
                        ) : (
                            <Box className="text-center h-100 d-flex align-items-center w-100 justify-content-center">
                                <Bold variant="h6">
                                    <i>Aucun log...</i>
                                </Bold>
                            </Box>
                        )}
                    </Box>
                </Box>
            )}
        </Box>
    );
    // #endregion RENDER --> ///////////////////////////////////
}

// #region IPROPS -->  /////////////////////////////////////
interface IScheduleMonitor {
    data: ScheduleApiModel;
}
// #enderegion IPROPS --> //////////////////////////////////
