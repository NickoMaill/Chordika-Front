import { ChangeEvent, JSX, lazy, MouseEvent, useCallback, useState } from 'react';
import { LangType } from '~/types/i18nTypes';
import useToolService from '~/hooks/services/useToolService';
import useModal, { ModalOptions } from '~/hooks/useModal';
import useStorage from '~/hooks/useStorage';
import PerformanceDisplay from '../PerformanceDisplay';
import FR from '~/assets/svg/fr.svg';
import EN from '~/assets/svg/en.svg';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import Tooltip from '@mui/material/Tooltip';
import Switch from '@mui/material/Switch';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useColorScheme } from '@mui/material/styles';
const AppIcon = lazy(() => import('~/components/common/AppIcon'));
// #endregion IMPORTS -> //////////////////////////////////

// #region SINGLETON --> ////////////////////////////////////
// #endregion SINGLETON --> /////////////////////////////////

export default function SetupMenu(): JSX.Element {
    // #region STATE --> ///////////////////////////////////////
    const Storage = useStorage();
    const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
    const [menuAnchor, setMenuAnchor] = useState<HTMLElement>(null);
    const [lang, setLang] = useState<LangType>(Storage.getItem('lang') as LangType);
    const [isPerfLoading, setIsPerfLoading] = useState<boolean>(false);
    // #endregion STATE --> ////////////////////////////////////

    // #region HOOKS --> ///////////////////////////////////////
    const Modal = useModal();
    const Tool = useToolService();
    // #endregion HOOKS --> ////////////////////////////////////

    // #region METHODS --> /////////////////////////////////////
    const openCloseMenu = (e: MouseEvent<HTMLElement>): void => {
        setIsMenuOpen(!isMenuOpen);
        setMenuAnchor(e.currentTarget);
    };

    const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
    const preferredMode = prefersDarkMode ? 'dark' : 'light';

    const { mode, setMode } = useColorScheme();

    const paletteMode = !mode || mode === 'system' ? preferredMode : mode;

    const onChangeScheme = useCallback(() => {
        setMode(paletteMode === 'dark' ? 'light' : 'dark');
        setIsMenuOpen(false);
    }, [setMode, paletteMode, isMenuOpen]);

    const onSelectLang = (e: ChangeEvent<HTMLInputElement>): void => {
        Storage.setItem('lang', e.target.checked ? 'en' : 'fr');
        setLang(e.target.checked ? 'en' : 'fr');
        window.location.reload();
    };

    const getPerf = async (): Promise<void> => {
        setIsPerfLoading(true);
        const perf = await Tool.getPerf().finally(() => setIsPerfLoading(false));
        if (perf.active) {
            const modalOpt: ModalOptions = {
                title: "Performances de l'application",
                content: <PerformanceDisplay perf={perf} />,
                size: 'lg',
            };
            Modal.openModal(modalOpt);
        }
    };
    // #endregion METHODS --> //////////////////////////////////

    // #region USEEFFECT --> ///////////////////////////////////
    // #endregion USEEFFECT --> ////////////////////////////////

    // #region RENDER --> //////////////////////////////////////
    return (
        <Box>
            <Tooltip title="">
                <IconButton outline="true" size="small" onClick={openCloseMenu}>
                    <AppIcon name="Settings" />
                </IconButton>
            </Tooltip>
            <Menu disableScrollLock anchorEl={menuAnchor} onClose={openCloseMenu} open={isMenuOpen}>
                <Box display={'flex'} flexDirection={'column'} alignItems={'center'}>
                    <Box display={'flex'}>
                        <Box padding={1} paddingInline={2} display="flex" alignItems="center">
                            <AppIcon color="warning" name="LightMode" />
                            <Switch checked={mode === 'dark'} onChange={onChangeScheme} />
                            <AppIcon name="DarkMode" />
                        </Box>
                        <Box padding={1} paddingInline={2} display="flex" alignItems="center">
                            <img src={FR} width={22} />
                            <Switch checked={lang === 'en'} onChange={onSelectLang} />
                            <img src={EN} width={22} />
                        </Box>
                    </Box>
                    <Box>
                        <Button loading={isPerfLoading} onClick={getPerf} variant="outlined" sx={{ margin: 1 }}>
                            <AppIcon name="Timeline" sx={{ marginRight: 1 }} />
                            Afficher les performances
                        </Button>
                    </Box>
                </Box>
            </Menu>
        </Box>
    );
    // #endregion RENDER --> ///////////////////////////////////
}

// #region IPROPS -->  /////////////////////////////////////
// #enderegion IPROPS --> //////////////////////////////////
