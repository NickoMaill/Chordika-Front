import { CSSProperties } from 'react';
import HTMLParser from '~/components/common/HTMLParser';
import { InputBaseType } from '~/types/FormMakerCoreTypes';
import { JSX } from 'react';
import Box from '@mui/material/Box';
// #endregion IMPORTS -> //////////////////////////////////

// #region SINGLETON --> ////////////////////////////////////
// #endregion SINGLETON --> /////////////////////////////////

export default function InputValue({ inputStyle, id, value, parseHTML }: IInputValue): JSX.Element {
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
        <>
            <Box id={id} style={inputStyle}>
                {parseHTML ? <HTMLParser>{(value as string) ?? '-'}</HTMLParser> : ((value as string) ?? '-')}
            </Box>
        </>
    );
    // #endregion RENDER --> ///////////////////////////////////
}

// #region IPROPS -->  /////////////////////////////////////
interface IInputValue extends InputBaseType {
    inputStyle?: CSSProperties;
    parseHTML?: boolean;
}
// #enderegion IPROPS --> //////////////////////////////////
