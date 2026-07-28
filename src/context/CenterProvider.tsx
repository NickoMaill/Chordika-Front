import React, { ComponentType, useEffect, useReducer, useState } from 'react';
import { CenterContext, CenterContextValue } from './centerContext';
import { CenterHandlerConfigType, CenterState } from '~/types/centerType';
import { CenterInitialState, centerReducer } from '~/components/center/CenterTools';
import { JSX } from 'react';
import { useParams } from 'react-router-dom';
import { OverrideListPropsType } from '~/components/common/AppTable';
import { FormMakerPartEnum, IFormMakerInput, IFormMakerPanel } from '~/types/FormMakerCoreTypes';

// #region SINGLETON --> ////////////////////////////////////
type CenterProviderProps<T> = {
    initialState?: Partial<CenterState<T>>;
    children: React.ReactNode;
    isSub?: boolean;
    forcedTableName?: string;
    centerTableName?: string;
};
type CenterModule<T = unknown> = {
    default: CenterHandlerConfigType<T>;
};
type CenterComponentModule = {
    default: ComponentType<unknown>;
};

interface ICenterHandlerRunner<T> {
    table: string;
    useHandlers?: () => CenterHandlerConfigType<T>;
    state: CenterState<T>;
    dispatch: CenterContextValue<T>['dispatch'];
}
const modulePath = '../components/app/**/use*Handlers.tsx';
const handlerModules = import.meta.glob<CenterModule>('../components/app/**/use*.tsx');
const componentModules = import.meta.glob<CenterComponentModule>('../components/app/**/*.tsx');
// #endregion SINGLETON --> /////////////////////////////////

function CenterHandlersRunner<T>({ useHandlers, state, dispatch }: ICenterHandlerRunner<T>): JSX.Element {
    // #region STATE --> ///////////////////////////////////////
    // #endregion STATE --> ////////////////////////////////////

    // #region HOOKS --> ///////////////////////////////////////
    const handlers = useHandlers();
    // #endregion HOOKS --> ////////////////////////////////////

    // #region METHODS --> /////////////////////////////////////
    // #endregion METHODS --> //////////////////////////////////

    // #region USEEFFECT --> ///////////////////////////////////
    useEffect(() => {
        // Apply handler functions to the current config
        const config = state.config;
        if (!handlers || state.handlersLoaded) {
            if (!state.handlersLoaded) dispatch({ type: 'SET_HANDLERS_LOADED', payload: true });
            return;
        }
        if (handlers?.handleFormStruct) handlers.handleFormStruct(config);
        if (handlers?.handleTableStruct) handlers.handleTableStruct(config);
        if (handlers?.handleSearchFormStruct) handlers.handleSearchFormStruct(config);

        dispatch({ type: 'SET_CONFIG', payload: config });
        dispatch({ type: 'SET_HANDLERS_LOADED', payload: true });
    }, [handlers]);
    // #endregion USEEFFECT --> ////////////////////////////////

    // #region RENDER --> //////////////////////////////////////
    return null;
    // #endregion RENDER --> ///////////////////////////////////
}

function CenterComponentsRunner<T>({ state, table, dispatch }: ICenterHandlerRunner<T>): JSX.Element {
    const getComponentLoader = (componentName?: string): (() => Promise<CenterComponentModule>) | undefined => {
        if (!componentName) {
            return undefined;
        }
        const fileName = componentName.endsWith('.tsx') ? componentName : `${componentName}.tsx`;
        const expectedPath = `../components/app/${table}/${fileName}`;
        return componentModules[expectedPath];
    };
    const loadComponent = async (componentName?: string): Promise<ComponentType<unknown> | undefined> => {
        const loader = getComponentLoader(componentName);
        if (!loader) {
            return undefined;
        }
        const module = await loader();
        return module.default;
    };
    const initializeComponents = async (): Promise<void> => {
        const config = state.config;
        const overrideComponentName = config.tableStructure?.overrideComponentName;
        const sideComponentName = config.tableStructure?.sideComponentName;
        const [OverrideComponent, SideComponent] = await Promise.all([loadComponent(overrideComponentName), loadComponent(sideComponentName)]);

        if (config.tableStructure) {
            if (OverrideComponent) {
                config.tableStructure.OverrideComponent = OverrideComponent as unknown as (props?: OverrideListPropsType<T>) => JSX.Element;
            }
            if (SideComponent) {
                config.tableStructure.SideComponent = SideComponent as unknown as () => JSX.Element;
            }
        }

        const loadInputComponent = async (input: IFormMakerInput): Promise<void> => {
            if (input.type !== 'htmlContent' || !input.htmlElementName) {
                return;
            }
            const InputComponent = await loadComponent(input.htmlElementName);
            if (InputComponent) {
                input.htmlContent = InputComponent as IFormMakerInput['htmlContent'];
            }
        };

        if (config.formTemplate) {
            for (const part of config.formTemplate) {
                if (part.type === FormMakerPartEnum.TAB) {
                    for (const panel of part.content as IFormMakerPanel[]) {
                        for (const input of panel.content) {
                            await loadInputComponent(input);
                        }
                    }
                    continue;
                }

                if (part.type === FormMakerPartEnum.PANEL) {
                    for (const input of part.content) {
                        await loadInputComponent(input as IFormMakerInput);
                    }
                }
            }
        }
        dispatch({ type: 'SET_CONFIG', payload: config });
    };

    useEffect(() => {
        if (state.config) {
            void initializeComponents();
        }
    }, [table, state.config]);

    return null;
}

export default function CenterProvider<T>({ initialState, children, isSub, forcedTableName, centerTableName }: CenterProviderProps<T>): JSX.Element {
    const init: CenterState<T> = { ...CenterInitialState, ...(initialState ?? {}) } as CenterState<T>;
    const [state, dispatch] = useReducer(centerReducer<T>, init);
    const [HandlerHook, setHandlerHook] = useState<(() => CenterHandlerConfigType<T>) | null>(null);
    const { tableName } = useParams();
    const table = isSub ? forcedTableName.split('/').pop() : (centerTableName ?? tableName);

    useEffect(() => {
        setHandlerHook(null);
        dispatch({ type: 'SET_HANDLERS_LOADED', payload: false });
    }, [table]);

    // Load the handler module dynamically based on the current tableName or forced tableName
    const loadHandlerModule = async (): Promise<void> => {
        try {
            const path = modulePath.replace('**', table).replace('*', table.capitalize());
            const loader = handlerModules[path];
            if (!loader) {
                dispatch({ type: 'SET_HANDLERS_LOADED', payload: true });
                return;
            }
            const module = await loader();
            const handlers = module.default as () => CenterHandlerConfigType<T>;
            setHandlerHook(() => handlers); // Set the handler hook for execution
        } catch {
            dispatch({ type: 'SET_HANDLERS_LOADED', payload: true });
            return;
        }
    };

    // Trigger loading of handler module when initialized and handlers not loaded
    useEffect(() => {
        if (state.isInitialized && !state.handlersLoaded) {
            loadHandlerModule();
        }
    }, [state.isInitialized, state.handlersLoaded, table]);

    return (
        <CenterContext.Provider value={{ state, dispatch } as CenterContextValue<unknown>}>
            {table && <CenterComponentsRunner state={state} dispatch={dispatch} table={table} />}
            {HandlerHook && <CenterHandlersRunner useHandlers={HandlerHook} state={state} dispatch={dispatch} table={table} />}
            {children}
        </CenterContext.Provider>
    );
}
