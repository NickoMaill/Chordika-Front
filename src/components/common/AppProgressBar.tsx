import stylesResources from '~/resources/stylesResources';
import { Regular } from './Text';
import { JSX } from 'react';
import Box from '@mui/material/Box';
// #endregion IMPORTS -> //////////////////////////////////

// #region SINGLETON --> ////////////////////////////////////
// #endregion SINGLETON --> /////////////////////////////////

export default function AppProgressBar({ percent = 0, alwaysStripped = false, animate = true, color = stylesResources.theme.palette.primary.main, showPercent, height = 1 }: IAppProgressBar): JSX.Element {
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
        <Box className="progress w-100 position-relative" sx={{ height: `${height}rem`, backgroundColor: stylesResources.theme.palette.grey[300] }} role="progressbar">
            <Box sx={{ backgroundColor: color }} className={`progress-bar ${animate && (percent < 100 || alwaysStripped) ? 'progress-bar-striped' : ''}${animate ? ' progress-bar-animated' : ''} `} width={`${percent}%`} />
            {showPercent && (
                <Regular variant="caption" sx={{ transform: 'translate(-50%, -50%)' }} className="position-absolute top-50 start-50 dynamic-text">
                    {percent ?? 0}%
                </Regular>
            )}
        </Box>
    );
    // #endregion RENDER --> ///////////////////////////////////
}

// #region IPROPS -->  /////////////////////////////////////
interface IAppProgressBar {
    percent?: number;
    color?: string;
    animate?: boolean;
    alwaysStripped?: boolean;
    showPercent?: boolean;
    height?: number;
}
// #enderegion IPROPS --> //////////////////////////////////
