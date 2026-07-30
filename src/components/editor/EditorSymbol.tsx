// #region IMPORTS -> /////////////////////////////////////
import { JSX } from 'react';
import { getMusicSymbol, MusicSymbolName } from '~/types/musicSymbol';
import { Regular } from '../common/Text';
// #endregion IMPORTS -> //////////////////////////////////

// #region SINGLETON --> ////////////////////////////////////
// #endregion SINGLETON --> /////////////////////////////////

export default function EditorSymbol({ symbol, fontSize = 45 }: IEditorSymbols): JSX.Element {
    // #region STATE --> ///////////////////////////////////////
    // #endregion STATE --> ////////////////////////////////////

    // #region HOOKS --> ///////////////////////////////////////
    // #endregion HOOKS --> ////////////////////////////////////

    // #region METHODS --> /////////////////////////////////////
    // #endregion METHODS --> //////////////////////////////////

    // #region USEEFFECT --> ///////////////////////////////////
    // #endregion USEEFFECT --> ////////////////////////////////

    // #region RENDER --> //////////////////////////////////////
    return (
        <Regular title={symbol} sx={{ fontFamily: 'Bravura', fontSize }}>
            {getMusicSymbol(symbol)}
        </Regular>
    );
    // #endregion RENDER --> ///////////////////////////////////
}

// #region IPROPS -->  /////////////////////////////////////
interface IEditorSymbols {
    symbol: MusicSymbolName;
    fontSize?: number;
}
// #enderegion IPROPS --> //////////////////////////////////
