// #region IMPORTS -> /////////////////////////////////////
import Box from '@mui/material/Box';
import { JSX } from 'react';
import { Bold, Italic, Regular } from '../common/Text';
import { Score } from '~/models/Score';
// #endregion IMPORTS -> //////////////////////////////////

// #region SINGLETON --> ////////////////////////////////////
// #endregion SINGLETON --> /////////////////////////////////

export default function EditorHeader({ data }: IEditorHeader): JSX.Element {
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
        <Box id="scoreHeader" className="border p-2 rounded border-2">
            <Box className="text-center">
                <Bold variant="h4" className="text-decoration-underline">
                    {data.title}
                </Bold>
            </Box>
            <Box className="d-flex justify-content-between">
                <Regular>
                    {data.tempo} BPM | {data.nume}/{data.denom} | {data.key}
                </Regular>
                <Regular>{data.composer}</Regular>
            </Box>
            {data.comment && (
                <Box className="mt-1">
                    <Italic>{data.comment}</Italic>
                </Box>
            )}
        </Box>
    );
    // #endregion RENDER --> ///////////////////////////////////
}

// #region IPROPS -->  /////////////////////////////////////
interface IEditorHeader {
    data: Score;
}
// #enderegion IPROPS --> //////////////////////////////////
