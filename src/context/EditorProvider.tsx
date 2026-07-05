// #region IMPORTS -> /////////////////////////////////////
import React, { JSX, ReactNode, useReducer } from 'react';
import { EditorContext, EditorInitialState, editorReducer, EditorState } from './EditorContext';
// #endregion IMPORTS -> //////////////////////////////////

// #region SINGLETON --> ////////////////////////////////////
// #endregion SINGLETON --> /////////////////////////////////

export default function EditorProvider({ initialState, children }: IEditorProvider): JSX.Element {
    // #region STATE --> ///////////////////////////////////////
    const init: EditorState = { ...EditorInitialState, ...(initialState ?? {}) } as EditorState;
    const [state, dispatch] = useReducer(editorReducer, init);
    // #endregion STATE --> ////////////////////////////////////

    // #region HOOKS --> ///////////////////////////////////////
    // #endregion HOOKS --> ////////////////////////////////////

    // #region METHODS --> /////////////////////////////////////
    // #endregion METHODS --> //////////////////////////////////

    // #region USEEFFECT --> ///////////////////////////////////
    // #endregion USEEFFECT --> ////////////////////////////////

    // #region RENDER --> //////////////////////////////////////
    return <EditorContext.Provider value={{ state, dispatch }}>{children}</EditorContext.Provider>;
    // #endregion RENDER --> ///////////////////////////////////
}

// #region IPROPS -->  /////////////////////////////////////
interface IEditorProvider {
    initialState?: Partial<EditorState>;
    children: ReactNode;
}
// #enderegion IPROPS --> //////////////////////////////////
