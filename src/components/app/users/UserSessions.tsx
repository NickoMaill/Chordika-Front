// #region IMPORTS -> /////////////////////////////////////
import { FormControlLabel, IconButton, Switch } from '@mui/material';
import dayjs from 'dayjs';
import { JSX, lazy, useEffect, useState } from 'react';
import AppSimpleTable, { AppSimpleTableColStructType } from '~/components/common/AppSimpleTable';
import ToolTips from '~/components/common/AppTooltips';
import { AppError } from '~/core/appError';
import useSessionService from '~/hooks/services/useSessionService';
import useToast from '~/hooks/useToast';
import { UserApiModel, UserDeviceSessions, UserSessionApiModel } from '~/models/Users';
// #endregion IMPORTS -> //////////////////////////////////

// #region SINGLETON --> ////////////////////////////////////
const limit = 10;
const AppIcon = lazy(() => import('~/components/common/AppIcon'));
// #endregion SINGLETON --> /////////////////////////////////

export default function UserSessions({ data }: IUserSessions): JSX.Element {
    // #region STATE --> ///////////////////////////////////////
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [sessions, setSessions] = useState<UserDeviceSessions[]>([]);
    const [totalPages, setTotalPages] = useState<number>(1);
    const [showAll, setShowAll] = useState<boolean>(false);
    // #endregion STATE --> ////////////////////////////////////

    // #region HOOKS --> ///////////////////////////////////////
    const Session = useSessionService();
    const Toast = useToast();
    // #endregion HOOKS --> ////////////////////////////////////

    // #region METHODS --> /////////////////////////////////////
    const handlePageChange = (e: number): void => {
        setCurrentPage(e);
    };
    const handleShowAll = (): void => {
        setShowAll(!showAll);
    };
    const getSessions = async (): Promise<void> => {
        setIsLoading(true);
        await Session.getSessions(data.id, limit, (currentPage - 1) * limit, showAll)
            .then((res) => {
                setSessions(res.records);
                setTotalPages(Math.ceil(res.totalRecords / limit));
            })
            .finally(() => setIsLoading(false));
    };

    const revokeToken = async (sesId: number): Promise<void> => {
        await Session.revokeSession(sesId)
            .then((ok) => {
                if (ok) {
                    Toast.success('Session révoquée avec succès !');
                    getSessions();
                } else {
                    Toast.warning("La session n'a pas pue être révoquée");
                }
            })
            .catch((err) => {
                if (err instanceof AppError) {
                    if (err.code === 'no_token') Toast.error("Aucune session trouvé pour l'ID " + sesId);
                }
            });
    };

    const columns: AppSimpleTableColStructType<UserDeviceSessions>[] = [
        {
            field: 'id',
            label: 'ID',
        },
        {
            field: 'deviceId',
            label: 'ID Appareil',
        },
        {
            field: 'userAgent',
            label: 'User-Agent',
        },
        {
            field: 'isRevoked',
            label: 'Actif ?',
            valueFormatter: (v) => (v.isRevoked ? 'Non' : 'Oui'),
        },
        {
            field: 'revokedAt',
            label: 'Révoqué le',
            valueFormatter: (v) => (v.revokedAt ? dayjs(v.revokedAt).format('DD/MM/YYYY HH:mm:ss') : '-'),
        },
        {
            field: 'addedAt',
            label: 'Créée le',
            valueFormatter: (v) => dayjs(v.addedAt).format('DD/MM/YYYY HH:mm:ss'),
        },
        {
            field: 'action',
            label: 'Actions',
            valueFormatter: (v) =>
                !v.isRevoked ? (
                    <ToolTips textContent="Revoker la session ?">
                        <IconButton onClick={() => revokeToken(v.id)}>
                            <AppIcon name="DoNotDisturb" />
                        </IconButton>
                    </ToolTips>
                ) : (
                    <></>
                ),
        },
    ];
    // #endregion METHODS --> //////////////////////////////////

    // #region USEEFFECT --> ///////////////////////////////////
    useEffect(() => {
        getSessions();
    }, [currentPage, showAll, data]);
    // #endregion USEEFFECT --> ////////////////////////////////

    // #region RENDER --> //////////////////////////////////////
    return (
        <AppSimpleTable<UserDeviceSessions>
            rows={sessions}
            columns={columns}
            isLoading={isLoading}
            onPageChange={handlePageChange}
            currentPage={currentPage}
            totalPages={totalPages}
            noContentMessage="Aucune session trouvée"
            id="sessions"
            footerActions={<FormControlLabel label="Afficher toute les sessions" control={<Switch checked={showAll} onChange={handleShowAll} />} />}
            colspanFooterActions={columns.length - 3}
        />
    );
    // #endregion RENDER --> ///////////////////////////////////
}

// #region IPROPS -->  /////////////////////////////////////
interface IUserSessions {
    data: UserApiModel | UserSessionApiModel;
}
// #enderegion IPROPS --> //////////////////////////////////
