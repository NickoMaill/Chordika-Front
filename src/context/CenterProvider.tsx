import React, { useEffect, useReducer, useState } from 'react';
import { CenterContext } from './centerContext';
import { CenterHandlerConfigType, CenterState } from '~/types/centerType';
import { CenterInitialState, centerReducer } from '~/components/center/CenterTools';
import { JSX } from 'react';
import { useParams } from 'react-router-dom';
import appTool from '~/helpers/appTool';

type CenterProviderProps<T> = {
    initialState?: Partial<CenterState<T>>;
    children: React.ReactNode;
};

type CenterModule<T = unknown> = {
    default: CenterHandlerConfigType<T>;
};
const modulePath = '../components/app/**/use*Handlers.tsx';
const handlerModules = import.meta.glob<CenterModule>('../components/app/**/use*.tsx');

function CenterHandlersRunner<T>({ useHandlers, state, dispatch }: { useHandlers: () => CenterHandlerConfigType<T>; state: CenterState<T>; dispatch: React.Dispatch<unknown> }): JSX.Element {
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

export default function CenterProvider<T>({ initialState, children }: CenterProviderProps<T>): JSX.Element {
    const init: CenterState<T> = { ...CenterInitialState, ...(initialState ?? {}) } as CenterState<T>;
    const [state, dispatch] = useReducer(centerReducer<T>, init);
    const [HandlerHook, setHandlerHook] = useState<(() => CenterHandlerConfigType<T>) | null>(null);
    const { tableName } = useParams();

    // Load the handler module dynamically based on the current tableName
    const loadHandlerModule = async (): Promise<void> => {
        try {
            const path = modulePath.replace('**', tableName).replace('*', appTool.toCapitalize(tableName));
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
    }, [state.isInitialized, state.handlersLoaded]);

    return (
        <CenterContext.Provider value={{ state, dispatch }}>
            {HandlerHook && <CenterHandlersRunner useHandlers={HandlerHook} state={state} dispatch={dispatch} />}
            {children}
        </CenterContext.Provider>
    );
}
