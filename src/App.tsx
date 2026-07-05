// #region IMPORTS -> /////////////////////////////////////
import { JSX } from 'react';
import { CssBaseline, StyledEngineProvider, ThemeProvider } from '@mui/material';
import stylesResources from './resources/stylesResources';
import AppRouter from './router/AppRouter';
import '~/resources/i18n/i18n';
import './styles/global.scss';
import './styles/web.scss';
import 'animate.css';
import 'nprogress/nprogress.css';
import { SnackbarProvider } from 'notistack';
import ModalProvider from './components/layout/ModalProvider';
import { I18nextProvider } from 'react-i18next';
import i18n from '~/resources/i18n/i18n';
import AppProvider from './context/AppProvider';
import { BrowserRouter } from 'react-router-dom';
import SessionProvider from './context/SessionProvider';
import configManager from './managers/configManager';
import NotistackStyle from './resources/theme/custom/toast';
// #endregion IMPORTS -> //////////////////////////////////

// #region SINGLETON --> ////////////////////////////////////
// #endregion SINGLETON --> /////////////////////////////////

export default function App(): JSX.Element {
    // #region STATE --> ///////////////////////////////////////
    // #region SessionContext //////////////////////////////////
    // #endregion /////////////////////////////////////////////

    // #endregion STATE --> ////////////////////////////////////

    // #region HOOKS --> ///////////////////////////////////////
    // #endregion HOOKS --> ////////////////////////////////////

    // #region METHODS --> /////////////////////////////////////
    // #endregion METHODS --> //////////////////////////////////

    // #region USEEFFECT --> ///////////////////////////////////
    // #endregion USEEFFECT --> ////////////////////////////////

    // #region RENDER --> //////////////////////////////////////
    return (
        <I18nextProvider i18n={i18n}>
            <StyledEngineProvider injectFirst>
                <ThemeProvider defaultMode="dark" theme={stylesResources.theme}>
                    <CssBaseline />
                    <BrowserRouter basename={configManager.getConfig.BASE_PATH}>
                        <SessionProvider>
                            <ModalProvider>
                                <AppProvider>
                                    <SnackbarProvider
                                        Components={{
                                            default: NotistackStyle.default,
                                            success: NotistackStyle.success,
                                            error: NotistackStyle.error,
                                            warning: NotistackStyle.warning,
                                            info: NotistackStyle.info,
                                        }}
                                    >
                                        <ModalProvider>
                                            <AppRouter />
                                        </ModalProvider>
                                    </SnackbarProvider>
                                </AppProvider>
                            </ModalProvider>
                        </SessionProvider>
                    </BrowserRouter>
                </ThemeProvider>
            </StyledEngineProvider>
        </I18nextProvider>
    );
    // #endregion RENDER --> ///////////////////////////////////
}

// #region IPROPS -->  /////////////////////////////////////
// #endregion IPROPS --> //////////////////////////////////
