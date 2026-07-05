import { RefObject, useCallback, useContext, useState } from 'react';
import { AppError, ErrorTypeEnum } from '~/core/appError';
import { BulkTypeEnum, GenericActionEnum, ICenter, ICenterConfig } from '~/types/centerType';
import { ApiErrorType } from '~/models/Error';
import useModal from './useModal';
import useResources from './useResources';
import useService from './useService';
import appTool from '~/helpers/appTool';
import SearchContext, { SearchField } from '~/context/searchContext';
import { QueryResult } from '~/types/serverCoreType';
import useServiceBase from './useServiceBase';
import AppContext from '~/context/appContext';
import useCenterContext from '~/context/centerContext';
import { LevelAccessEnum } from '~/models/Session';
import SessionContext from '~/context/sessionContext';
import { GridPaginationModel } from '@mui/x-data-grid';
import useNavigation from './useNavigation';
import useToast from './useToast';
// on déclare ce que chaque module exporte

export function useCenterActions<T>({ props, action, id }: ICenterActionsProps<T>): ICenterActions<T> {
    const Service = useService();
    const { asServicePromise } = useServiceBase();
    const Search = useContext(SearchContext);
    const Resources = useResources();
    const Modal = useModal();
    const App = useContext(AppContext);
    const CenterCtx = useCenterContext<T>();
    const Nav = useNavigation();
    const Toast = useToast();

    const goBackToTable = (): void => {
        const back = Search.buildBackURL(props.entity);
        Nav.navigateByPath(back);
        window.scrollTo({
            top: 0,
        });
    };

    const handleStandardFormError = (err: ApiErrorType): void => {
        (err.data as { field: string; name: string; message: string }[]).forEach((e) => {
            if (e.message.includes('validate')) {
                CenterCtx.dispatch({ type: 'SET_VAL_MOD_VISIBLE', payload: true });
                CenterCtx.dispatch({ type: 'SET_VAL_MOD_CONTENT', payload: { title: err.message, message: err.detailedMessage } });
                CenterCtx.dispatch({ type: 'SET_FOCUS_ERROR', payload: err.code.split('¤')[1] });
            } else {
                Toast.error(e.message, null, false);
                CenterCtx.dispatch({ type: 'SET_FOCUS_ERROR', payload: e.field });
            }
        });
        throw new AppError(ErrorTypeEnum.Functional, err.detailedMessage, err.code);
    };

    const getConfig = async (): Promise<ICenterConfig<T>> => {
        try {
            const config = await asServicePromise<ICenterConfig<T>>(() => Service.get(`${props.entity.toLowerCase()}/config${props.isSubCenter ? `?${props.parentField}=${props.parentId}&isSub=true` : ''}`));

            const vocabularyRegex = /^\$.*\..*/;
            const mapObj = (obj: unknown): void => {
                if (typeof obj === 'object') {
                    for (const key in obj) {
                        if (typeof obj[key] === 'string' && vocabularyRegex.test(obj[key])) {
                            obj[key] = Resources.parseTranslate(obj[key]);
                        } else if (typeof obj[key] === 'object') {
                            mapObj(obj[key]);
                        } else if (Array.isArray(obj[key])) {
                            mapArr(obj[key]);
                        }
                    }
                }
            };
            const mapArr = (arr: unknown[]): void => {
                arr.forEach((x) => {
                    if (typeof x === 'object') {
                        mapObj(x);
                    }
                });
            };
            mapObj(config);
            if (action === GenericActionEnum.TABLE && !props.isSubCenter) {
                Search.parseSearchURL(config?.tableStructure, config?.searchFormTemplate);
            }
            if (props.isSubCenter) {
                Search.setMaxRows(10);
            }
            CenterCtx.dispatch({ type: 'SET_CONFIG', payload: config });
            return config;
        } catch (err) {
            CenterCtx.dispatch({ type: 'SET_LOADING', payload: false });
            CenterCtx.dispatch({ type: 'SET_CONFIG', payload: null });
            if (err?.code === 'no_access_granted') {
                App.setIsNoAccess(true);
            } else if (err?.code === 'not_found') {
                App.setNotFound(true);
            } else {
                throw AppError.fromAppError(err as AppError);
            }
        } finally {
            CenterCtx.dispatch({ type: 'SET_INITIALIZED', payload: true });
        }
    };

    const centerUpdate = async (e: FormData, subId?: string): Promise<void> => {
        // e.set('ID', subId ?? id);
        // e.set('GenericAction', action);

        CenterCtx.dispatch({ type: 'SET_SUBMIT_LOADING', payload: true });
        CenterCtx.dispatch({ type: 'SET_ALERT_VISIBLE', payload: false });

        await asServicePromise<{ success: boolean } | ApiErrorType>(() => Service.put(`${props.entity.toLowerCase()}/${subId ?? id}${props.isSubCenter ? '?isSub=true' : ''}`, null, e))
            .then((res: { success: boolean }) => {
                if (res.success) {
                    CenterCtx.dispatch({ type: 'CLEAR_FOCUS_ERROR' });
                    Toast.success(
                        Resources.translate('center.update.success', {
                            fem: CenterCtx.state.config?.grammar.isFem ? 'e' : '',
                            entity: CenterCtx.state.config?.grammar.singular,
                        }) as string,
                        null,
                        true
                    );
                    if (!props.isSubCenter) {
                        goBackToTable();
                    } else {
                        CenterCtx.dispatch({ type: 'SET_REFRESH', payload: true });
                        CenterCtx.dispatch({ type: 'SET_MINI_FORM_MOD', payload: false });
                    }
                }
            })
            .catch((error) => {
                const err = error as unknown as ApiErrorType;
                if (props.onCreateError) {
                    props.onCreateError(err);
                } else {
                    if (err.code === 'check_field_data') {
                        handleStandardFormError(err);
                    } else {
                        throw new AppError(ErrorTypeEnum.Functional, err.message, err.code, err.detailedMessage, err.data);
                    }
                }
            })
            .finally(() => CenterCtx.dispatch({ type: 'SET_SUBMIT_LOADING', payload: false }));
    };

    const centerNew = async (e: FormData): Promise<void> => {
        e.set('GenericAction', action);
        CenterCtx.dispatch({ type: 'SET_SUBMIT_LOADING', payload: true });
        CenterCtx.dispatch({ type: 'CLEAR_FOCUS_ERROR' });

        await asServicePromise<{ success: boolean } | ApiErrorType>(() => Service.post(props.entity + (props.isSubCenter ? '?isSub=true' : ''), null, e))
            .then((res: { success: boolean }) => {
                if (res.success) {
                    CenterCtx.dispatch({
                        type: 'SET_ALERT',
                        payload: {
                            severity: 'success',
                            title: Resources.translate('center.create.success', {
                                fem: CenterCtx.state.config?.grammar.isFem ? 'e' : '',
                                entity: CenterCtx.state.config?.grammar.singular,
                            }) as string,
                        },
                    });
                    Toast.success(
                        Resources.translate('center.create.success', {
                            fem: CenterCtx.state.config?.grammar.isFem ? 'e' : '',
                            entity: CenterCtx.state.config?.grammar.singular,
                        }) as string,
                        null,
                        true
                    );
                    CenterCtx.dispatch({ type: 'CLEAR_FOCUS_ERROR' });
                    if (!props.isSubCenter) {
                        goBackToTable();
                    } else {
                        CenterCtx.dispatch({ type: 'SET_REFRESH', payload: true });
                        CenterCtx.dispatch({ type: 'SET_MINI_FORM_MOD', payload: false });
                    }
                } else {
                    const err = res as unknown as ApiErrorType;
                    if (err.code === 'check_field_data') {
                        handleStandardFormError(err);
                    } else {
                        throw new AppError(ErrorTypeEnum.Functional, err.message, err.code, err.detailedMessage, err.data);
                    }
                }
            })
            .catch((err: AppError) => {
                if (props.onCreateError) {
                    props.onCreateError(err);
                } else {
                    throw AppError.fromAppError(err);
                }
            })
            .finally(() => CenterCtx.dispatch({ type: 'SET_SUBMIT_LOADING', payload: false }));
    };

    const centerDelete = async (subId?: string): Promise<boolean> => {
        CenterCtx.dispatch({ type: 'SET_SUBMIT_LOADING', payload: true });
        CenterCtx.dispatch({ type: 'SET_ALERT_VISIBLE', payload: false });

        if (props.onDelete) props.onDelete(subId ?? id);

        await asServicePromise<{ success: boolean } | ApiErrorType>(() => Service.del(`${props.entity.toLowerCase()}/${subId ?? id}${props.isSubCenter ? '?isSub=true' : ''}`))
            .then((res: { success: boolean }) => {
                if (res.success) {
                    Toast.success(
                        Resources.translate('center.delete.success', {
                            fem: CenterCtx.state.config?.grammar.isFem ? 'e' : '',
                            entity: CenterCtx.state.config?.grammar.singular,
                        }) as string
                    );
                    CenterCtx.dispatch({ type: 'CLEAR_FOCUS_ERROR' });
                    if (!props.isSubCenter) {
                        goBackToTable();
                    } else {
                        CenterCtx.dispatch({ type: 'SET_REFRESH', payload: true });
                        CenterCtx.dispatch({ type: 'SET_MINI_FORM_MOD', payload: false });
                    }
                }
            })
            .catch((err: AppError) => {
                throw AppError.fromAppError(err);
            })
            .finally(() => CenterCtx.dispatch({ type: 'SET_SUBMIT_LOADING', payload: false }));

        return true;
    };

    const centerExport = async (type: 'csv' | 'xlsx'): Promise<void> => {
        const searchQuery = Search.buildSearchURL(props.entity);
        const query = new URLSearchParams(searchQuery);
        if (CenterCtx.state.bulkSelection.length > 0) {
            query.append('ID', CenterCtx.state.bulkSelection.join(','));
        }
        await asServicePromise(() => Service.downloadFile(`${props.entity.toLowerCase()}/export?exportType=${type}&${decodeURIComponent(query.toString())}`));
    };

    const getBulkUpdateTemplate = async (): Promise<void> => {
        CenterCtx.dispatch({ type: 'SET_BULK_TEMP_LOADING', payload: true });
        const searchQuery = Search.buildSearchURL(props.entity);
        const query = new URLSearchParams(searchQuery);
        if (CenterCtx.state.bulkSelection.length > 0) {
            query.append('ID', CenterCtx.state.bulkSelection.join(','));
        }
        await asServicePromise(() => Service.downloadFile(`${props.entity.toLowerCase()}/bulkUpdateTemplate${query}`).finally(() => CenterCtx.dispatch({ type: 'SET_BULK_TEMP_LOADING', payload: false })));
    };

    const getBulkAddTemplate = async (): Promise<void> => {
        CenterCtx.dispatch({ type: 'SET_BULK_TEMP_LOADING', payload: true });
        await asServicePromise(() => Service.downloadFile(`${props.entity.toLowerCase()}/bulkAddTemplate`).finally(() => CenterCtx.dispatch({ type: 'SET_BULK_TEMP_LOADING', payload: false })));
    };

    const centerBulkUpdate = async (files: File[]): Promise<void> => {
        const form = new FormData();
        form.append('file', files[0]);
        form.append('GenericAction', 'bulkUpdate');
        CenterCtx.dispatch({ type: 'SET_BULK_SENDING', payload: true });
        const searchQuery = Search.buildSearchURL(props.entity);
        const query = new URLSearchParams(searchQuery);
        if (CenterCtx.state.bulkSelection.length > 0) {
            query.append('ID', CenterCtx.state.bulkSelection.join(','));
        }
        await asServicePromise<{ success: boolean }>(() => Service.put(`${props.entity.toLowerCase()}/bulkUpdate?${query.toString()}`, null, form))
            .then((res) => {
                if (res.success) {
                    CenterCtx.dispatch({ type: 'SET_BULK_MODAL_OPEN', payload: false });
                    CenterCtx.dispatch({
                        type: 'SET_ALERT',
                        payload: {
                            severity: 'success',
                            title: Resources.translate('center.update.success', {
                                fem: CenterCtx.state.config?.grammar.isFem ? 'e' : '',
                                entity: CenterCtx.state.config?.grammar.singular,
                            }) as string,
                        },
                    });
                    CenterCtx.dispatch({ type: 'SET_ALERT_VISIBLE', payload: true });
                    CenterCtx.dispatch({ type: 'CLEAR_FOCUS_ERROR' });
                    CenterCtx.dispatch({ type: 'SET_REFRESH', payload: false });
                    setTimeout(() => CenterCtx.dispatch({ type: 'SET_ALERT_VISIBLE', payload: false }), 10_000);
                }
            })
            .finally(() => CenterCtx.dispatch({ type: 'SET_BULK_SENDING', payload: false }));
    };

    const centerBulkAdd = async (files: File[]): Promise<void> => {
        const form = new FormData();
        form.append('file', files[0]);
        if (CenterCtx.state.bulkSelection.length > 0) {
            form.append('ids', CenterCtx.state.bulkSelection.join(','));
        }
        form.append('GenericAction', 'bulkNew');
        await asServicePromise<{ success: boolean }>(() => Service.post(`${props.entity.toLowerCase()}/bulkAdd`, null, form))
            .then((res) => {
                if (res.success) {
                    Modal.closeModal();
                }
            })
            .catch((_) => {})
            .finally(() => CenterCtx.dispatch({ type: 'SET_BULK_SENDING', payload: false }));
    };
    return {
        getConfig,
        centerNew,
        centerUpdate,
        centerDelete,
        centerExport,
        getBulkAddTemplate,
        getBulkUpdateTemplate,
        centerBulkAdd,
        centerBulkUpdate,
    };
}

interface ICenterActions<T> {
    getConfig: (handleTableStruct?: (struct: ICenterConfig<T>) => void, handleFormStruct?: (struct: ICenterConfig<T>) => void, handleSearchFormStruct?: (struct: ICenterConfig<T>) => void) => Promise<ICenterConfig<T>>;
    centerNew: (e: FormData) => Promise<void>;
    centerUpdate: (e: FormData, subId?: string) => Promise<void>;
    centerDelete: (subId?: string) => Promise<boolean>;
    centerExport: (type: 'csv' | 'xlsx') => Promise<void>;
    getBulkUpdateTemplate: () => Promise<void>;
    getBulkAddTemplate: () => Promise<void>;
    centerBulkAdd: (files: File[]) => Promise<void>;
    centerBulkUpdate: (files: File[]) => Promise<void>;
}

interface ICenterActionsProps<T> {
    props: ICenter<T>;
    action: GenericActionEnum;
    id?: string;
}

export function useCenterQuery<T>({ props, action, id }: ICenterActionsProps<T>): ICenterQuery {
    const Service = useService();
    const { asServicePromise } = useServiceBase();
    const Search = useContext(SearchContext);
    const CenterCtx = useCenterContext<T>();
    const App = useContext(AppContext);
    // const { setSearchURL } = useCenterTools({ props, action, id });

    const tableQuery = async (filters?: SearchField[]): Promise<void> => {
        CenterCtx.dispatch({ type: 'SET_TABLE_LOADING', payload: true });
        if (!CenterCtx.state.datas) {
            CenterCtx.dispatch({ type: 'SET_LOADING', payload: true });
        }
        if (props.isSubCenter) {
            const splitted = props.parentField.split('&');
            filters = splitted.map((p) => {
                const s = p.split('=');
                if (s.length === 1) {
                    return { field: s[0], fieldName: '', values: props.parentId };
                } else {
                    return { field: s[0], fieldName: '', values: s[1] };
                }
            });
            filters.push({ field: 'isSub', fieldName: '', values: 'true' });
        }
        const query = appTool.BuildSearchURL(filters ? filters : Search.filters, Search.sortedBy);
        await asServicePromise<QueryResult<T> | ApiErrorType>(() => Service.get(`${props.entity}?limit=${Search.maxRows}&offset=${Search.maxRows * Search.page}${query}`))
            .then((res) => {
                CenterCtx.dispatch({ type: 'SET_DATAS', payload: res as QueryResult<T> });
                if (!props.isSubCenter) {
                    // setSearchURL();
                }
                if (CenterCtx.state.isTableError) CenterCtx.dispatch({ type: 'SET_TABLE_ERROR', payload: false });
                if (CenterCtx.state.tableErrorMessage) CenterCtx.dispatch({ type: 'SET_TABLE_ERROR', payload: null });
            })
            .catch((err) => {
                if ((err as AppError).code === 'no_access_granted') {
                    App.setIsNoAccess(true);
                } else {
                    CenterCtx.dispatch({ type: 'SET_TABLE_ERROR', payload: false });
                    CenterCtx.dispatch({ type: 'SET_TABLE_ERR_MESS', payload: err.message });
                    throw new AppError(err.type, err.message, err.code);
                }
            })
            .finally(() => {
                CenterCtx.dispatch({ type: 'SET_LOADING', payload: false });
                CenterCtx.dispatch({ type: 'SET_TABLE_LOADING', payload: false });
                CenterCtx.dispatch({ type: 'SET_REFRESH', payload: false });
            });
    };

    const queryOne = async (subId?: string, _action?: GenericActionEnum): Promise<void> => {
        if (action === GenericActionEnum.SUB_TABLE) {
            CenterCtx.dispatch({ type: 'SET_MINI_LOADING', payload: true });
        } else {
            CenterCtx.dispatch({ type: 'SET_LOADING', payload: true });
        }

        await asServicePromise<T[] | ApiErrorType>(() => Service.get(`${props.entity}/${subId ? subId : id}${props.isSubCenter ? '?isSub=true' : ''}`))
            .then((res: T[]) => {
                CenterCtx.dispatch({ type: 'SET_DATA', payload: res[0] });
                if (props.getData) {
                    props.getData(res[0]);
                }
            })
            .finally(() => {
                if (action === GenericActionEnum.SUB_TABLE) {
                    CenterCtx.dispatch({ type: 'SET_MINI_LOADING', payload: false });
                }
                CenterCtx.dispatch({ type: 'SET_LOADING', payload: false });
                CenterCtx.dispatch({ type: 'SET_REFRESH', payload: false });
            });
    };
    return { tableQuery, queryOne };
}
interface ICenterQuery {
    tableQuery: (filters?: SearchField[]) => Promise<void>;
    queryOne: (id?: string, _action?: GenericActionEnum) => Promise<void>;
}

export function useCenterTools<T>({ props, action, id }: ICenterActionsProps<T>): ICenterTools {
    const [subId, setSubId] = useState<string>(null);

    const { centerNew, centerUpdate, centerDelete, centerBulkAdd, centerBulkUpdate, getBulkAddTemplate, getBulkUpdateTemplate } = useCenterActions<T>({ props, action, id });
    const { queryOne } = useCenterQuery({ props, action, id });

    const Search = useContext(SearchContext);
    const CenterCtx = useCenterContext<T>();
    const Ses = useContext(SessionContext);
    const Resources = useResources();

    /**
     * @description Méthode qui gère le changement du nombre de lignes par page sur le tableau
     * @param {GridPaginationModel} e
     */
    const handleRowsPerPage = (e: GridPaginationModel): void => {
        const totalPage = Math.ceil(CenterCtx.state.datas.totalRecords / e.pageSize);
        let targetPage: number = Search.page;
        if (targetPage > totalPage - 1) {
            while (targetPage >= totalPage - 1 && totalPage > 0) {
                targetPage--;
            }
            Search.setPage(targetPage + 1);
        }
        Search.setMaxRows(e.pageSize);
        CenterCtx.dispatch({ type: 'SET_REFRESH', payload: true });
    };

    const setSearchURL = (): void => {
        const url = new URL(window.location.href);
        const query = Search.buildSearchURL(props.entity);
        if (url.search.toLowerCase() !== query.toLowerCase()) {
            url.search = query.toString();
            history.replaceState(null, '', url);
        }
    };

    /**
     * @description Méthode pour gérer les changements de pages
     * @param {number} e numéro de page
     * @returns
     * @throws AppError
     **/
    const handlePageChange = (e: number): void => {
        Search.setPage(e);
        CenterCtx.dispatch({ type: 'SET_REFRESH', payload: true });
    };

    const canDoBulk = (type: BulkTypeEnum): boolean => {
        const levelKey = {
            add: 'levelBulkNew',
            update: 'levelBulkUpdate',
            delete: 'levelBulkDelete',
        }[type];
        return CenterCtx.state.config?.[levelKey] <= Ses.accessLevel && CenterCtx.state.config?.[levelKey] !== LevelAccessEnum.NOBODY;
    };

    const sendBulkFile = async (value: File[], type: BulkTypeEnum): Promise<void> => {
        if (type === BulkTypeEnum.ADD && CenterCtx.state.config?.levelBulkNew > Ses.accessLevel && CenterCtx.state.config?.levelBulkNew !== LevelAccessEnum.NOBODY) return;
        if (type === BulkTypeEnum.UPDATE && CenterCtx.state.config?.levelBulkUpdate > Ses.accessLevel && CenterCtx.state.config?.levelBulkUpdate !== LevelAccessEnum.NOBODY) return;
        if (type === BulkTypeEnum.DELETE && CenterCtx.state.config?.levelBulkDelete > Ses.accessLevel && CenterCtx.state.config?.levelBulkDelete !== LevelAccessEnum.NOBODY) return;
        if (!value) {
            CenterCtx.dispatch({ type: 'SET_BULK_ALERT_VISIBLE', payload: true });
            CenterCtx.dispatch({ type: 'SET_BULK_ALERT_MSG', payload: 'un fichier est requis' });
            return;
        }
        CenterCtx.dispatch({ type: 'SET_BULK_ALERT_VISIBLE', payload: false });
        if (type === BulkTypeEnum.ADD) await centerBulkAdd(value);
        if (type === BulkTypeEnum.UPDATE) await centerBulkUpdate(value);
    };

    const openBulkModal = (type: BulkTypeEnum): void => {
        if (type === BulkTypeEnum.ADD && CenterCtx.state.config?.levelBulkNew > Ses.accessLevel && CenterCtx.state.config?.levelBulkNew !== LevelAccessEnum.NOBODY) return;
        if (type === BulkTypeEnum.UPDATE && CenterCtx.state.config?.levelBulkUpdate > Ses.accessLevel && CenterCtx.state.config?.levelBulkUpdate !== LevelAccessEnum.NOBODY) return;
        if (type === BulkTypeEnum.DELETE && CenterCtx.state.config?.levelBulkDelete > Ses.accessLevel && CenterCtx.state.config?.levelBulkDelete !== LevelAccessEnum.NOBODY) return;
        CenterCtx.dispatch({ type: 'SET_BULK_TYPE', payload: type });
        CenterCtx.dispatch({ type: 'SET_BULK_MODAL_OPEN', payload: true });
    };

    const handleMiniFormSubmit = async (miniFormRef: RefObject<HTMLFormElement>): Promise<void> => {
        CenterCtx.dispatch({ type: 'SET_SUBMIT_LOADING', payload: true });
        const form = new FormData(miniFormRef.current);
        switch (form.get('action')) {
            case GenericActionEnum.NEW:
                await centerNew(form);
                break;
            case GenericActionEnum.UPDATE:
                await centerUpdate(form, subId);
                break;
            case GenericActionEnum.DELETE:
                await centerDelete(subId);
                break;
            default:
                break;
        }
    };

    /**
     * @description Méthode qui gère l'ouverture et fermeture de la sous table
     * @param {GenericActionEnum} providedAction action du formulaire
     * @param {string} id id du record
     */
    const handleOpenMiniForm = async (providedAction: GenericActionEnum = GenericActionEnum.NEW, id?: string): Promise<void> => {
        CenterCtx.dispatch({ type: 'SET_MINI_FORM_LOADING', payload: true });
        CenterCtx.dispatch({ type: 'SET_MINI_FORM_MOD', payload: true });
        let actionLabel = '';
        switch (providedAction) {
            case GenericActionEnum.NEW:
                actionLabel = Resources.translate('common.add') as string;
                break;
            case GenericActionEnum.UPDATE:
                actionLabel = Resources.translate('common.update') as string;
                break;
            case GenericActionEnum.DELETE:
                actionLabel = Resources.translate('common.delete') as string;
                break;
            case GenericActionEnum.VIEW:
                actionLabel = Resources.translate('common.details') as string;
                break;
            default:
                break;
        }

        CenterCtx.dispatch({ type: 'SET_MINI_FORM_OPT', payload: { ...CenterCtx.state.miniFormModalOptions, title: `${actionLabel} ${CenterCtx.state.config?.grammar.singular.toLocaleLowerCase()}` } });
        if (id && providedAction !== GenericActionEnum.NEW) {
            // si on a un id on charge le record
            setSubId(id);
            await queryOne(id, providedAction)
                .then(() => CenterCtx.dispatch({ type: 'SET_MINI_TABLE_ACTION', payload: providedAction }))
                .finally(() => CenterCtx.dispatch({ type: 'SET_MINI_FORM_LOADING', payload: false }));
        } else {
            setSubId(null);
            CenterCtx.dispatch({ type: 'SET_DATA', payload: null });
            CenterCtx.dispatch({ type: 'SET_MINI_TABLE_ACTION', payload: providedAction });
            CenterCtx.dispatch({ type: 'SET_MINI_FORM_LOADING', payload: false });
        }
    };

    // /**
    //  * @description Méthode pour charger la configuration du centre
    //  */
    // const buildMiniForm = (): void => {
    //     CenterCtx.dispatch({ type: 'SET_MINI_FORM_OPT', payload: { ...CenterCtx.state.miniFormModalOptions, fullPage: true } });
    // };

    const onTemplateClick = useCallback(async (): Promise<void> => {
        if (CenterCtx.state.bulkType === BulkTypeEnum.ADD) {
            await getBulkAddTemplate();
        } else if (CenterCtx.state.bulkType === BulkTypeEnum.UPDATE) {
            await getBulkUpdateTemplate();
        }
    }, [CenterCtx.state.bulkType]);

    return {
        sendBulkFile,
        openBulkModal,
        canDoBulk,
        handleRowsPerPage,
        handlePageChange,
        handleMiniFormSubmit,
        handleOpenMiniForm,
        onTemplateClick,
        setSearchURL,
    };
}

interface ICenterTools {
    sendBulkFile: (value: File[], type: BulkTypeEnum) => Promise<void>;
    openBulkModal: (type: BulkTypeEnum) => void;
    handleRowsPerPage: (e: GridPaginationModel) => void;
    canDoBulk: (type: BulkTypeEnum) => boolean;
    handlePageChange: (e: number) => void;
    handleMiniFormSubmit: (miniFormRef: RefObject<HTMLFormElement>) => Promise<void>;
    handleOpenMiniForm: (action?: GenericActionEnum, id?: string) => Promise<void>;
    onTemplateClick: () => Promise<void>;
    setSearchURL: () => void;
}
