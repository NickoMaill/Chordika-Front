import { JSX, ReactNode, useEffect, useState } from 'react';
import HTMLParser from '~/components/common/HTMLParser';
import { Bold, Regular } from '~/components/common/Text';
import FormMaker from '~/components/formMaker/FormMaker';
import ContentLayout from '~/components/layout/ContentLayout';
import { SQLTestOutput } from '~/models/Common';
import { FormMakerContentType, FormMakerPartEnum } from '~/types/FormMakerCoreTypes';
import useToolService from '~/hooks/services/useToolService';
import { MonitorInfoType } from '~/types/config';
import AppFullPageLoader from '~/components/common/AppFullPageLoader';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import dayjs from 'dayjs';
// #endregion IMPORTS -> //////////////////////////////////

// #region SINGLETON --> ////////////////////////////////////
// #endregion SINGLETON --> /////////////////////////////////

export function SQLTest(): JSX.Element {
    // #region STATE --> ///////////////////////////////////////
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [result, setResult] = useState<SQLTestOutput[]>([]);
    // #endregion STATE --> ////////////////////////////////////

    // #region HOOKS --> ///////////////////////////////////////
    const Tools = useToolService();
    // #endregion HOOKS --> ////////////////////////////////////

    // #region METHODS --> /////////////////////////////////////
    const getStruct = (): FormMakerContentType<FormMakerPartEnum.PANEL>[] => {
        const struct: FormMakerContentType<FormMakerPartEnum.PANEL>[] = [
            {
                title: 'Éxecution SQL',
                type: FormMakerPartEnum.PANEL,
                content: [
                    {
                        type: 'textarea',
                        size: 12,
                        id: 'SqlStr',
                        index: 1,
                        label: 'Requête SQL',
                    },
                    {
                        type: 'text',
                        id: 'Columns',
                        index: 1,
                        size: 12,
                        label: 'Colonnes',
                        value: result.length > 0 ? result[result.length - 1].columns.join(',') : null,
                    },
                ],
            },
        ];
        return struct;
    };

    const onSubmit = async (e: FormData): Promise<void> => {
        setIsLoading(true);
        await Tools.getSqlTest(e as FormData)
            .then((res) => {
                setResult(res);
            })
            .finally(() => setIsLoading(false));
    };
    // #endregion METHODS --> //////////////////////////////////

    // #region USEEFFECT --> ///////////////////////////////////
    // #endregion USEEFFECT --> ////////////////////////////////

    // #region RENDER --> //////////////////////////////////////
    return (
        <ContentLayout title="SQL test" icon="DataArray">
            {result.map((r) => (
                <SQLTestView res={r} />
            ))}
            <FormMaker showBackPress={false} submitLabel="exécuter" isSubmitLoading={isLoading} structure={getStruct()} outputType="formData" onSubmit={onSubmit} />
        </ContentLayout>
    );
    // #endregion RENDER --> ///////////////////////////////////
}

function SQLTestView({ res }: { res: SQLTestOutput }): JSX.Element {
    return (
        <Box className="mt-3">
            <Box>
                <Regular>
                    Temp d'exécution <b>{res.timeExec}ms</b>
                </Regular>
                <Regular>
                    Nombre de records : <b>{(res.datas ?? []).length}</b>
                </Regular>
                <Bold color={'purple'} className="my-2">
                    SQL : {res.sql.toUpperCase()}
                </Bold>
            </Box>
            {res.error ? (
                <Bold color={'red'}>{res.error.toUpperCase()}</Bold>
            ) : (
                <Box>
                    <Table size="small" aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                {res.columns.map((c, i) => (
                                    <TableCell scope="row" component="th" key={i}>
                                        {c}
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {res.datas.map((row, i) => (
                                <TableRow key={i}>
                                    {res.columns.map((c, i) => (
                                        <TableCell key={i} scope="row">
                                            <HTMLParser>{row[c]}</HTMLParser>
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Box>
            )}
        </Box>
    );
}

// #region IPROPS -->  /////////////////////////////////////
// #enderegion IPROPS --> //////////////////////////////////

export function Monitor(): JSX.Element {
    const [monitor, setMonitor] = useState<MonitorInfoType | null>(null);

    const Tools = useToolService();

    useEffect(() => {
        Tools.getAppMonitor()
            .then((res) => setMonitor(res))
            .catch(() => setMonitor(null));

        return (): void => setMonitor(null);
    }, []);

    if (!monitor) return <AppFullPageLoader isLoading />;

    const generalParameters = [
        { label: 'Date', value: dayjs(monitor.date).format('dd/MM/yyyy HH:mm:ss') },
        { label: 'Datasource', value: monitor.datasource },
        { label: 'SAP Server', value: monitor.sapServer },
        { label: 'SMTP Server', value: monitor.smtpServer },
        { label: 'Root URL', value: monitor.rootURL },
        { label: 'Root Path', value: monitor.rootPath },
        { label: 'Session Time-Out', value: `${monitor.sessionTimeout} min` },
        { label: 'Encrypted Configuration', value: monitor.encryptedConfig ? 'Oui' : 'Non' },
    ];

    const environment = [
        { label: 'Machine Name', value: monitor.machineName },
        { label: 'Host Name', value: monitor.hostName },
        { label: 'DNS Name', value: monitor.dnsName },
        { label: 'IP Address (IPv6)', value: monitor.ipAddress },
        { label: 'IP Address (IPv4)', value: monitor.ipAddress },
        { label: 'Front-End FQDN', value: monitor.fqdn },
        { label: 'Operating System', value: monitor.osVersion },
        { label: 'Uptime', value: monitor.uptime },
        { label: 'Processors', value: monitor.processors },
        { label: 'Process Memory', value: monitor.processMemory },
        { label: 'User', value: monitor.user },
        { label: 'NodeJS Version', value: monitor.nodeVersion },
        { label: 'BigIP HTTP Insert', value: monitor.bigIPHTTPInsert },
    ];

    const database = [
        { label: 'PostgreSQL Version', value: monitor.dbVersion },
        { label: 'Database Size', value: monitor.dbSize },
        { label: 'Pilot User Accounts', value: `${monitor.userAccounts} accounts` },
    ];

    const filesFolder = [
        // { label: 'E:\\Pilot\\Files\\ Exist', value: 'True' },
        // { label: 'E:\\Pilot\\Files\\docs\\ Exist', value: 'True' },
        // { label: 'E:\\Pilot\\Files\\annonces\\ Exist', value: 'True' },
    ];

    return (
        <ContentLayout title="Monitor" icon="Monitor">
            <Container maxWidth="md" sx={{ py: 4 }}>
                <Typography variant="h4" gutterBottom>
                    Monitoring Page for Pilot
                </Typography>

                <SectionCard title="General Parameters" items={generalParameters} />
                <SectionCard title="Environment" items={environment} />
                <SectionCard title="Database" items={database} />
                <SectionCard title="Files Folder" items={filesFolder} />

                {/* <Typography variant="h6" color="success.main" align="center" sx={{ mt: 4 }}>
                    Status = 200 - No problems detected.
                </Typography> */}
            </Container>
        </ContentLayout>
    );
}

function SectionCard({ title, items }: { title: string; items: InfoItem[] }): JSX.Element {
    return (
        <Card sx={{ mb: 4 }}>
            <CardContent>
                <Typography variant="h5" gutterBottom>
                    {title}
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <InfoList items={items} />
            </CardContent>
        </Card>
    );
}

type InfoItem = { label: string; value: ReactNode };

function InfoList({ items }: { items: InfoItem[] }): JSX.Element {
    return (
        <List dense>
            {items.map((item, index) => (
                <ListItem key={index}>
                    <ListItemText primary={item.label} secondary={item.value ?? '-'} />
                </ListItem>
            ))}
        </List>
    );
}
