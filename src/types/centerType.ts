import { AppTableStructure } from '~/components/common/AppTable';
import { FormMakerType, FormMakerFocusErrorType, FormMakerPartEnum } from './FormMakerCoreTypes';
import { LevelAccessEnum } from '~/models/Session';
import { AppError } from '../core/appError';
import { ApiErrorType } from '~/models/Error';
import { ReactNode } from 'react';
import { AlertContextType } from '~/context/appContext';
import { QueryResult } from './serverCoreType';
import { ModalOptions } from '~/hooks/useModal';
import { JSX } from 'react';
import { IconNameType } from '~/components/common/AppIcon';

export interface ICenter<T> {
    // #region GENERAL PARAMETERS -> /////////////////////////////////
    /**
     * @description nom de l'entité a charger
     */
    entity: string;
    /**
     * @description id du record a charger
     */
    id?: string;
    parentField?: string;
    isSubCenter?: boolean;
    parentId?: string;
    parents?: CenterParentType[];
    basePath?: string;
    // #endregion -> /////////////////////////////////////////////////

    // #region DISPLAYING THE LIST -> ////////////////////////////////
    /**
     * @description handler de changement de page
     * @param {number} page
     * @returns void
     */
    onTablePageChange?: (page: number) => void;
    // #endregion -> /////////////////////////////////////////////////

    // #region SEARCH DATA -> ////////////////////////////////////////
    // #endregion -> /////////////////////////////////////////////////

    // #region FORM TEMPLATE -> //////////////////////////////////////
    /**
     * @description handler d'erreur lors d'une modification de record
     * @param {AppError | ApiErrorType} err
     * @returns
     */
    onUpdateError?: (err: AppError | ApiErrorType) => void;
    /**
     * @description handler de création de record
     * @param {FormData} e
     * @returns
     */
    onCreate?: (e: FormData) => Promise<void>;
    /**
     * @description handler d'erreur lors d'une création de record
     * @param {AppError | ApiErrorType} err
     * @returns
     */
    onCreateError?: (err: AppError | ApiErrorType) => void;
    /**
     * @description handler de suppression de record
     * @param {FormData} e
     * @returns
     */
    onDelete?: (id: string) => Promise<void>;
    /**
     * @description handler d'erreur lors d'une suppression de record
     * @param {AppError | ApiErrorType} err
     * @returns
     */
    onDeleteError?: (err: AppError | ApiErrorType) => void;
    // #endregion -> /////////////////////////////////////////////////

    // #region element -> /////////////////////////////////////////////
    // #endregion -> /////////////////////////////////////////////////
    getData?: (data: T) => void;
    handleFormStruct?: (config: ICenterConfig<T>) => void;
    handleTableStruct?: (config: ICenterConfig<T>) => void;
    handleSearchFormStruct?: (config: ICenterConfig<T>) => void;
    action?: GenericActionEnum;
}

export type CenterHandlerConfigType<T> = {
    handleFormStruct?: (config: ICenterConfig<T>) => void;
    handleTableStruct?: (config: ICenterConfig<T>) => void;
    handleSearchFormStruct?: (config: ICenterConfig<T>) => void;
};

export type CenterParentType = {
    entity: string;
    id: string;
    parentField?: string;
};

export type CenterRouteContextType = {
    entity: string;
    id?: string;
    action: GenericActionEnum;
    parents: CenterParentType[];
    basePath: string;
    currentPath: string;
};

export interface ICenterBase {
    /**
     * @description article of type "Le", "La", "Les"
     */
    article?: string;
    /**
     * @description name of the entity
     */
    grammar: CenterGrammarType;
    /**
     * @description name of icon displayed on top left of title
     */
    icon?: IconNameType;
    /**
     * @description center content
     */
    children?: ReactNode;
    /**
     * @description prefix of type "de", "de la", "des"
     */
    prefix?: string;
    totalCount?: number;
    totalDbCount?: number;
    action: GenericActionEnum;
    id: string;
    entity: string;
    basePath?: string;
    searchForm?: FormMakerType<FormMakerPartEnum>;
    levelUpdate?: LevelAccessEnum;
    levelNew?: LevelAccessEnum;
    levelDelete?: LevelAccessEnum;
    levelBulk?: LevelAccessEnum;
    bulkUpdate?: boolean;
    bulkNew?: boolean;
    bulkType?: BulkTypeEnum;
    isBulkTemplateLoading?: boolean;
    isBulkSending?: boolean;
    bulkMessage?: string;
    isBulkAlertVisible?: boolean;
    isBulkModalOpen?: boolean;
    levelAccess?: LevelAccessEnum;
    isAlertVisible: boolean;
    alertContent?: AlertContextType;
    isValidateModalVisible?: boolean;
    validateModalContent?: { title: string; message: string };
    onSubmitSearchForm?: () => void;
    onBulkTemplateClick?: () => void;
    onBulkTemplateUpdate?: () => void;
    onCloseBulkAlert?: () => void;
    onCloseBulkModal?: () => void;
    onBulkSend?: (files: File[], type: BulkTypeEnum) => void;
    onAddFile?: (e: File) => void;
    onCloseAlert?: () => void;
    validateModaleOnClose?: () => void;
    onCloseMiniModal?: () => void;
    onMiniFormSubmit?: (action: GenericActionEnum) => Promise<void>;
    isSearchLoading?: boolean;
    miniFormModal?: boolean;
    miniFormModalOptions?: ModalOptions;
    miniFormLoading?: boolean;
    isSubmitLoading?: boolean;
    isSubCenter?: boolean;
}

export interface ICenterEntity {
    id: string;
    action: GenericActionEnum;
}

export enum GenericActionEnum {
    NEW = 'new',
    UPDATE = 'update',
    DELETE = 'delete',
    VIEW = 'view',
    TABLE = 'table',
    SUB_TABLE = 'subTable',
}

export enum BulkTypeEnum {
    ADD = 'add',
    UPDATE = 'update',
    DELETE = 'delete',
}

export type CenterSpecifierType = {
    plural: string;
    singular: string;
};

export type CenterGrammarType = {
    singular: string;
    plural: string;
    isFem?: boolean;
};

export interface ICenterConfig<T> {
    grammar: {
        singular: string;
        plural: string;
        singularArticle: string;
        pluralArticle: string;
        isFem: boolean;
    };
    formTemplate: FormMakerType<FormMakerPartEnum>;
    searchFormTemplate: FormMakerType<FormMakerPartEnum>;
    tableStructure: AppTableStructure<T>;
    icon: IconNameType;
    searchFieldDefault: string;
    allowAdd: boolean;
    allowUpdate: boolean;
    allowDelete: boolean;
    allowExport: boolean;
    level: LevelAccessEnum;
    levelNew: LevelAccessEnum;
    levelUpdate: LevelAccessEnum;
    levelDelete: LevelAccessEnum;
    levelExport: LevelAccessEnum;
    levelBulkNew: LevelAccessEnum;
    levelBulkUpdate: LevelAccessEnum;
    levelBulkDelete: LevelAccessEnum;
    updateUrlFallback?: string;
    overrideLayoutAction?: (props: { data?: QueryResult<T>, action?: GenericActionEnum }) => JSX.Element
    viewComponent?: ({ data }: { data: T }) => JSX.Element;
    deleteComponent?: ({ data }: { data: T }) => JSX.Element;
}

export interface ICustomView<T> {
    data: T;
    onDelete?: (id: string) => Promise<boolean>;
}

export interface CenterState<T> {
    isInitialized: boolean;
    config: ICenterConfig<T> | null;
    handlersLoaded: boolean;
    datas: QueryResult<T> | null;
    data: T | null;
    alertContent: AlertContextType | null;
    isLoading: boolean;
    isMiniLoading: boolean;
    refresh: boolean;

    bulkSelection: string[];
    bulkType: BulkTypeEnum;
    isBulkTemplateLoading: boolean;
    isBulkSending: boolean;
    bulkMessage: string;
    isBulkAlertVisible: boolean;
    isBulkModalOpen: boolean;

    isSubmitLoading: boolean;
    isValidateModalVisible: boolean;
    isAlertVisible: boolean;
    isAllRowSelected: boolean;
    isTableError: boolean;
    isSearchLoading: boolean;

    validateModalContent: { title: string; message: string } | null;
    focusOnError: FormMakerFocusErrorType[];
    miniFormModal: boolean;
    miniFormLoading: boolean;
    miniFormModalOptions: ModalOptions;
    miniTableAction: GenericActionEnum;
    tableErrorMessage: string;
    isTableLoading: boolean;
}

export type CenterStateAction<T> =
    | { type: 'SET_INITIALIZED'; payload: boolean }
    | { type: 'SET_CONFIG'; payload: ICenterConfig<T> | null }
    | { type: 'SET_HANDLERS_LOADED'; payload: boolean }
    | { type: 'SET_REFRESH'; payload: boolean }
    | { type: 'SET_DATAS'; payload: QueryResult<T> }
    | { type: 'SET_DATA'; payload: T }
    | { type: 'SET_ALERT'; payload: AlertContextType | null }
    | { type: 'SET_LOADING'; payload: boolean }
    | { type: 'SET_MINI_LOADING'; payload: boolean }
    | { type: 'SET_MINI_FORM_LOADING'; payload: boolean }
    | { type: 'SET_BULK_SEL'; payload: string[] }
    | { type: 'SET_BULK_TYPE'; payload: BulkTypeEnum }
    | { type: 'SET_BULK_TEMP_LOADING'; payload: boolean }
    | { type: 'SET_BULK_SENDING'; payload: boolean }
    | { type: 'SET_BULK_ALERT_MSG'; payload: string }
    | { type: 'SET_BULK_ALERT_VISIBLE'; payload: boolean }
    | { type: 'SET_BULK_MODAL_OPEN'; payload: boolean }
    | { type: 'SET_SUBMIT_LOADING'; payload: boolean }
    | { type: 'SET_SEARCH_LOADING'; payload: boolean }
    | { type: 'SET_VAL_MOD_VISIBLE'; payload: boolean }
    | { type: 'SET_ALERT_VISIBLE'; payload: boolean }
    | { type: 'SET_ALL_ROWS_SEL'; payload: boolean }
    | { type: 'SET_TABLE_ERROR'; payload: boolean }
    | { type: 'SET_TABLE_LOADING'; payload: boolean }
    | { type: 'SET_VAL_MOD_CONTENT'; payload: { title: string; message: string } }
    | { type: 'SET_FOCUS_ERROR'; payload: FormMakerFocusErrorType[] }
    | { type: 'CLEAR_FOCUS_ERROR' }
    | { type: 'SET_MINI_FORM_MOD'; payload: boolean }
    | { type: 'SET_MINI_FORM_OPT'; payload: ModalOptions }
    | { type: 'SET_MINI_TABLE_ACTION'; payload: GenericActionEnum }
    | { type: 'SET_TABLE_ERR_MESS'; payload: string }
    | { type: 'RESET' };
