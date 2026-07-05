import stylesResources from './resources/stylesResources';
import AppRouter from './router/AppRouter';
import '@fontsource/roboto/latin.css';
import '@fontsource/montserrat/latin.css';
import '~/resources/i18n/i18n';
import './styles/global.scss';
import './styles/web.scss';
import 'animate.css';
import 'nprogress/nprogress.css';
import { SnackbarProvider } from 'notistack';
import ModalProvider from './components/layout/ModalProvider';
import { I18nextProvider } from 'react-i18next';
import i18n from '~/resources/i18n/i18n';
import SessionProvider from './context/SessionProvider';
import AppProvider from './context/AppProvider';
import { BrowserRouter } from 'react-router-dom';
import configManager from './managers/configManager';
import { JSX, useEffect } from 'react';
import useIndexedDb from './hooks/useIndexedDb';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider, StyledEngineProvider } from '@mui/material/styles';
// #endregion IMPORTS -> //////////////////////////////////

// #region SINGLETON --> ////////////////////////////////////
import dayOfYear from 'dayjs/plugin/dayOfYear';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import dayjs from 'dayjs';
import toast from './resources/theme/custom/toast';

dayjs.extend(dayOfYear);
dayjs.extend(utc);
dayjs.extend(timezone);

// #endregion SINGLETON --> /////////////////////////////////

export default function App(): JSX.Element {
    // #region STATE --> ///////////////////////////////////////
    // #endregion /////////////////////////////////////////////

    // #endregion /////////////////////////////////////////////
    // #endregion STATE --> ////////////////////////////////////

    // #region HOOKS --> ///////////////////////////////////////
    const IndexedDB = useIndexedDb();
    // #endregion HOOKS --> ////////////////////////////////////

    // #region METHODS --> /////////////////////////////////////
    // #endregion METHODS --> //////////////////////////////////

    // #region USEEFFECT --> ///////////////////////////////////
    useEffect(() => {
        if (!IndexedDB.isSupported()) {
            window.alert("Votre navigateur ne supporte pas une version stable d'IndexedDB. Quelques fonctionnalités ne seront pas disponibles.");
        }
    }, []);
    // #endregion USEEFFECT --> ////////////////////////////////

    // #region RENDER --> //////////////////////////////////////
    return (
        <I18nextProvider i18n={i18n}>
            <StyledEngineProvider injectFirst>
                <ThemeProvider theme={stylesResources.theme}>
                    <CssBaseline />
                    <BrowserRouter basename={configManager.getConfig.EXTRA_BASEURL}>
                        <SessionProvider>
                            <ModalProvider>
                                <AppProvider>
                                    <SnackbarProvider Components={toast}>
                                        <AppRouter />
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
// #endregion IPROPS --> ///////////////////////////////////
