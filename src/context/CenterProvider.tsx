import React, { useEffect, useReducer, useState } from 'react';
import { CenterContext, CenterContextValue } from './centerContext';
import { CenterHandlerConfigType, CenterState } from '~/types/centerType';
import { CenterInitialState, centerReducer } from '~/components/center/CenterTools';
import { JSX } from 'react';
import { useParams } from 'react-router-dom';

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
const modulePath = '../components/app/**/use*Handlers.tsx';
const handlerModules = import.meta.glob<CenterModule>('../components/app/**/use*.tsx');

function CenterHandlersRunner<T>({ useHandlers, state, dispatch }: { useHandlers: () => CenterHandlerConfigType<T>; state: CenterState<T>; dispatch: CenterContextValue<T>['dispatch'] }): JSX.Element {
    const handlers = useHandlers();

    useEffect(() => {
        if (!handlers || state.handlersLoaded) {
            if (!state.handlersLoaded) dispatch({ type: 'SET_HANDLERS_LOADED', payload: true });
            return;
        }
        // Apply handler functions to the current config
        const config = state.config;
        if (handlers?.handleFormStruct) handlers.handleFormStruct(config);
        if (handlers?.handleTableStruct) handlers.handleTableStruct(config);
        if (handlers?.handleSearchFormStruct) handlers.handleSearchFormStruct(config);
        dispatch({ type: 'SET_CONFIG', payload: config });
        dispatch({ type: 'SET_HANDLERS_LOADED', payload: true });
    }, [handlers]);

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
            {HandlerHook && <CenterHandlersRunner useHandlers={HandlerHook} state={state} dispatch={dispatch} />}
            {children}
        </CenterContext.Provider>
    );
}
