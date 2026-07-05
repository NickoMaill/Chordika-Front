// #region IMPORTS -> /////////////////////////////////////
import { Dispatch, SetStateAction, useMemo, useRef } from 'react';
import useCenterContext from '~/context/centerContext';
import { BulkTypeEnum, GenericActionEnum, ICenter, ICenterBase } from '~/types/centerType';
import AppCenterForm from './AppForm';
import AppCenterTable from './AppCenterTable';
import useResources from '~/hooks/useResources';
import { LevelAccessEnum } from '~/models/Session';
import { GridRowParams } from '@mui/x-data-grid';
import { BaseModel } from '~/models/BaseModel';
import { CustomActionsDef, IAppTable } from '../common/AppTable';
import { useCenterActions, useCenterTools } from '~/hooks/useCenterActions';
import { QueryResult } from '~/types/serverCoreType';
import NavigationResource from '~/resources/navigationResources';
import useNavigation from '~/hooks/useNavigation';
import { JSX } from 'react';
import useSearchContext from '~/context/searchContext';
import useSessionContext from '~/context/sessionContext';
// #endregion IMPORTS -> //////////////////////////////////

// #region SINGLETON --> ////////////////////////////////////
// #endregion SINGLETON --> /////////////////////////////////

export default function RenderCenter<T>({ props, action, table, id }: IRenderCenter<T>): JSX.Element {
    // #region STATE --> ///////////////////////////////////////
    const miniFormRef = useRef<HTMLFormElement>(null);
    // #endregion STATE --> ////////////////////////////////////

    // #region HOOKS --> ///////////////////////////////////////
    const { state, dispatch } = useCenterContext<T>();
    const { setSort, buildBackURL, page, maxRows, filters, sortedBy } = useSearchContext();
    const { navigateByPath } = useNavigation();
    const { translate } = useResources();
    const { accessLevel } = useSessionContext();
    const { centerNew, centerUpdate, centerDelete, centerExport } = useCenterActions<T>({ props, action, id });
    const { sendBulkFile, openBulkModal, canDoBulk, handleRowsPerPage, handlePageChange, handleMiniFormSubmit, onTemplateClick, handleOpenMiniForm } = useCenterTools({ props, action, id });
    // #endregion HOOKS --> ////////////////////////////////////

    // #region METHODS --> /////////////////////////////////////
    // #region Set Render
    const onBackPress = (): void => {
        navigateByPath(buildBackURL(table, props.basePath));
        if (action === GenericActionEnum.UPDATE || action === GenericActionEnum.NEW) {
            dispatch({ type: 'CLEAR_FOCUS_ERROR' });
        }
    };
    const centerBaseProps: ICenterBase = useMemo(
        () => ({
            isValidateModalVisible: state.isValidateModalVisible,
            validateModalContent: state.validateModalContent,
            validateModaleOnClose: () => dispatch({ type: 'SET_VAL_MOD_VISIBLE', payload: !state.isValidateModalVisible }),
            isAlertVisible: state.isAlertVisible,
            onCloseAlert: () => dispatch({ type: 'SET_ALERT_VISIBLE', payload: !state.isAlertVisible }),
            alertContent: state.alertContent,
            entity: props.entity,
            basePath: props.basePath,
            action: action,
            id: id,
            grammar: state.config?.grammar,
            icon: state.config?.icon,
            levelBulk: state.config?.levelBulkUpdate,
            levelDelete: state.config?.levelDelete,
            levelNew: state.config?.levelNew,
            levelUpdate: state.config?.levelUpdate,
            totalCount: state.datas ? state.datas.totalRecords : 0,
            totalDbCount: state.datas ? state.datas.totalAllRecords : 0,
            searchForm: state.config?.searchFormTemplate,
            isSearchLoading: state.isSearchLoading,
            prefix: '',
            isSubCenter: props.isSubCenter,
        }),
        [state.isSearchLoading, props.isSubCenter, state.isTableLoading, state.miniFormLoading, state.datas?.totalRecords ?? 0, action, state.isAlertVisible, state.isValidateModalVisible]
    );

    const formMakerBaseProps = {
        isFormLoading: state.isLoading,
        focusOnError: state.focusOnError,
        isSubmitLoading: state.isSubmitLoading,
        structure: state.config?.formTemplate,
        action: action,
        grammar: state.config?.grammar.singular,
    };

    /**
     * @description Pour le composant CenterBase en mode TABLE
     */
    const centerBaseTableProps: ICenterBase = useMemo(
        () => ({
            ...centerBaseProps,
            onSubmitSearchForm: (): void => {
                dispatch({ type: 'SET_TABLE_LOADING', payload: true });
                dispatch({ type: 'SET_REFRESH', payload: true });
            },
            searchForm: state.config?.searchFormTemplate,
            bulkNew: canDoBulk(BulkTypeEnum.ADD),
            bulkUpdate: canDoBulk(BulkTypeEnum.UPDATE),
            levelAccess: state.config?.level,
            isBulkAlertVisible: state.isBulkAlertVisible,
            bulkMessage: state.bulkMessage,
            bulkType: state.bulkType,
            isBulkModalOpen: state.isBulkModalOpen,
            isBulkSending: state.isBulkSending,
            isBulkTemplateLoading: state.isBulkTemplateLoading,
            onBulkSend: sendBulkFile,
            onBulkTemplateClick: onTemplateClick,
            onCloseBulkAlert: () => dispatch({ type: 'SET_BULK_ALERT_VISIBLE', payload: false }),
            onCloseBulkModal: () => dispatch({ type: 'SET_BULK_MODAL_OPEN', payload: false }),
            miniFormModal: state.miniFormModal,
            miniFormModalOptions: state.miniFormModalOptions,
            onCloseMiniModal: () => dispatch({ type: 'SET_MINI_FORM_MOD', payload: false }),
            miniFormLoading: state.miniFormLoading,
            onMiniFormSubmit: () => handleMiniFormSubmit(miniFormRef),
            isSubmitLoading: state.isSubmitLoading,
        }),
        [
            state.miniFormModal,
            state.isTableLoading,
            state.isSubmitLoading,
            state.miniFormLoading,
            state.isBulkTemplateLoading,
            state.isBulkSending,
            state.bulkType,
            state.bulkMessage,
            state.isBulkAlertVisible,
            state.isAlertVisible,
        ]
    );

    /**
     * @description Pour le composant AppTable
     */
    const centerTableBaseProps: IAppTable<T> = useMemo(
        () => ({
            entity: props.entity,
            actions: state.config?.tableStructure.actions,
            actionToShow: state.config?.tableStructure?.actionToShow,
            onSort: (e) => setSort(e, state.config?.tableStructure),
            onPaginationChange: handleRowsPerPage,
            onPageChange: handlePageChange,
            currentPage: page,
            rowsPerPage: maxRows,
            rows: state.datas as QueryResult<T>,
            columns: state.config?.tableStructure,
            isTableLoading: state.isTableLoading,
            isAllRowSelected: state.isAllRowSelected,
            onAllRowSelect: (e) => (!props.isSubCenter ? dispatch({ type: 'SET_ALL_ROWS_SEL', payload: e }) : null),
            onRowSelect: (e) => (!props.isSubCenter ? dispatch({ type: 'SET_BULK_SEL', payload: [...e.ids].map((i) => i.toString()) }) : null),
            isError: state.isTableError,
            errorMessage: state.tableErrorMessage,
            onBulkAddClick: canDoBulk(BulkTypeEnum.ADD) ? (): void => openBulkModal(BulkTypeEnum.ADD) : null,
            onBulkUpdateClick: canDoBulk(BulkTypeEnum.UPDATE) ? (): void => openBulkModal(BulkTypeEnum.UPDATE) : null,
            basePath: props.basePath,
        }),
        [filters, state.isTableLoading, state.isAllRowSelected, sortedBy, state.isTableError, state.miniFormLoading, maxRows, page, state.miniFormModal, state.config?.tableStructure.actions]
    );

    const centerTableProps: IAppTable<T> = useMemo(
        () => ({
            ...centerTableBaseProps,
            authorizeExport: state.config?.levelExport,
            actions: state.config?.tableStructure.actions,
            actionToShow: state.config?.tableStructure?.actionToShow,
            onSort: (e) => (!props.isSubCenter ? setSort(e, state.config?.tableStructure) : null),
            isRowsCheckable: canDoBulk(BulkTypeEnum.UPDATE) || canDoBulk(BulkTypeEnum.DELETE),
            onAllRowSelect: (e) => (!props.isSubCenter ? dispatch({ type: 'SET_ALL_ROWS_SEL', payload: e }) : null),
            onRowSelect: (e) => (!props.isSubCenter ? dispatch({ type: 'SET_BULK_SEL', payload: [...e.ids].map((i) => i.toString()) }) : null),
            allowExport: state.config?.levelExport <= accessLevel && state.config.levelExport !== LevelAccessEnum.NOBODY,
            onExportClick: centerExport,
            onRowClick: (e) =>
                state.config?.tableStructure.actions.findIndex((x) => x === 'update') === -1
                    ? navigateByPath(`${props.basePath ?? `${NavigationResource.routesPath.center}/${props.entity}`}/${e.id}`)
                    : navigateByPath(`${props.basePath ?? `${NavigationResource.routesPath.center}/${props.entity}`}/${e.id}/update`),
        }),
        [filters.length, canDoBulk, state.isTableLoading, state.miniFormModal, state.miniFormLoading, state.config?.tableStructure.actions]
    );

    const centerMiniTableProps: IAppTable<T> = useMemo(
        () => ({
            ...centerTableBaseProps,
            entity: props.entity,
            isAllRowSelected: false,
            actions: [
                // {
                //     title: 'Details',
                //     icon: 'RemoveRedEye',
                //     onClick: (e: GridRowParams<BaseModel>) => handleOpenMiniForm(GenericActionEnum.VIEW, e.row.id.toString()),
                // },
                state.config?.levelUpdate <= accessLevel && state.config?.levelUpdate !== LevelAccessEnum.NOBODY
                    ? {
                          title: 'Modifier',
                          icon: 'CreateRounded',
                          onClick: (e: GridRowParams<BaseModel>) => handleOpenMiniForm(GenericActionEnum.UPDATE, e.row.id.toString()),
                      }
                    : null,
                state.config?.levelDelete <= accessLevel && state.config?.levelDelete !== LevelAccessEnum.NOBODY
                    ? {
                          title: 'Supprimer',
                          icon: 'Delete',
                          onClick: (e: GridRowParams<BaseModel>) => handleOpenMiniForm(GenericActionEnum.DELETE, e.row.id.toString()),
                      }
                    : null,
            ].filter((a) => a !== null) as CustomActionsDef<T>[],
        }),
        [state.isTableLoading, state.miniFormModal, state.miniFormLoading]
    );
    // #endregion METHODS --> //////////////////////////////////

    // #region USEEFFECT --> ///////////////////////////////////
    // #endregion USEEFFECT --> ////////////////////////////////

    // #region RENDER --> //////////////////////////////////////
    if (props.isSubCenter) {
        return (
            <AppCenterTable
                key={5}
                formRef={miniFormRef}
                baseProps={centerBaseTableProps}
                formMakerBaseProps={formMakerBaseProps}
                data={state.data}
                isMini
                handleMiniAction={handleOpenMiniForm}
                tableProps={centerMiniTableProps}
                allowMiniAdd={state.config?.levelNew <= accessLevel && state.config?.levelNew !== LevelAccessEnum.NOBODY}
            />
        );
    } else {
        switch (action) {
            case GenericActionEnum.UPDATE:
                return (
                    <AppCenterForm
                        key={1}
                        baseProps={centerBaseProps}
                        formMakerBaseProps={formMakerBaseProps}
                        actionName={translate('common.update') as string}
                        onBackPress={onBackPress}
                        onSubmit={centerUpdate}
                        data={state.data}
                        recordId={id}
                        specifiers={{ singular: '', plural: '' }}
                    />
                );
            case GenericActionEnum.NEW:
                return (
                    <AppCenterForm
                        key={2}
                        baseProps={centerBaseProps}
                        formMakerBaseProps={formMakerBaseProps}
                        actionName={translate('common.add') as string}
                        onBackPress={onBackPress}
                        onSubmit={centerNew}
                        data={state.data}
                        recordId={id}
                        specifiers={{ singular: '', plural: '' }}
                    />
                );
            case GenericActionEnum.VIEW:
                if (state.config.viewComponent) {
                    return state.config.viewComponent({ data: state.data as T });
                } else {
                    return (
                        <AppCenterForm
                            key={3}
                            isView
                            baseProps={centerBaseProps}
                            formMakerBaseProps={formMakerBaseProps}
                            actionName={translate('common.details') as string}
                            onBackPress={onBackPress}
                            data={state.data}
                            recordId={id}
                            specifiers={{ singular: '', plural: '' }}
                        />
                    );
                }
            case GenericActionEnum.DELETE:
                return (
                    <AppCenterForm
                        key={4}
                        isView
                        baseProps={centerBaseProps}
                        formMakerBaseProps={formMakerBaseProps}
                        actionName={translate('common.delete') as string}
                        onBackPress={onBackPress}
                        onSubmit={() => centerDelete(id)}
                        data={state.data}
                        recordId={id}
                        specifiers={{ singular: '', plural: '' }}
                    />
                );
            case GenericActionEnum.TABLE:
            default:
                return <AppCenterTable key={6} baseProps={centerBaseTableProps} tableProps={centerTableProps} />;
        }
    }

    // #endregion RENDER --> ///////////////////////////////////
}

// #region IPROPS -->  /////////////////////////////////////
interface IRenderCenter<T> {
    props: ICenter<T>;
    action: GenericActionEnum;
    setSubAction?: Dispatch<SetStateAction<GenericActionEnum>>;
    table: string;
    id: string;
}
// #enderegion IPROPS --> //////////////////////////////////
