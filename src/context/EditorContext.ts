import { createContext, Dispatch, useContext } from 'react';
import { Score } from '~/models/Score';

export type SelectedEditorElement = { type: "bars" | "bar" | "chord", id: string; };

export type EditorState = {
    isBarFormOpen: boolean;
    isDataLoading: boolean;
    isPrintMode: boolean;
    isDataSaving: boolean;
    data: Score;
    currentSelected: SelectedEditorElement;
};

export type EditorStateAction =
    | { type: 'IS_FORM_BAR_OPEN'; payload: boolean }
    | { type: 'SET_DATA'; payload: Score }
    | { type: 'SET_DATA_LOADING_ON' }
    | { type: 'SET_DATA_LOADING_OFF' }
    | { type: 'SET_PRINT_ON' }
    | { type: 'SET_PRINT_OFF' }
    | { type: 'SET_SAVING_ON' }
    | { type: 'SET_SAVING_OFF' }
    | { type: 'SET_SELECTED', payload: SelectedEditorElement }
    | { type: 'RESET' };

export const EditorInitialState = {
    /**
     * @description indicateur si le formulaire pour ajouter des mesures est ouvert
     */
    isBarFormOpen: false,
    data: null,
    isDataLoading: true,
    isPrintMode: false,
    isDataSaving: false,
    currentSelected: null
};

export const editorReducer = (state: EditorState, action: EditorStateAction): EditorState => {
    switch (action.type) {
        case 'IS_FORM_BAR_OPEN':
            return { ...state, isBarFormOpen: action.payload };
        case 'SET_DATA':
            return { ...state, data: action.payload };
        case 'SET_DATA_LOADING_ON':
            return { ...state, isDataLoading: true };
        case 'SET_DATA_LOADING_OFF':
            return { ...state, isDataLoading: false };
        case 'SET_PRINT_ON':
            return { ...state, isPrintMode: true };
        case 'SET_PRINT_OFF':
            return { ...state, isPrintMode: false };
        case 'SET_SAVING_ON':
            return { ...state, isDataSaving: true };
        case 'SET_SAVING_OFF':
            return { ...state, isDataSaving: false };
        case 'SET_SELECTED':
            return { ...state, currentSelected: action.payload };
        case 'RESET':
            return EditorInitialState;
        default:
            return state;
    }
};

export const EditorContext = createContext(undefined);

export default function useEditorContext(): { state: EditorState; dispatch: Dispatch<EditorStateAction> } {
    const context = useContext(EditorContext);
    if (!context) throw new Error('useCenterContext must be used within a CenterProvider');

    return context;
}
