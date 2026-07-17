import { createContext, Dispatch, useContext } from 'react';
import { Score } from '~/models/Score';

export type EditorState = {
    isBarFormOpen: boolean;
    isDataLoading: boolean;
    data: Score;
};

export type EditorStateAction =
    | { type: 'IS_FORM_BAR_OPEN'; payload: boolean }
    | { type: 'SET_DATA'; payload: Score }
    | { type: 'SET_DATA_LOADING_ON' }
    | { type: 'SET_DATA_LOADING_OFF' }
    | { type: 'RESET' };

export const EditorInitialState = {
    /**
     * @description indicateur si le formulaire pour ajouter des mesures est ouvert
     */
    isBarFormOpen: false,
    data: null,
    isDataLoading: true,
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
