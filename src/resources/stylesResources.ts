import { Theme, createTheme } from '@mui/material/styles';
import { colorSchemes, shadows, shape, typography } from './theme/themePrimitives';
import { inputsCustomizations } from './theme/custom/inputs';
import { dataDisplayCustomizations } from './theme/custom/dataDisplay';
import { feedbackCustomizations } from './theme/custom/feedback';
import { navigationCustomizations } from './theme/custom/navigation';
import { surfacesCustomizations } from './theme/custom/surfaces';
import { dataGridCustomizations, datePickersCustomizations, sidebarCustomizations, formInputCustomizations } from './theme/custom';
import { darkScrollbar } from '@mui/material';

class StylesResources {
    public get theme(): Theme {
        return createTheme({
            cssVariables: {
                colorSchemeSelector: 'data',
            },
            components: {
                ...inputsCustomizations,
                ...dataDisplayCustomizations,
                ...feedbackCustomizations,
                ...navigationCustomizations,
                ...surfacesCustomizations,
                ...dataGridCustomizations,
                ...datePickersCustomizations,
                ...sidebarCustomizations,
                ...formInputCustomizations,
                MuiCssBaseline: {
                    styleOverrides: (themeParam) => ({
                        body: themeParam.palette.mode === 'dark' ? darkScrollbar() : null,
                    }),
                },
            },
            colorSchemes,
            typography,
            shadows,
            shape,
        });
    }
}

export default new StylesResources();
