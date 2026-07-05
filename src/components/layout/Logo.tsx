import { JSX } from 'react';
import RawLogo from '~/assets/svg/aven.svg?react';
import { Box } from '@mui/material';
import { Regular } from '../common/Text';
import stylesResources from '~/resources/stylesResources';
// #endregion IMPORTS -> //////////////////////////////////

// #region SINGLETON --> ////////////////////////////////////
const imgSize = 25;
// #endregion SINGLETON --> /////////////////////////////////

export default function Logo(): JSX.Element {
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
        <Box className="d-flex align-items-center gap-2">
            <RawLogo width={imgSize} height={imgSize} style={{ fill: stylesResources.theme.palette.primary.main }} />
            <Regular component="h3" variant="h3" color="primary" className="ms-2" sx={{ letterSpacing: '0.4em' }}>
                VEN
            </Regular>
        </Box>
    );
    // #endregion RENDER --> ///////////////////////////////////
}

// #region IPROPS -->  /////////////////////////////////////
// interface ILogo {}
// #endregion IPROPS --> //////////////////////////////////
