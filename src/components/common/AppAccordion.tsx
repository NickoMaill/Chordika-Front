// #region IMPORTS -> /////////////////////////////////////
import { Theme } from '@emotion/react';
import { Accordion, AccordionDetails, AccordionSummary, SxProps, TypographyVariant } from '@mui/material';
import { JSX, lazy, ReactNode } from 'react';
import { Bold } from './Text';
// #endregion IMPORTS -> //////////////////////////////////

// #region SINGLETON --> ////////////////////////////////////
const AppIcon = lazy(() => import('~/components/common/AppIcon'));
// #endregion SINGLETON --> /////////////////////////////////

export default function AppAccordion({ children, title, sx, titleVariant = 'h5' }: IAppAccordion): JSX.Element {
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
        <Accordion sx={{ ...sx, backgroundColor: 'background.paper' }}>
            <AccordionSummary expandIcon={<AppIcon name="ExpandMoreRounded" />}>
                <Bold component={'span'} variant={titleVariant}>
                    {title}
                </Bold>
            </AccordionSummary>
            <AccordionDetails>{children}</AccordionDetails>
        </Accordion>
    );
    // #endregion RENDER --> ///////////////////////////////////
}

// #region IPROPS -->  /////////////////////////////////////
interface IAppAccordion {
    children: ReactNode;
    title: string;
    sx?: SxProps<Theme>;
    titleVariant?: TypographyVariant;
}
// #enderegion IPROPS --> //////////////////////////////////
