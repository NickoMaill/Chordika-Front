// #region IMPORTS -> /////////////////////////////////////
import { OverridableStringUnion } from '@mui/types';
import * as MuiIcon from '@mui/icons-material';
import { Theme } from '@emotion/react';
import { JSX } from 'react';
import FileCsv from '~/assets/svg/file-csv-solid-full.svg?react';
import FileExcel from '~/assets/svg/file-excel-solid-full.svg?react';
import Staves from '~/assets/svg/scoreSymbols/staves.svg?react';
import Segno from '~/assets/svg/scoreSymbols/segno.svg?react';
import Microphone from '~/assets/svg/scoreSymbols/microphone.svg?react';
import MusicScore from '~/assets/svg/score.svg?react';
import ScoreRaw from '~/assets/svg/score.svg';
import SvgIcon, { SvgIconPropsColorOverrides, SvgIconPropsSizeOverrides, SvgIconTypeMap } from '@mui/material/SvgIcon';
import { SxProps } from '@mui/material/styles';
import { OverridableComponent } from '@mui/material/OverridableComponent';

const customIcons = {
    FileCsv,
    FileExcel,
    Staves,
    Segno,
    Microphone,
    MusicScore,
};
// #endregion IMPORTS -> //////////////////////////////////

// #region SINGLETON --> ////////////////////////////////////
export type IconNameType = keyof typeof MuiIcon | keyof typeof customIcons;
// #endregion SINGLETON --> /////////////////////////////////

export default function AppIcon({ name, color, sx, size, className }: IAppIcon): JSX.Element {
    // #region STATE --> ///////////////////////////////////////
    const Icon = MuiIcon[name as keyof typeof MuiIcon] || customIcons[name as keyof typeof customIcons];
    // #endregion STATE --> ////////////////////////////////////

    // #region HOOKS --> ///////////////////////////////////////
    // #endregion HOOKS --> ////////////////////////////////////

    // #region METHODS --> /////////////////////////////////////

    // #endregion METHODS --> //////////////////////////////////

    // #region USEEFFECT --> ///////////////////////////////////
    // #endregion USEEFFECT --> ////////////////////////////////

    // #region RENDER --> //////////////////////////////////////
    return <>{Icon && <SvgIcon component={Icon} color={color} fontSize={size} inheritViewBox className={className} sx={sx} />}</>;
    // #endregion RENDER --> ///////////////////////////////////
}

// #region IPROPS -->  /////////////////////////////////////
interface IAppIcon {
    name: IconNameType;
    color?: OverridableStringUnion<'action' | 'disabled' | 'inherit' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning', SvgIconPropsColorOverrides>;
    sx?: SxProps<Theme>;
    size?: OverridableStringUnion<'small' | 'inherit' | 'large' | 'medium', SvgIconPropsSizeOverrides>;
    className?: string;
}

export const ScoreIcon: OverridableComponent<SvgIconTypeMap<{}, 'svg'>> & { muiName: string } = (props) => (
    <SvgIcon {...props} inheritViewBox>
        <image href={ScoreRaw} width="100%" height="100%" />
    </SvgIcon>
);
ScoreIcon.muiName = 'Score';
// #endregion IPROPS --> //////////////////////////////////
