import { RefObject, useCallback, useState } from 'react';
import { AppError, ErrorTypeEnum } from '~/core/appError';
import { BulkTypeEnum, GenericActionEnum, ICenter, ICenterConfig } from '~/types/centerType';
import { ApiErrorType } from '~/models/Error';
import useModal from './useModal';
import useResources from './useResources';
import useService from './useService';
import appTool from '~/helpers/appTool';
import { SearchField } from '~/context/searchContext';
import { QueryResult, ServiceResponse } from '~/types/serverCoreType';
import useServiceBase from './useServiceBase';
import useCenterContext from '~/context/centerContext';
import { LevelAccessEnum } from '~/models/Session';
import { GridPaginationModel } from '@mui/x-data-grid';
import useNavigation from './useNavigation';
import useToast from './useToast';
import { FormMakerFocusErrorType } from '~/types/FormMakerCoreTypes';
import useSearchContext from '~/context/searchContext';
import useSessionContext from '~/context/sessionContext';
import useAppContext from '~/context/appContext';
import centerRouteHelper from '~/helpers/centerRouteHelper';
// on déclare ce que chaque module exporte

const genericError = ['validate', 'uniq_field', 'required_field', 'check_field_data'];

export function useCenterActions<T>({ props, action, id }: ICenterActionsProps<T>): ICenterActions<T> {
    const { get, post, put, del, downloadFile } = useService();
    const { asServicePromise } = useServiceBase();
    const { buildSearchURL, buildBackURL, parseSearchURL, setMaxRows } = useSearchContext();
    const { translate, parseTranslate } = useResources();
    const Modal = useModal();
    const { setNotFound, setIsNoAccess } = useAppContext();
    const { state, dispatch } = useCenterContext<T>();
    const Nav = useNavigation();
    const Toast = useToast();

    const goBackToTable = (): void => {
        const back = buildBackURL(props.entity, props.basePath);
        Nav.navigateByPath(back);
        window.scrollTo({
            top: 0,
        });
    };

    const handleStandardFormError = (err: ApiErrorType): void => {
        if (err.message.includes('validate')) {
            dispatch({ type: 'SET_VAL_MOD_VISIBLE', payload: true });
            dispatch({ type: 'SET_VAL_MOD_CONTENT', payload: { title: err.message, message: err.detailedMessage } });
            dispatch({ type: 'SET_FOCUS_ERROR', payload: err.data as FormMakerFocusErrorType[] });
        } else {
            // Toast.error(err.message, null, true, 20_000);
            dispatch({ type: 'SET_FOCUS_ERROR', payload: err.data as FormMakerFocusErrorType[] });
        }
        // throw new AppError(ErrorTypeEnum.Functional, err.detailedMessage, err.code);
    };

    const getConfig = async (): Promise<ICenterConfig<T>> => {
        try {
            const parentParams = centerRouteHelper.getParentConfigParams(props.isSubCenter, props.parentField, props.parentId, props.parents);
            const config = await asServicePromise<ICenterConfig<T>>(() => get(centerRouteHelper.buildApiUrl(`${props.entity.toLowerCase()}/config`, parentParams)));

            const vocabularyRegex = /^\$.*\..*/;
            const mapObj = (obj: Record<string, unknown> | null): void => {
                if (obj && typeof obj === 'object') {
                    for (const key in obj) {
                        if (typeof obj[key] === 'string' && vocabularyRegex.test(obj[key])) {
                            obj[key] = parseTranslate(obj[key]);
                        } else if (Array.isArray(obj[key])) {
                            mapArr(obj[key]);
                        } else if (obj[key] && typeof obj[key] === 'object') {
                            mapObj(obj[key] as Record<string, unknown>);
                        }
                    }
                }
            };
            const mapArr = (arr: unknown[]): void => {
                arr.forEach((x) => {
                    if (x && typeof x === 'object') {
                        mapObj(x as Record<string, unknown>);
                    }
                });
            };
            mapObj(config as unknown as Record<string, unknown>);
            if (action === GenericActionEnum.TABLE && !props.isSubCenter) {
                parseSearchURL(config?.tableStructure, config?.searchFormTemplate);
            }
            if (props.isSubCenter) {
                setMaxRows(10);
            }
            dispatch({ type: 'SET_CONFIG', payload: config });
            return config;
        } catch (err) {
            dispatch({ type: 'SET_LOADING', payload: false });
            dispatch({ type: 'SET_CONFIG', payload: null });
            if (err?.code === 'no_access_granted') {
                setIsNoAccess(true);
            } else if (err?.code === 'not_found') {
                setNotFound(true);
            } else {
                console.error(err);
                throw AppError.fromAppError(err as AppError);
            }
        } finally {
            dispatch({ type: 'SET_INITIALIZED', payload: true });
        }
    };

    const centerUpdate = async (e: FormData, subId?: string): Promise<void> => {
        // e.set('ID', subId ?? id);
        // e.set('GenericAction', action);

        dispatch({ type: 'SET_SUBMIT_LOADING', payload: true });
        dispatch({ type: 'SET_ALERT_VISIBLE', payload: false });

        const parentParams = centerRouteHelper.getParentRequestParams(props.isSubCenter, props.parents);
        await asServicePromise<ServiceResponse | ApiErrorType>(() => put(centerRouteHelper.buildApiUrl(`${props.entity.toLowerCase()}/${subId ?? id}`, parentParams), null, e))
            .then((res: ServiceResponse) => {
                if (res.success) {
                    dispatch({ type: 'CLEAR_FOCUS_ERROR' });
                    Toast.success(
                        translate('center.update.success', {
                            fem: state.config?.grammar.isFem ? 'e' : '',
                            entity: state.config?.grammar.singular,
                        }) as string,
                        null,
                        true
                    );
                    if (!props.isSubCenter) {
                        if (state.config?.updateUrlFallback) {
                            const url = state.config.updateUrlFallback.replace(':id', id);
                            Nav.navigateByPath(url);
                        } else {
                            goBackToTable();
                        }
                    } else {
                        dispatch({ type: 'SET_REFRESH', payload: true });
                        dispatch({ type: 'SET_MINI_FORM_MOD', payload: false });
                    }
                }
            })
            .catch((error) => {
                const err = error as unknown as ApiErrorType;
                if (props.onUpdateError) {
                    props.onUpdateError(err);
                } else {
                    if (genericError.includes(err.code)) {
                        handleStandardFormError(err);
                    } else {
                        throw new AppError(ErrorTypeEnum.Functional, err.message, err.code, err.detailedMessage, err.data);
                    }
                }
            })
            .finally(() => dispatch({ type: 'SET_SUBMIT_LOADING', payload: false }));
    };

    const centerNew = async (e: FormData): Promise<void> => {
        e.set('GenericAction', action);
        dispatch({ type: 'SET_SUBMIT_LOADING', payload: true });
        dispatch({ type: 'CLEAR_FOCUS_ERROR' });

        if (props.onCreate) {
            try {
                await props.onCreate(e);
                return;
            } finally {
                dispatch({ type: 'SET_SUBMIT_LOADING', payload: false });
            }
        }

        const parentParams = centerRouteHelper.getParentRequestParams(props.isSubCenter, props.parents);
        await asServicePromise<ServiceResponse | ApiErrorType>(() => post(centerRouteHelper.buildApiUrl(props.entity, parentParams), null, e))
            .then((res: ServiceResponse) => {
                if (res.success) {
                    dispatch({
                        type: 'SET_ALERT',
                        payload: {
                            severity: 'success',
                            title: translate('center.create.success', {
                                fem: state.config?.grammar.isFem ? 'e' : '',
                                entity: state.config?.grammar.singular,
                            }) as string,
                        },
                    });
                    Toast.success(
                        translate('center.create.success', {
                            fem: state.config?.grammar.isFem ? 'e' : '',
                            entity: state.config?.grammar.singular,
                        }) as string,
                        null,
                        true
                    );
                    dispatch({ type: 'CLEAR_FOCUS_ERROR' });
                    if (!props.isSubCenter) {
                        goBackToTable();
                    } else {
                        dispatch({ type: 'SET_REFRESH', payload: true });
                        dispatch({ type: 'SET_MINI_FORM_MOD', payload: false });
                    }
                } else {
                    const err = res as unknown as ApiErrorType;
                    if (genericError.includes(err.code)) {
                        handleStandardFormError(err);
                    } else {
                        throw new AppError(ErrorTypeEnum.Functional, err.message, err.code, err.detailedMessage, err.data);
                    }
                }
            })
            .catch((err: AppError) => {
                if (props.onCreateError) {
                    props.onCreateError(err);
                } else if (genericError.includes(err.code)) {
                    handleStandardFormError(err as unknown as ApiErrorType);
                } else {
                    throw AppError.fromAppError(err);
                }
            })
            .finally(() => dispatch({ type: 'SET_SUBMIT_LOADING', payload: false }));
    };

    const centerDelete = async (subId?: string): Promise<boolean> => {
        dispatch({ type: 'SET_SUBMIT_LOADING', payload: true });
        dispatch({ type: 'SET_ALERT_VISIBLE', payload: false });

        if (props.onDelete) {
            try {
                await props.onDelete(subId ?? id);
                return true;
            } finally {
                dispatch({ type: 'SET_SUBMIT_LOADING', payload: false });
            }
        }

        const parentParams = centerRouteHelper.getParentRequestParams(props.isSubCenter, props.parents);
        await asServicePromise<ServiceResponse | ApiErrorType>(() => del(centerRouteHelper.buildApiUrl(`${props.entity.toLowerCase()}/${subId ?? id}`, parentParams)))
            .then((res: ServiceResponse) => {
                if (res.success) {
                    Toast.success(
                        translate('center.delete.success', {
                            fem: state.config?.grammar.isFem ? 'e' : '',
                            entity: state.config?.grammar.singular,
                        }) as string
                    );
                    dispatch({ type: 'CLEAR_FOCUS_ERROR' });
                    if (!props.isSubCenter) {
                        goBackToTable();
                    } else {
                        dispatch({ type: 'SET_REFRESH', payload: true });
                        dispatch({ type: 'SET_MINI_FORM_MOD', payload: false });
                    }
                }
            })
            .catch((err: AppError) => {
                throw AppError.fromAppError(err);
            })
            .finally(() => dispatch({ type: 'SET_SUBMIT_LOADING', payload: false }));

        return true;
    };

    const centerExport = async (type: 'csv' | 'xlsx'): Promise<void> => {
        const searchQuery = buildSearchURL(props.entity);
        const query = new URLSearchParams(searchQuery);
        centerRouteHelper.getParentRequestParams(props.isSubCenter, props.parents).forEach((value, key) => query.append(key, value));
        if (state.bulkSelection.length > 0) {
            query.append('ID', state.bulkSelection.join(','));
        }
        await asServicePromise(() => downloadFile(`${props.entity.toLowerCase()}/export?exportType=${type}&${decodeURIComponent(query.toString())}`));
    };

    const getBulkUpdateTemplate = async (): Promise<void> => {
        dispatch({ type: 'SET_BULK_TEMP_LOADING', payload: true });
        const searchQuery = buildSearchURL(props.entity);
        const query = new URLSearchParams(searchQuery);
        centerRouteHelper.getParentRequestParams(props.isSubCenter, props.parents).forEach((value, key) => query.append(key, value));
        if (state.bulkSelection.length > 0) {
            query.append('ID', state.bulkSelection.join(','));
        }
        await asServicePromise(() => downloadFile(`${props.entity.toLowerCase()}/bulkUpdateTemplate?${query}`).finally(() => dispatch({ type: 'SET_BULK_TEMP_LOADING', payload: false })));
    };

    const getBulkAddTemplate = async (): Promise<void> => {
        dispatch({ type: 'SET_BULK_TEMP_LOADING', payload: true });
        await asServicePromise(() => downloadFile(`${props.entity.toLowerCase()}/bulkAddTemplate`).finally(() => dispatch({ type: 'SET_BULK_TEMP_LOADING', payload: false })));
    };

    const centerBulkUpdate = async (files: File[]): Promise<void> => {
        const form = new FormData();
        form.append('file', files[0]);
        form.append('GenericAction', 'bulkUpdate');
        dispatch({ type: 'SET_BULK_SENDING', payload: true });
        const searchQuery = buildSearchURL(props.entity);
        const query = new URLSearchParams(searchQuery);
        centerRouteHelper.getParentRequestParams(props.isSubCenter, props.parents).forEach((value, key) => query.append(key, value));
        if (state.bulkSelection.length > 0) {
            query.append('ID', state.bulkSelection.join(','));
        }
        await asServicePromise<ServiceResponse>(() => put(`${props.entity.toLowerCase()}/bulkUpdate?${query.toString()}`, null, form))
            .then((res) => {
                if (res.success) {
                    dispatch({ type: 'SET_BULK_MODAL_OPEN', payload: false });
                    dispatch({
                        type: 'SET_ALERT',
                        payload: {
                            severity: 'success',
                            title: translate('center.update.success', {
                                fem: state.config?.grammar.isFem ? 'e' : '',
                                entity: state.config?.grammar.singular,
                            }) as string,
                        },
                    });
                    dispatch({ type: 'SET_ALERT_VISIBLE', payload: true });
                    dispatch({ type: 'CLEAR_FOCUS_ERROR' });
                    dispatch({ type: 'SET_REFRESH', payload: false });
                    setTimeout(() => dispatch({ type: 'SET_ALERT_VISIBLE', payload: false }), 10_000);
                }
            })
            .finally(() => dispatch({ type: 'SET_BULK_SENDING', payload: false }));
    };

    const centerBulkAdd = async (files: File[]): Promise<void> => {
        const form = new FormData();
        form.append('file', files[0]);
        if (state.bulkSelection.length > 0) {
            form.append('ids', state.bulkSelection.join(','));
        }
        form.append('GenericAction', 'bulkNew');
        const parentParams = centerRouteHelper.getParentRequestParams(props.isSubCenter, props.parents);
        await asServicePromise<ServiceResponse>(() => post(centerRouteHelper.buildApiUrl(`${props.entity.toLowerCase()}/bulkAdd`, parentParams), null, form))
            .then((res) => {
                if (res.success) {
                    Modal.closeModal();
                }
            })
            .catch((_) => {})
            .finally(() => dispatch({ type: 'SET_BULK_SENDING', payload: false }));
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
    getConfig: (
        handleTableStruct?: (struct: ICenterConfig<T>) => void,
        handleFormStruct?: (struct: ICenterConfig<T>) => void,
        handleSearchFormStruct?: (struct: ICenterConfig<T>) => void
    ) => Promise<ICenterConfig<T>>;
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

export function useCenterQuery<T>({ props, action: _action, id }: ICenterActionsProps<T>): ICenterQuery {
    const { get } = useService();
    const { asServicePromise } = useServiceBase();
    const { maxRows, sortedBy, page, filters } = useSearchContext();
    const { state, dispatch } = useCenterContext<T>();
    const { setIsNoAccess } = useAppContext();
    // const { setSearchURL } = useCenterTools({ props, action, id });

    const tableQuery = async (forcedFilters?: SearchField[]): Promise<void> => {
        dispatch({ type: 'SET_TABLE_LOADING', payload: true });
        if (!state.datas) {
            dispatch({ type: 'SET_LOADING', payload: true });
        }
        if (props.isSubCenter) {
            forcedFilters = centerRouteHelper.getLegacyParentFilters(props.parentField, props.parentId);
            forcedFilters.push({ field: 'isSub', fieldName: '', values: 'true' });
        }
        const query = appTool.BuildSearchURL(forcedFilters ? forcedFilters : filters, sortedBy);
        const parentParams = props.isSubCenter ? new URLSearchParams() : centerRouteHelper.getParentRequestParams(false, props.parents);
        await asServicePromise<QueryResult<T> | ApiErrorType>(() => get(centerRouteHelper.buildApiUrl(`${props.entity}?limit=${maxRows}&offset=${maxRows * page}${query}`, parentParams)))
            .then((res) => {
                dispatch({ type: 'SET_DATAS', payload: res as QueryResult<T> });
                if (!props.isSubCenter) {
                    // setSearchURL();
                }
                if (state.isTableError) dispatch({ type: 'SET_TABLE_ERROR', payload: false });
                if (state.tableErrorMessage) dispatch({ type: 'SET_TABLE_ERROR', payload: null });
            })
            .catch((err) => {
                if ((err as AppError).code === 'no_access_granted') {
                    setIsNoAccess(true);
                } else {
                    dispatch({ type: 'SET_TABLE_ERROR', payload: true });
                    dispatch({ type: 'SET_TABLE_ERR_MESS', payload: err.message });
                    throw new AppError(err.type, err.message, err.code);
                }
            })
            .finally(() => {
                dispatch({ type: 'SET_LOADING', payload: false });
                dispatch({ type: 'SET_TABLE_LOADING', payload: false });
                dispatch({ type: 'SET_REFRESH', payload: false });
            });
    };

    const queryOne = async (subId?: string, targetAction?: GenericActionEnum): Promise<void> => {
        const isMiniAction = targetAction !== undefined && targetAction !== GenericActionEnum.TABLE;

        if (isMiniAction) {
            dispatch({ type: 'SET_MINI_LOADING', payload: true });
        } else {
            dispatch({ type: 'SET_LOADING', payload: true });
        }

        const parentParams = centerRouteHelper.getParentRequestParams(props.isSubCenter, props.parents);
        await asServicePromise<T[] | ApiErrorType>(() => get(centerRouteHelper.buildApiUrl(`${props.entity}/${subId ? subId : id}`, parentParams)))
            .then((res: T[]) => {
                dispatch({ type: 'SET_DATA', payload: res[0] });
                if (props.getData) {
                    props.getData(res[0]);
                }
            })
            .finally(() => {
                if (isMiniAction) {
                    dispatch({ type: 'SET_MINI_LOADING', payload: false });
                } else {
                    dispatch({ type: 'SET_LOADING', payload: false });
                }
                dispatch({ type: 'SET_REFRESH', payload: false });
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

    const { page, setPage, buildSearchURL, setMaxRows } = useSearchContext();
    const { state, dispatch } = useCenterContext<T>();
    const { accessLevel } = useSessionContext();
    const { translate } = useResources();

    /**
     * @description Méthode qui gère le changement du nombre de lignes par page sur le tableau
     * @param {GridPaginationModel} e
     */
    const handleRowsPerPage = (e: GridPaginationModel): void => {
        const totalPage = Math.ceil(state.datas.totalRecords / e.pageSize);
        let targetPage: number = page;
        if (targetPage > totalPage - 1) {
            while (targetPage >= totalPage - 1 && totalPage > 0) {
                targetPage--;
            }
            setPage(targetPage + 1);
        }
        setMaxRows(e.pageSize);
        dispatch({ type: 'SET_REFRESH', payload: true });
    };

    const setSearchURL = (): void => {
        const url = new URL(window.location.href);
        const query = buildSearchURL(props.entity);
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
        setPage(e);
        dispatch({ type: 'SET_REFRESH', payload: true });
    };

    const canDoBulk = (type: BulkTypeEnum): boolean => {
        const levelKey = {
            add: 'levelBulkNew',
            update: 'levelBulkUpdate',
            delete: 'levelBulkDelete',
        }[type];
        return state.config?.[levelKey] <= accessLevel && state.config?.[levelKey] !== LevelAccessEnum.NOBODY;
    };

    const sendBulkFile = async (value: File[], type: BulkTypeEnum): Promise<void> => {
        if (type === BulkTypeEnum.ADD && state.config?.levelBulkNew > accessLevel && state.config?.levelBulkNew !== LevelAccessEnum.NOBODY) return;
        if (type === BulkTypeEnum.UPDATE && state.config?.levelBulkUpdate > accessLevel && state.config?.levelBulkUpdate !== LevelAccessEnum.NOBODY) return;
        if (type === BulkTypeEnum.DELETE && state.config?.levelBulkDelete > accessLevel && state.config?.levelBulkDelete !== LevelAccessEnum.NOBODY) return;
        if (!value) {
            dispatch({ type: 'SET_BULK_ALERT_VISIBLE', payload: true });
            dispatch({ type: 'SET_BULK_ALERT_MSG', payload: 'un fichier est requis' });
            return;
        }
        dispatch({ type: 'SET_BULK_ALERT_VISIBLE', payload: false });
        if (type === BulkTypeEnum.ADD) await centerBulkAdd(value);
        if (type === BulkTypeEnum.UPDATE) await centerBulkUpdate(value);
    };

    const openBulkModal = (type: BulkTypeEnum): void => {
        if (type === BulkTypeEnum.ADD && state.config?.levelBulkNew > accessLevel && state.config?.levelBulkNew !== LevelAccessEnum.NOBODY) return;
        if (type === BulkTypeEnum.UPDATE && state.config?.levelBulkUpdate > accessLevel && state.config?.levelBulkUpdate !== LevelAccessEnum.NOBODY) return;
        if (type === BulkTypeEnum.DELETE && state.config?.levelBulkDelete > accessLevel && state.config?.levelBulkDelete !== LevelAccessEnum.NOBODY) return;
        dispatch({ type: 'SET_BULK_TYPE', payload: type });
        dispatch({ type: 'SET_BULK_MODAL_OPEN', payload: true });
    };

    const handleMiniFormSubmit = async (miniFormRef: RefObject<HTMLFormElement>): Promise<void> => {
        dispatch({ type: 'SET_SUBMIT_LOADING', payload: true });
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
        dispatch({ type: 'SET_MINI_FORM_LOADING', payload: true });
        dispatch({ type: 'SET_MINI_FORM_MOD', payload: true });
        let actionLabel = '';
        switch (providedAction) {
            case GenericActionEnum.NEW:
                actionLabel = translate('common.add') as string;
                break;
            case GenericActionEnum.UPDATE:
                actionLabel = translate('common.update') as string;
                break;
            case GenericActionEnum.DELETE:
                actionLabel = translate('common.delete') as string;
                break;
            case GenericActionEnum.VIEW:
                actionLabel = translate('common.details') as string;
                break;
            default:
                break;
        }

        dispatch({
            type: 'SET_MINI_FORM_OPT',
            payload: { ...state.miniFormModalOptions, title: `${actionLabel} ${state.config?.grammar.singular.toLocaleLowerCase()}` },
        });
        if (id && providedAction !== GenericActionEnum.NEW) {
            // si on a un id on charge le record
            setSubId(id);
            await queryOne(id, providedAction)
                .then(() => dispatch({ type: 'SET_MINI_TABLE_ACTION', payload: providedAction }))
                .finally(() => dispatch({ type: 'SET_MINI_FORM_LOADING', payload: false }));
        } else {
            setSubId(null);
            dispatch({ type: 'SET_DATA', payload: null });
            dispatch({ type: 'SET_MINI_TABLE_ACTION', payload: providedAction });
            dispatch({ type: 'SET_MINI_FORM_LOADING', payload: false });
        }
    };

    // /**
    //  * @description Méthode pour charger la configuration du centre
    //  */
    // const buildMiniForm = (): void => {
    //     dispatch({ type: 'SET_MINI_FORM_OPT', payload: { ...state.miniFormModalOptions, fullPage: true } });
    // };

    const onTemplateClick = useCallback(async (): Promise<void> => {
        if (state.bulkType === BulkTypeEnum.ADD) {
            await getBulkAddTemplate();
        } else if (state.bulkType === BulkTypeEnum.UPDATE) {
            await getBulkUpdateTemplate();
        }
    }, [state.bulkType]);

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
