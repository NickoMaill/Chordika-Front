import { JSX, ReactNode, useEffect, useState } from 'react';
import { LogsApiModel } from '~/models/Logs';
import { QueryResult } from '~/types/serverCoreType';
import useUserService from '~/hooks/services/useUserService';
import { UserApiModel } from '~/models/Users';
import AppSimpleTable, { AppSimpleTableColStructType } from '~/components/common/AppSimpleTable';
import HTMLParser from '~/components/common/HTMLParser';
import dayjs from 'dayjs';

let limit = 10;
export function LogActivities({ data }: ILogActivities): JSX.Element {
    const UserServices = useUserService();
    const [logs, setLogs] = useState<QueryResult<LogsApiModel>>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [currentPage, setCurrentPage] = useState<number>(1);

    const loadActivities = async (): Promise<void> => {
        const timeout = setTimeout(() => {
            setIsLoading(true);
        }, 1_000);
        await UserServices.getLogActivities(data.id, limit, (currentPage - 1) * limit)
            .then((res) => {
                setLogs(res);
            })
            .finally(() => {
                clearTimeout(timeout);
                setIsLoading(false);
            });
    };

    const header: AppSimpleTableColStructType<LogsApiModel>[] = [
        { field: 'addedAt', label: 'Date', valueFormatter: (v: LogsApiModel): string => dayjs(v.addedAt).format('DD/MM/YYYY HH:mm:ss') },
        { field: 'action', label: 'Action', valueFormatter: (v: LogsApiModel): string => v.action },
        { field: 'proxy', label: 'Proxy' },
        { field: 'ipAddress', label: 'Adresse IP' },
        { field: 'info', label: 'Information', valueFormatter: (v: LogsApiModel): ReactNode => <HTMLParser>{v.info}</HTMLParser> },
    ];

    const handlePageChange = (page: number): void => {
        setCurrentPage(page);
    };
    useEffect(() => {
        if (data) {
            loadActivities();
        }
    }, [currentPage, data]);

    return (
        <AppSimpleTable<LogsApiModel>
            id="LogActivities"
            isLoading={isLoading}
            sm
            columns={header}
            rows={logs?.records}
            currentPage={currentPage}
            totalPages={Math.ceil(logs?.totalRecords / logs?.limit)}
            onPageChange={handlePageChange}
        />
    );
}

interface ILogActivities {
    data: UserApiModel;
}
