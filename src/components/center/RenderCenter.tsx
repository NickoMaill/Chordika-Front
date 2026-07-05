// #region IMPORTS -> /////////////////////////////////////
import { Dispatch, SetStateAction, useContext, useMemo, useRef } from 'react';
import useCenterContext from '~/context/centerContext';
import SearchContext from '~/context/searchContext';
import { BulkTypeEnum, GenericActionEnum, ICenter, ICenterBase } from '~/types/centerType';
import AppForm from './AppForm';
import CenterBase from './CenterBase';
import AppCenterTable from './AppCenterTable';
import useResources from '~/hooks/useResources';
import SessionContext from '~/context/sessionContext';
import { LevelAccessEnum } from '~/models/Session';
import { GridRowParams } from '@mui/x-data-grid';
import { BaseModel } from '~/models/BaseModel';
import { CustomActionsDef, IAppTable } from '../common/AppTable';
import { useCenterActions, useCenterTools } from '~/hooks/useCenterActions';
import { QueryResult } from '~/types/serverCoreType';
import NavigationResource from '~/resources/navigationResources';
import useNavigation from '~/hooks/useNavigation';
import { JSX } from 'react';
// #endregion IMPORTS -> //////////////////////////////////

// #region SINGLETON --> ////////////////////////////////////
// #endregion SINGLETON --> /////////////////////////////////

export default function RenderCenter<T>({ props, action, table, id }: IRenderCenter<T>): JSX.Element {
    // #region STATE --> ///////////////////////////////////////
    const miniFormRef = useRef<HTMLFormElement>(null);
    // #endregion STATE --> ////////////////////////////////////

    // #region HOOKS --> ///////////////////////////////////////
    const CenterCtx = useCenterContext<T>();
    const Search = useContext(SearchContext);
    const Nav = useNavigation();
    const Resources = useResources();
    const Ses = useContext(SessionContext);
    const { centerNew, centerUpdate, centerDelete, centerExport } = useCenterActions<T>({ props, action, id });
    const { sendBulkFile, openBulkModal, canDoBulk, handleRowsPerPage, handlePageChange, handleMiniFormSubmit, onTemplateClick, handleOpenMiniForm } = useCenterTools({ props, action, id });
    // #endregion HOOKS --> ////////////////////////////////////

    // #region METHODS --> /////////////////////////////////////
    // #region Set Render
    const onBackPress = (): void => {
        Nav.navigateByPath(Search.buildBackURL(table));
        if (action === GenericActionEnum.UPDATE || action === GenericActionEnum.NEW) {
            CenterCtx.dispatch({ type: 'CLEAR_FOCUS_ERROR' });
        }
    };
    const centerBaseProps: ICenterBase = useMemo(
        () => ({
            isValidateModalVisible: CenterCtx.state.isValidateModalVisible,
            validateModalContent: CenterCtx.state.validateModalContent,
            validateModaleOnClose: () => CenterCtx.dispatch({ type: 'SET_VAL_MOD_VISIBLE', payload: !CenterCtx.state.isValidateModalVisible }),
            isAlertVisible: CenterCtx.state.isAlertVisible,
            onCloseAlert: () => CenterCtx.dispatch({ type: 'SET_ALERT_VISIBLE', payload: !CenterCtx.state.isAlertVisible }),
            alertContent: CenterCtx.state.alertContent,
            entity: props.entity,
            action: action,
            id: id,
            grammar: CenterCtx.state.config?.grammar,
            icon: CenterCtx.state.config?.icon,
            levelBulk: CenterCtx.state.config?.levelBulkUpdate,
            levelDelete: CenterCtx.state.config?.levelDelete,
            levelNew: CenterCtx.state.config?.levelNew,
            levelUpdate: CenterCtx.state.config?.levelUpdate,
            totalCount: CenterCtx.state.datas ? CenterCtx.state.datas.totalRecords : 0,
            searchForm: CenterCtx.state.config?.searchFormTemplate,
            isSearchLoading: CenterCtx.state.isSearchLoading,
            prefix: '',
            isSubCenter: props.isSubCenter,
        }),
        [CenterCtx.state.isSearchLoading, props.isSubCenter, CenterCtx.state.isTableLoading, CenterCtx.state.miniFormLoading, CenterCtx.state.datas?.totalRecords ?? 0, action, CenterCtx.state.isAlertVisible, CenterCtx.state.isValidateModalVisible]
    );

    const formMakerBaseProps = {
        isFormLoading: CenterCtx.state.isLoading,
        focusOnError: CenterCtx.state.focusOnError,
        isSubmitLoading: CenterCtx.state.isSubmitLoading,
        structure: CenterCtx.state.config?.formTemplate,
        action: action,
        grammar: CenterCtx.state.config?.grammar.singular,
    };

    /**
     * @description Pour le composant CenterBase en mode TABLE
     */
    const centerBaseTableProps: ICenterBase = useMemo(
        () => ({
            ...centerBaseProps,
            onSubmitSearchForm: (): void => {
                CenterCtx.dispatch({ type: 'SET_TABLE_LOADING', payload: true });
                CenterCtx.dispatch({ type: 'SET_GOT_QUERY', payload: true });
                CenterCtx.dispatch({ type: 'SET_REFRESH', payload: true });
            },
            searchForm: CenterCtx.state.config?.searchFormTemplate,
            bulkNew: canDoBulk(BulkTypeEnum.ADD),
            bulkUpdate: canDoBulk(BulkTypeEnum.UPDATE),
            levelAccess: CenterCtx.state.config?.level,
            isBulkAlertVisible: CenterCtx.state.isBulkAlertVisible,
            bulkMessage: CenterCtx.state.bulkMessage,
            bulkType: CenterCtx.state.bulkType,
            isBulkModalOpen: CenterCtx.state.isBulkModalOpen,
            isBulkSending: CenterCtx.state.isBulkSending,
            isBulkTemplateLoading: CenterCtx.state.isBulkTemplateLoading,
            onBulkSend: sendBulkFile,
            onBulkTemplateClick: onTemplateClick,
            onCloseBulkAlert: () => CenterCtx.dispatch({ type: 'SET_BULK_ALERT_VISIBLE', payload: false }),
            onCloseBulkModal: () => CenterCtx.dispatch({ type: 'SET_BULK_MODAL_OPEN', payload: false }),
            miniFormModal: CenterCtx.state.miniFormModal,
            miniFormModalOptions: CenterCtx.state.miniFormModalOptions,
            onCloseMiniModal: () => CenterCtx.dispatch({ type: 'SET_MINI_FORM_MOD', payload: false }),
            miniFormLoading: CenterCtx.state.miniFormLoading,
            onMiniFormSubmit: () => handleMiniFormSubmit(miniFormRef),
            isSubmitLoading: CenterCtx.state.isSubmitLoading,
        }),
        [CenterCtx.state.miniFormModal, CenterCtx.state.isTableLoading, CenterCtx.state.isSubmitLoading, CenterCtx.state.miniFormLoading, CenterCtx.state.isBulkTemplateLoading, CenterCtx.state.isBulkSending, CenterCtx.state.bulkType, CenterCtx.state.bulkMessage, CenterCtx.state.isBulkAlertVisible, CenterCtx.state.isAlertVisible]
    );

    /**
     * @description Pour le composant AppTable
     */
    const centerTableBaseProps: IAppTable<T> = useMemo(
        () => ({
            entity: props.entity,
            actions: CenterCtx.state.config?.tableStructure.actions,
            actionToShow: CenterCtx.state.config?.tableStructure?.actionToShow,
            onSort: (e) => Search.setSort(e, CenterCtx.state.config?.tableStructure),
            onPaginationChange: handleRowsPerPage,
            onPageChange: handlePageChange,
            currentPage: Search.page,
            rowsPerPage: Search.maxRows,
            rows: CenterCtx.state.datas as QueryResult<T>,
            columns: CenterCtx.state.config?.tableStructure,
            isTableLoading: CenterCtx.state.isTableLoading,
            isAllRowSelected: CenterCtx.state.isAllRowSelected,
            onAllRowSelect: (e) => (!props.isSubCenter ? CenterCtx.dispatch({ type: 'SET_ALL_ROWS_SEL', payload: e }) : null),
            onRowSelect: (e) => (!props.isSubCenter ? CenterCtx.dispatch({ type: 'SET_BULK_SEL', payload: [...e.ids].map((i) => i.toString()) }) : null),
            isError: CenterCtx.state.isTableError,
            errorMessage: CenterCtx.state.tableErrorMessage,
            onBulkAddClick: canDoBulk(BulkTypeEnum.ADD) ? (): void => openBulkModal(BulkTypeEnum.ADD) : null,
            onBulkUpdateClick: canDoBulk(BulkTypeEnum.UPDATE) ? (): void => openBulkModal(BulkTypeEnum.UPDATE) : null,
        }),
        [Search.filters, CenterCtx.state.isTableLoading, CenterCtx.state.isAllRowSelected, Search.sortedBy, CenterCtx.state.isTableError, CenterCtx.state.miniFormLoading, Search.maxRows, Search.page, CenterCtx.state.miniFormModal, CenterCtx.state.config?.tableStructure.actions]
    );

    const centerTableProps: IAppTable<T> = useMemo(
        () => ({
            ...centerTableBaseProps,
            authorizeExport: CenterCtx.state.config?.levelExport,
            actions: CenterCtx.state.config?.tableStructure.actions,
            actionToShow: CenterCtx.state.config?.tableStructure?.actionToShow,
            onSort: (e) => (!props.isSubCenter ? Search.setSort(e, CenterCtx.state.config?.tableStructure) : null),
            isRowsCheckable: canDoBulk(BulkTypeEnum.UPDATE) || canDoBulk(BulkTypeEnum.DELETE),
            onAllRowSelect: (e) => (!props.isSubCenter ? CenterCtx.dispatch({ type: 'SET_ALL_ROWS_SEL', payload: e }) : null),
            onRowSelect: (e) => (!props.isSubCenter ? CenterCtx.dispatch({ type: 'SET_BULK_SEL', payload: [...e.ids].map((i) => i.toString()) }) : null),
            allowExport: CenterCtx.state.config?.levelExport <= Ses.accessLevel && CenterCtx.state.config.levelExport !== LevelAccessEnum.NOBODY,
            onExportClick: centerExport,
            onRowClick: (e) => (CenterCtx.state.config?.tableStructure.actions.findIndex((x) => x === 'update') === -1 ? Nav.navigateByPath(`${NavigationResource.routesPath.center}/${props.entity}/${e.id}`) : Nav.navigateByPath(`${NavigationResource.routesPath.center}/${props.entity}/${e.id}/update`)),
        }),
        [Search.filters.length, canDoBulk, CenterCtx.state.isTableLoading, CenterCtx.state.miniFormModal, CenterCtx.state.miniFormLoading, CenterCtx.state.config?.tableStructure.actions]
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
                CenterCtx.state.config?.levelUpdate <= Ses.accessLevel && CenterCtx.state.config?.levelUpdate !== LevelAccessEnum.NOBODY
                    ? {
                          title: 'Modifier',
                          icon: 'CreateRounded',
                          onClick: (e: GridRowParams<BaseModel>) => handleOpenMiniForm(GenericActionEnum.UPDATE, e.row.id.toString()),
                      }
                    : null,
                CenterCtx.state.config?.levelDelete <= Ses.accessLevel && CenterCtx.state.config?.levelDelete !== LevelAccessEnum.NOBODY
                    ? {
                          title: 'Supprimer',
                          icon: 'Delete',
                          onClick: (e: GridRowParams<BaseModel>) => handleOpenMiniForm(GenericActionEnum.DELETE, e.row.id.toString()),
                      }
                    : null,
            ].filter((a) => a !== null) as CustomActionsDef<T>[],
        }),
        [CenterCtx.state.isTableLoading, CenterCtx.state.miniFormModal, CenterCtx.state.miniFormLoading]
    );
    // #endregion METHODS --> //////////////////////////////////

    // #region USEEFFECT --> ///////////////////////////////////
    // #endregion USEEFFECT --> ////////////////////////////////

    // #region RENDER --> //////////////////////////////////////
    if (props.isSubCenter) {
        return <AppCenterTable key={5} formRef={miniFormRef} baseProps={centerBaseTableProps} formMakerBaseProps={formMakerBaseProps} data={CenterCtx.state.data} isMini handleMiniAction={handleOpenMiniForm} tableProps={centerMiniTableProps} allowMiniAdd={CenterCtx.state.config?.levelNew <= Ses.accessLevel && CenterCtx.state.config?.levelNew !== LevelAccessEnum.NOBODY} />;
    } else {
        switch (action) {
            case GenericActionEnum.UPDATE:
                return <AppForm key={1} baseProps={centerBaseProps} formMakerBaseProps={formMakerBaseProps} actionName={Resources.translate('common.update') as string} onBackPress={onBackPress} onSubmit={centerUpdate} data={CenterCtx.state.data} specifiers={{ singular: '', plural: '' }} />;
            case GenericActionEnum.NEW:
                return <AppForm key={2} baseProps={centerBaseProps} formMakerBaseProps={formMakerBaseProps} actionName={Resources.translate('common.add') as string} onBackPress={onBackPress} onSubmit={centerNew} data={CenterCtx.state.data} specifiers={{ singular: '', plural: '' }} />;
            case GenericActionEnum.VIEW:
                if (props.viewComponent) {
                    return <CenterBase {...centerBaseProps}>{props.viewComponent(CenterCtx.state.data as T)}</CenterBase>;
                } else {
                    return <AppForm key={3} isView baseProps={centerBaseProps} formMakerBaseProps={formMakerBaseProps} actionName={Resources.translate('common.details') as string} onBackPress={onBackPress} data={CenterCtx.state.data} specifiers={{ singular: '', plural: '' }} />;
                }
            case GenericActionEnum.DELETE:
                return <AppForm key={4} isView baseProps={centerBaseProps} formMakerBaseProps={formMakerBaseProps} actionName={Resources.translate('common.delete') as string} onBackPress={onBackPress} onSubmit={() => centerDelete(id)} data={CenterCtx.state.data} specifiers={{ singular: '', plural: '' }} />;
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
