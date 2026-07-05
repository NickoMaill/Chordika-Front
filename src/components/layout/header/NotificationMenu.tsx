// #region IMPORTS -> /////////////////////////////////////
import { Avatar, Badge, Box, Button, ButtonGroup, Drawer, Grid, IconButton, List, ListItem, ListItemAvatar, ListItemButton, ListItemText, Skeleton, Tooltip, useTheme } from '@mui/material';
import dayjs from 'dayjs';
import { useSnackbar } from 'notistack';
import { JSX, UIEvent, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import AppIcon, { IconNameType } from '~/components/common/AppIcon';
import { Bold, Italic } from '~/components/common/Text';
import appTool from '~/helpers/appTool';
import useNotificationService from '~/hooks/services/useNotificationService';
import useWs, { WebSocketResponse } from '~/hooks/useWs';
import { Notification, NotificationStatusEnum, NotificationTypeEnum } from '~/models/Notification';
import NavigationResource from '~/resources/navigationResources';
import stylesResources from '~/resources/stylesResources';
import { gray } from '~/resources/theme/themePrimitives';
// #endregion IMPORTS -> //////////////////////////////////

// #region SINGLETON --> ////////////////////////////////////
const limit = 11;
const maxDisplayable = 30;
// #endregion SINGLETON --> /////////////////////////////////

export default function NotificationMenu(): JSX.Element {
    // #region STATE --> ///////////////////////////////////////
    const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
    const [data, setData] = useState<Notification[]>([]);
    const [totalNotifs, setTotalNotifs] = useState<number>(0);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [offset, setOffset] = useState<number>(0);
    const [mode, setMode] = useState<"all" | "notSeen">("all");
    const isLoadingRef = useRef<boolean>(false);
    // #endregion STATE --> ////////////////////////////////////

    // #region HOOKS --> ///////////////////////////////////////
    const { getNotifications, seen } = useNotificationService();
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();
    const theme = useTheme();
    // #endregion HOOKS --> ////////////////////////////////////

    // #region METHODS --> /////////////////////////////////////
    const openCloseMenu = (): void => {
        setIsMenuOpen(!isMenuOpen);
    };

    const load = async (nextOffset: number = 0, nextMode: "all" | "notSeen" = mode, append: boolean = false): Promise<void> => {
        if (isLoadingRef.current) {
            return;
        }

        isLoadingRef.current = true;
        setIsLoading(true);

        try {
            const res = await getNotifications(nextMode === "all", nextOffset, limit);

            setData((prevState) => (append ? [...prevState, ...res.records].distinctBy((n) => n.id) : res.records));
            setTotalNotifs(res.totalAllRecords);
            setOffset(nextOffset);
        } finally {
            isLoadingRef.current = false;
            setIsLoading(false);
        }
    };

    const setAsSeen = (id: number): void => {
        seen(id)
            .then(() => {
                setData((prevData) => prevData.map((n) => (n.id === id ? { ...n, seen: true } : n)));
            })
            .catch((error) => {
                console.error('Error marking notification as seen:', error);
            });
    };
    const onNotification = (res: WebSocketResponse<{ refresh: boolean; data: Notification }>): void => {
        if (res.type === 'notifications' && res.refresh) {
            load(0, mode, false);
            const key = Math.floor(Math.random() * 1000);
            enqueueSnackbar(
                <ToastWrapper
                    notification={res.data}
                    key={key}
                    onClick={(id) => {
                        setAsSeen(id);
                        closeSnackbar();
                    }}
                />,
                {
                    variant: 'default',
                    key,
                    anchorOrigin: { vertical: 'bottom', horizontal: 'right' },
                    className: 'position-relative',
                    persist: true,
                    // autoHideDuration: 6000 + 50,
                }
            );
        }
    };
    const _ = useWs({ url: 'notifications', onMessage: onNotification });

    const onScroll = (e: UIEvent<HTMLDivElement>): void => {
        const target = e.currentTarget;
        const isAtBottom = target.scrollTop + target.clientHeight >= target.scrollHeight - 5;
        const max = Math.min(totalNotifs, maxDisplayable);

        if (!isAtBottom || data.length >= max || isLoadingRef.current) {
            return;
        }

        const nextOffset = offset + limit;
        load(nextOffset, mode, true);
    };
    // #endregion METHODS --> //////////////////////////////////

    // #region USEEFFECT --> ///////////////////////////////////
    useEffect(() => {
        load(0, mode, false);
    }, [mode]);
    // #endregion USEEFFECT --> ////////////////////////////////
    
    // #region RENDER --> //////////////////////////////////////
    return (
        <Box>
            <Tooltip title="">
                <Badge color="error" variant="dot" invisible={data?.filter((n) => !n.seen).length === 0}>
                    <IconButton outline="true" size="small" onClick={openCloseMenu}>
                        <AppIcon name="Notifications" />
                    </IconButton>
                </Badge>
            </Tooltip>
            <Drawer slotProps={{ paper: { sx: { width: { xs: '100%', sm: 400 }, height: { xs: '94vh', sm: "92.7vh" }, top: { xs: '56px', sm: '64px' }, overflow: "auto" }, onScroll } }} anchor="right" open={isMenuOpen} onClose={openCloseMenu}>
                <Box sx={{ width: '100%', height: '100%' }}>
                    <Box className="p-3">
                        <Bold component={'h3'} variant="h4">
                            Notifications
                        </Bold>
                        <Box className="d-flex justify-content-between align-items-center" sx={{ mt: 1, mb: 0 }}>
                            <ButtonGroup variant="outlined" size="small">
                                <Button onClick={() => setMode("all")} sx={{ bgcolor: mode === "all" ? gray[200] : null, ...theme.applyStyles("dark", { bgcolor:  mode === "all" ? gray[800] : null }) }}>Tout</Button>
                                <Button onClick={() => setMode("notSeen")} sx={{ bgcolor: mode === "notSeen" ? gray[200] : null, ...theme.applyStyles("dark", { bgcolor:  mode === "notSeen" ? gray[800] : null }) }}>Non lu</Button>
                            </ButtonGroup>
                            <Button component={Link} onClick={openCloseMenu} to={NavigationResource.routesPath.notifications} variant="text">
                                Voir tout
                            </Button>
                        </Box>
                    </Box>
                    <Box sx={{ width: '100%' }}>
                        {data?.length > 0 ? (
                            <>
                                <List dense>
                                    {data.map((n) => (
                                        <NotificationItem key={n.id} notification={n} onClick={setAsSeen} />
                                    ))}
                                </List>
                                {isLoading && <NotificationLoading />}
                            </>
                        ) : isLoading ? (
                            <NotificationLoading />
                        ) : (
                            <NotificationNotFound />
                        )}
                    </Box>
                </Box>
            </Drawer>
        </Box>
    );
    // #endregion RENDER --> ///////////////////////////////////
}

function NotificationLoading(): JSX.Element {
    return (
        <List dense>
            {Array.from({ length: 10 }).map((_, index) => (
                <ListItem key={index}>
                    <ListItemAvatar>
                        <Grid component={Skeleton} size={3} variant="circular" width={50} height={50} />
                    </ListItemAvatar>
                    <ListItemText>
                        <Grid component={Skeleton} size={9} variant="text" height={25} />
                    </ListItemText>
                </ListItem>
            ))}
        </List>
    );
}
const typeSize = 47;
const iconSize = 35;

function ToastWrapper(props: INotificationItemProps): JSX.Element {
    return (
        <Box className="d-flex justify-content-between align-items-center">
            <NotificationItem {...props} dense={false} showSeenIndicator={false} />
            <IconButton onClick={() => props.onClick(props.notification.id)}>
                <AppIcon name="Close" />
            </IconButton>
        </Box>
    );
}

function NotificationItem({ notification, onClick, dense = true, showSeenIndicator = true }: INotificationItemProps): JSX.Element {
    const handleClick = (): void => {
        if (!notification.seen) {
            onClick(notification.id);
        }
    };
    const getTypeIcon = (type: NotificationTypeEnum): IconNameType => {
        switch (type) {
            case NotificationTypeEnum.INFO:
                return 'Info';
            case NotificationTypeEnum.PDF:
                return 'FilePdf';
            case NotificationTypeEnum.EXCEL:
                return 'FileExcel';
            case NotificationTypeEnum.ALERT:
                return 'Warning';
            default:
                return 'Info';
        }
    };

    const getStatusIcon = (status: NotificationStatusEnum): { icon: IconNameType; color: 'error' | 'info' | 'success' | 'warning' } => {
        switch (status) {
            case NotificationStatusEnum.OK:
                return { icon: 'CheckCircleOutlined', color: 'success' };
            case NotificationStatusEnum.ERROR:
                return { icon: 'ErrorOutlineOutlined', color: 'error' };
            case NotificationStatusEnum.WARNING:
                return { icon: 'WarningAmberOutlined', color: 'warning' };
            default:
                return { icon: 'InfoOutlineRounded', color: 'info' };
        }
    };
    return (
        <ListItemButton onClick={handleClick} className={!dense ? 'p-0' : ''}>
            <ListItem
                className={!dense ? 'p-2' : ''}
                secondaryAction={
                    notification.seen ? null : showSeenIndicator ? (
                        <AppIcon name="FiberManualRecordRounded" sx={{ width: '17px!important', height: '17px!important', color: stylesResources.theme.palette.primary.main + '!important' }} />
                    ) : null
                }
            >
                <ListItemAvatar className="me-2">
                    <Badge
                        badgeContent={<AppIcon name={getStatusIcon(notification.status).icon} sx={{ color: 'white!important' }} />}
                        slotProps={{ badge: { className: 'p-0' } }}
                        color={getStatusIcon(notification.status).color}
                        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                    >
                        <Avatar sx={{ backgroundColor: 'grey.100', width: typeSize, height: typeSize }}>
                            <AppIcon name={getTypeIcon(notification.type)} color="primary" sx={{ width: `${iconSize}px!important`, height: `${iconSize}px!important` }} />
                        </Avatar>
                    </Badge>
                </ListItemAvatar>
                <ListItemText primary={notification.content} secondary={appTool.formatFancyTime(dayjs(notification.addedAt))} />
            </ListItem>
        </ListItemButton>
    );
}

interface INotificationItemProps {
    notification: Notification;
    onClick: (id: number) => void;
    dense?: boolean;
    showSeenIndicator?: boolean;
}

function NotificationNotFound(): JSX.Element {
    return (
        <Box className="d-flex justify-content-center flex-column align-items-center mt-5">
            <AppIcon name="NotificationsOffRounded" size="large" className="mb-2" color="secondary" />
            <Italic color="secondary" sx={{ fontWeight: 'bold', textAlign: 'center' }}>
                Aucune notification reçue pour le moment...
            </Italic>
        </Box>
    );
}

// #region IPROPS -->  /////////////////////////////////////
// #enderegion IPROPS --> //////////////////////////////////
