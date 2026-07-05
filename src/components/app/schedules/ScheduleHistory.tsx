import { JSX, lazy, useEffect, useMemo, useState } from 'react';
import AppSimpleTable, { AppSimpleTableColStructType } from '~/components/common/AppSimpleTable';
import Modal from '~/components/common/Modal';
import useScheduleService from '~/hooks/services/useScheduleService';
import useResources from '~/hooks/useResources';
import { ScheduleApiModel, ScheduleTask } from '~/models/Schedule';
import { QueryResult } from '~/types/serverCoreType';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Tooltip from '@mui/material/Tooltip';
import dayjs from 'dayjs';
// #endregion IMPORTS -> //////////////////////////////////

// #region SINGLETON --> ////////////////////////////////////
const reqLimit = 10;
const AppIcon = lazy(() => import('~/components/common/AppIcon'));
// #endregion SINGLETON --> /////////////////////////////////

export default function ScheduleHistory({ data }: IScheduleHistory): JSX.Element {
    // #region STATE --> ///////////////////////////////////////
    const [history, setHistory] = useState<QueryResult<ScheduleTask>>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [logs, setLogs] = useState<string[]>([]);
    const [taskId, setTaskId] = useState<number>(null);
    const [currentPage, setCurrentPage] = useState<number>(0);
    const [totalPages, setTotalPages] = useState<number>(0);
    // #endregion STATE --> ////////////////////////////////////

    // #region HOOKS --> ///////////////////////////////////////
    const Schedule = useScheduleService();
    const Resources = useResources();

    const header: AppSimpleTableColStructType<ScheduleTask>[] = useMemo(
        () => [
            {
                field: 'id',
                label: 'ID',
            },
            {
                field: 'status',
                label: 'Statut',
                valueFormatter: (d: ScheduleTask) => Resources.translateScheduleStatusNode(d.status),
            },
            {
                field: 'current',
                label: 'Traitée',
                align: 'right',
            },
            {
                field: 'total',
                label: 'Total',
                align: 'right',
            },
            {
                field: 'duration',
                label: "Temps d'exécution",
            },
            {
                field: 'startedAt',
                label: 'Dernière exécution',
                valueFormatter: (d: ScheduleTask) => dayjs(d.startedAt).format('DD/MM/YYYY HH:mm:ss'),
            },
            {
                field: 'id',
                label: 'Actions',
                align: 'right',
                valueFormatter: (d: ScheduleTask) => (
                    <>
                        <Tooltip title="Afficher les logs">
                            <IconButton size="small" outline="true" onClick={() => handleOpenClose(d.id)}>
                                <AppIcon name="TextSnippetRounded" />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Télécharger les logs">
                            <IconButton outline="true" size="small" onClick={() => download(d.id)}>
                                <AppIcon name="FileDownloadRounded" />
                            </IconButton>
                        </Tooltip>
                    </>
                ),
            },
        ],
        [history, history?.totalRecords, history?.records.length]
    );
    // #endregion HOOKS --> ////////////////////////////////////

    // #region METHODS --> /////////////////////////////////////
    const handleOpenClose = (id?: number): void => {
        if (id) {
            setTaskId(id);
        } else {
            setLogs([]);
            setTaskId(null);
        }

        setIsOpen(!isOpen);
    };
    const load = async (offset: number = 0, limit: number = reqLimit): Promise<void> => {
        const timeout = setTimeout(() => setIsLoading(true), 500);
        await Schedule.getScheduleHistory(data.id, limit, offset)
            .then((res) => {
                setHistory(res);
                setTotalPages(Math.ceil(res.totalRecords / limit));
            })
            .finally(() => {
                clearTimeout(timeout);
                setIsLoading(false);
            });
    };

    const loadLogs = async (id: number): Promise<void> => {
        await Schedule.getTaskLogs(id).then((res) => {
            setLogs(res.data);
        });
    };

    const download = async (id: number): Promise<void> => {
        await Schedule.downloadTaskLogs(id);
    };

    const onPageChange = (newPage: number): void => {
        setCurrentPage(newPage - 1);
    };
    // #endregion METHODS --> //////////////////////////////////

    // #region USEEFFECT --> ///////////////////////////////////
    useEffect(() => {
        if (data) {
            load(currentPage * reqLimit);
        }
    }, [currentPage, data]);

    useEffect(() => {
        if (taskId && data) {
            loadLogs(taskId);
        }
    }, [taskId, data]);
    // #endregion USEEFFECT --> ////////////////////////////////

    // #region RENDER --> //////////////////////////////////////
    return (
        <>
            <AppSimpleTable<ScheduleTask> currentPage={currentPage + 1} totalPages={totalPages} columns={header} rows={history?.records} sm isLoading={isLoading} onPageChange={onPageChange} />
            <Modal onClose={handleOpenClose} modalTitle="Logs" maxWidth="lg" closable isOpen={isOpen}>
                <List>
                    {logs.map((l, i) => (
                        <ListItem>
                            <code key={i} className={`p-2 text-nowrap my-2${l.includes('ERROR!') ? ' bg-danger-subtle' : ''}`}>
                                {l}
                            </code>
                        </ListItem>
                    ))}
                </List>
            </Modal>
        </>
    );
    // #endregion RENDER --> ///////////////////////////////////
}

// #region IPROPS -->  /////////////////////////////////////
interface IScheduleHistory {
    data: ScheduleApiModel;
}
// #enderegion IPROPS --> //////////////////////////////////
