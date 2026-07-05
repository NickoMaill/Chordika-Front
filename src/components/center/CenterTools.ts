import { CenterState, CenterStateAction, GenericActionEnum } from '~/types/centerType';

export const CenterInitialState = {
    /**
     * @description indicateur d'initialisation du center
     */
    isInitialized: false,
    /**
     * @description
     */
    config: null,
    /**
     * @description Indique si les handlers on été chargés
     */
    handlersLoaded: false,
    /**
     * @description indicateur si on doit rafraichir les données
     */
    refresh: false,
    /**
     * @description page actuel de la liste
     */
    currentPage: 0,
    /**
     * @description Nombre de records par page
     */
    rowsPerPage: 50,
    /**
     * @description url de sort
     */
    sort: '', // On initialisera à partir de props dans useEffect
    /**
     * @description records de la liste
     */
    datas: null,
    /**
     * @description record
     */
    data: null,
    /**
     * @description Action du center => new | update | delete | export |
     */
    centerAction: GenericActionEnum.TABLE,
    /**
     * @description contenu de l'alerte
     */
    alertContent: null,
    /**
     * @description loader du center
     */
    isLoading: true,
    /**
     * @description loader de la mini table
     */
    isMiniLoading: false,
    /**
     * @description type de bulk 'add' | 'update' | 'delete'
     */
    bulkType: null,
    /**
     * @description loader pour le téléchargement de la template de bulk
     */
    isBulkTemplateLoading: false,
    /**
     * @description loader pour l'envoi du bulk
     */
    isBulkSending: false,
    /**
     * @description loader pour submit du form
     */
    isSubmitLoading: false,
    /**
     * @description message d'alert pour le bulk
     */
    bulkMessage: null,
    /**
     *@description indique la visibilité de l'alert du bulk
     */
    isBulkAlertVisible: false,
    /**
     * @description indique si la modal du bulk est ouverte
     */
    isBulkModalOpen: false,

    isValidateModalVisible: false,
    /**
     * @description indicateur de la visibilité de l'alerte du center
     */
    isAlertVisible: false,
    /**
     * @description indique si tout les lignes di tableau sont sélectionnée
     */
    isAllRowSelected: false,
    /**
     * @description indique si la table est en erreur
     */
    isTableError: false,
    /**
     * @description loader de la table du center
     */
    isTableLoading: true,
    /**
     * @description selection de bulk
     */
    bulkSelection: [],
    /**
     * @description contenu du modal de validation
     */
    validateModalContent: null,
    /**
     * @description focus sur les champs en erreur
     */
    focusOnError: [],
    /**
     * @description formulaire de la modal
     */
    miniFormModal: false,
    /**
     * @description options de la modal du formulaire
     */
    miniFormModalOptions: {
        title: '',
        content: null,
        fullPage: false,
        onClose: (): void => null,
        onSubmit: (): void => null,
    },
    /**
     * @description loader de la modal du formulaire
     */
    miniFormLoading: false,
    /**
     * @description action de la sous table
     */
    miniTableAction: GenericActionEnum.SUB_TABLE,
    /**
     * @description message d'erreur de la table
     */
    tableErrorMessage: null,

    isSearchLoading: false,
};

export const centerReducer = <T>(state: CenterState<T>, action: CenterStateAction<T>): CenterState<T> => {
    switch (action.type) {
        case 'SET_INITIALIZED':
            return { ...state, isInitialized: action.payload };
        case 'SET_CONFIG':
            return { ...state, config: action.payload };
        case 'SET_HANDLERS_LOADED':
            return { ...state, handlersLoaded: action.payload };
        case 'SET_REFRESH':
            return { ...state, refresh: action.payload };
        case 'SET_DATAS':
            return { ...state, datas: action.payload };
        case 'SET_DATA':
            return { ...state, data: action.payload };
        case 'SET_CENTER_ACTION':
            return { ...state, centerAction: action.payload };
        case 'SET_LOADING':
            return { ...state, isLoading: action.payload };
        case 'SET_ALERT':
            return { ...state, alertContent: action.payload };
        case 'SET_ALERT_VISIBLE':
            return { ...state, isAlertVisible: action.payload };
        case 'SET_ALL_ROWS_SEL':
            return { ...state, isAllRowSelected: action.payload };
        case 'SET_BULK_SENDING':
            return { ...state, isBulkSending: action.payload };
        case 'SET_BULK_SEL':
            return { ...state, bulkSelection: action.payload };
        case 'SET_BULK_TYPE':
            return { ...state, bulkType: action.payload };
        case 'SET_BULK_TEMP_LOADING':
            return { ...state, isBulkTemplateLoading: action.payload };
        case 'SET_BULK_ALERT_MSG':
            return { ...state, bulkMessage: action.payload };
        case 'SET_BULK_ALERT_VISIBLE':
            return { ...state, isBulkAlertVisible: action.payload };
        case 'SET_BULK_MODAL_OPEN':
            return { ...state, isBulkModalOpen: action.payload };
        case 'SET_SEARCH_LOADING':
            return { ...state, isSearchLoading: action.payload };
        case 'SET_FOCUS_ERROR':
            return { ...state, focusOnError: [...state.focusOnError, action.payload] };
        case 'CLEAR_FOCUS_ERROR':
            return { ...state, focusOnError: [] };
        case 'SET_MINI_FORM_MOD':
            return { ...state, miniFormModal: action.payload };
        case 'SET_MINI_FORM_OPT':
            return { ...state, miniFormModalOptions: action.payload };
        case 'SET_MINI_LOADING':
            return { ...state, isMiniLoading: action.payload };
        case 'SET_MINI_FORM_LOADING':
            return { ...state, miniFormLoading: action.payload };
        case 'SET_MINI_TABLE_ACTION':
            return { ...state, miniTableAction: action.payload };
        case 'SET_SUBMIT_LOADING':
            return { ...state, isSubmitLoading: action.payload };
        case 'SET_TABLE_ERROR':
            return { ...state, isTableError: action.payload };
        case 'SET_TABLE_LOADING':
            return { ...state, isTableLoading: action.payload };
        case 'SET_TABLE_ERR_MESS':
            return { ...state, tableErrorMessage: action.payload };
        case 'SET_VAL_MOD_CONTENT':
            return { ...state, validateModalContent: action.payload };
        case 'SET_VAL_MOD_VISIBLE':
            return { ...state, isValidateModalVisible: action.payload };
        case 'RESET':
            return CenterInitialState;
        default:
            return state;
    }
};
