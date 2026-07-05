// #region IMPORTS -> /////////////////////////////////////
import { JSX } from 'react';
import { Card, CardContent, Container, Divider, List, ListItem, ListItemText, Typography } from '@mui/material';
import { ReactNode, useEffect, useState } from 'react';
import AppFullPageLoader from '~/components/common/AppFullPageLoader';
import ContentLayout from '~/components/layout/ContentLayout';
import DateTime from '~/core/classes/DateTime';
import useToolService from '~/hooks/services/useToolService';
import { MonitorInfoType } from '~/types/config';
// #endregion IMPORTS -> //////////////////////////////////

// #region SINGLETON --> ////////////////////////////////////
// #endregion SINGLETON --> /////////////////////////////////

export default function Monitor(): JSX.Element {
    // #region STATE --> ///////////////////////////////////////
    const [monitor, setMonitor] = useState<MonitorInfoType | null>(null);
    // #endregion STATE --> ////////////////////////////////////

    // #region HOOKS --> ///////////////////////////////////////
    const Tools = useToolService();
    // #endregion HOOKS --> ////////////////////////////////////

    // #region METHODS --> /////////////////////////////////////

    useEffect(() => {
        Tools.getAppMonitor()
            .then((res) => setMonitor(res))
            .catch(() => setMonitor(null));

        return (): void => setMonitor(null);
    }, []);

    if (!monitor) return <AppFullPageLoader isLoading />;

    const generalParameters = [
        { label: 'Date', value: new DateTime(monitor.date).toString('dd/MM/yyyy HH:mm:ss') },
        { label: 'Datasource', value: monitor.datasource },
        // { label: 'SAP Server', value: monitor.sapServer },
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
        { label: 'NodeJS Version', value: monitor.expVersion },
        // { label: 'BigIP HTTP Insert', value: monitor.bigIPHTTPInsert },
    ];

    const database = [
        { label: 'PostgreSQL Version', value: monitor.dbVersion },
        { label: 'Database Size', value: monitor.dbSize },
        { label: 'NStream User Accounts', value: `${monitor.userAccounts} accounts` },
    ];
    // #endregion METHODS --> //////////////////////////////////

    // #region USEEFFECT --> ///////////////////////////////////
    // #endregion USEEFFECT --> ////////////////////////////////

    // #region RENDER --> //////////////////////////////////////
    return (
        <ContentLayout title="Monitor" icon="Monitor">
            <Container maxWidth="md" sx={{ py: 4 }}>
                <Typography variant="h4" gutterBottom>
                    Monitoring Page for AVEN
                </Typography>

                <SectionCard title="General Parameters" items={generalParameters} />
                <SectionCard title="Environment" items={environment} />
                <SectionCard title="Database" items={database} />
                {/* <SectionCard title="Files Folder" items={filesFolder} /> */}
                <SectionCard title="Disks usage">
                    {/* <Box className="d-flex justify-content-between">
                        {monitor.diskUsage.map((d) => (
                            <DiskUsage disk={d} />
                        ))}
                    </Box> */}
                </SectionCard>
                {/* <Typography variant="h6" color="success.main" align="center" sx={{ mt: 4 }}>
                    Status = 200 - No problems detected.
                </Typography> */}
            </Container>
        </ContentLayout>
    );
    // #endregion RENDER --> ///////////////////////////////////
}

// #region IPROPS -->  /////////////////////////////////////
// #enderegion IPROPS --> //////////////////////////////////

function SectionCard({ title, items, children }: { title: string; items?: InfoItem[]; children?: ReactNode }): JSX.Element {
    return (
        <Card sx={{ mb: 4 }}>
            <CardContent>
                <Typography variant="h5" gutterBottom>
                    {title}
                </Typography>
                <Divider sx={{ mb: 2 }} />
                {children ? children : <InfoList items={items} />}
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

// function DiskUsage({ disk }: { disk: DiskUsageType }): JSX.Element {
//     return (
//         <Box className="mb-3 w-100 mx-3">
//             <Bold variant="h5">{disk.name.toUpperCase()}</Bold>
//             <List>
//                 <ListItem>
//                     <ListItemText>
//                         <b>Total</b> : {disk.total} go
//                     </ListItemText>
//                 </ListItem>
//                 <ListItem>
//                     <ListItemText>
//                         <b>Used</b> : {Math.round((disk.total - disk.free) * 100) / 100} go
//                     </ListItemText>
//                 </ListItem>
//                 <ListItem>
//                     <ListItemText>
//                         <b>Free</b> : {disk.free} go
//                     </ListItemText>
//                 </ListItem>
//             </List>
//             <AppProgressBar percent={disk.usedPercent} animate={false} showPercent height={2} />
//         </Box>
//     );
// }
