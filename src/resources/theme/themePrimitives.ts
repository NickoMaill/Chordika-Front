import { Theme } from '@emotion/react';
import { createTheme, alpha, PaletteMode, Shadows } from '@mui/material/styles';

declare module '@mui/material/Paper' {
    interface PaperPropsVariantOverrides {
        highlighted: true;
    }
}
declare module '@mui/material/styles' {
    interface ColorRange {
        30: string;
        50: string;
        100: string;
        200: string;
        300: string;
        400: string;
        500: string;
        600: string;
        700: string;
        800: string;
        900: string;
    }

    interface PaletteColor extends ColorRange {}

    interface Palette {
        baseShadow: string;
    }
}

const defaultTheme = createTheme();
const customShadows: Shadows = [...defaultTheme.shadows];

export const neutral = {
    0: '#ffffff',
    50: '#f8fafc',
    100: '#f1f5f9',
    200: '#e2e8f0',
    300: '#cbd5e1',
    400: '#94a3b8',
    500: '#64748b',
    600: '#475569',
    700: '#334155',
    800: '#1e293b',
    900: '#0f172a',
};

export const brand = {
    30: 'hsl(222, 47%, 96%)',
    50: 'hsl(222, 47%, 92%)',
    100: 'hsl(222, 47%, 85%)',
    200: 'hsl(222, 47%, 72%)',
    300: 'hsl(222, 47%, 60%)',
    400: 'hsl(222, 47%, 54%)',
    500: 'hsl(222, 47%, 50%)', // base parfaite
    600: 'hsl(222, 47%, 44%)',
    700: 'hsl(222, 47%, 36%)',
    800: 'hsl(222, 47%, 26%)',
    900: 'hsl(222, 47%, 18%)',
};

export const gray = {
    30: 'hsl(220, 35%, 98%)',
    50: 'hsl(220, 35%, 97%)',
    100: 'hsl(220, 30%, 94%)',
    200: 'hsl(220, 20%, 88%)',
    300: 'hsl(220, 20%, 80%)',
    400: 'hsl(220, 20%, 65%)',
    500: 'hsl(220, 20%, 42%)',
    600: 'hsl(220, 20%, 35%)',
    700: 'hsl(220, 20%, 25%)',
    800: 'hsl(220, 30%, 6%)',
    900: 'hsl(220, 35%, 3%)',
};

export const green = {
    30: 'hsl(120, 80%, 99%)',
    50: 'hsl(120, 80%, 98%)',
    100: 'hsl(120, 75%, 94%)',
    200: 'hsl(120, 75%, 87%)',
    300: 'hsl(120, 61%, 77%)',
    400: 'hsl(120, 44%, 53%)',
    500: 'hsl(120, 59%, 30%)',
    600: 'hsl(120, 70%, 25%)',
    700: 'hsl(120, 75%, 16%)',
    800: 'hsl(120, 84%, 10%)',
    900: 'hsl(120, 87%, 6%)',
};

export const orange = {
    30: 'hsl(45, 100%, 99%)',
    50: 'hsl(37, 100%, 98%)',
    100: 'hsl(36, 100%, 94%)',
    200: 'hsl(36, 100%, 87%)',
    300: 'hsl(36, 100%, 77%)',
    400: 'hsl(36, 100%, 53%)',
    500: 'hsl(36, 100%, 30%)',
    600: 'hsl(33, 100%, 25%)',
    700: 'hsl(30, 100%, 16%)',
    800: 'hsl(27, 100%, 10%)',
    900: 'hsl(21, 100%, 6%)',
};

export const red = {
    30: 'hsl(0, 100%, 98%)',
    50: 'hsl(0, 100%, 97%)',
    100: 'hsl(0, 92%, 90%)',
    200: 'hsl(0, 94%, 80%)',
    300: 'hsl(0, 90%, 65%)',
    400: 'hsl(0, 90%, 40%)',
    500: 'hsl(0, 90%, 30%)',
    600: 'hsl(0, 91%, 25%)',
    700: 'hsl(0, 94%, 18%)',
    800: 'hsl(0, 95%, 12%)',
    900: 'hsl(0, 93%, 6%)',
};

export const getDesignTokens = (mode: PaletteMode): Theme => {
    customShadows[1] =
        mode === 'dark'
            ? 'hsla(220, 30%, 5%, 0.7) 0px 4px 16px 0px, hsla(220, 25%, 10%, 0.8) 0px 8px 16px -5px'
            : 'hsla(220, 30%, 5%, 0.07) 0px 4px 16px 0px, hsla(220, 25%, 10%, 0.07) 0px 8px 16px -5px';

    return {
        palette: {
            mode,
            primary: {
                light: brand[400],
                main: brand[500],
                dark: brand[600],
                contrastText: brand[50],
                ...(mode === 'dark' && {
                    contrastText: brand[50],
                    light: brand[300],
                    main: brand[400],
                    dark: brand[500],
                }),
            },
            secondary: {
                light: gray[400],
                main: gray[500],
                dark: gray[800],
                contrastText: gray[50],
            },
            info: {
                light: brand[200],
                main: brand[400],
                dark: brand[600],
                contrastText: gray[50],
                ...(mode === 'dark' && {
                    contrastText: brand[300],
                    light: brand[400],
                    main: brand[500],
                    dark: brand[700],
                }),
            },
            warning: {
                light: orange[300],
                main: orange[500],
                dark: orange[800],
                ...(mode === 'dark' && {
                    light: orange[400],
                    main: orange[500],
                    dark: orange[700],
                }),
            },
            error: {
                light: red[300],
                main: red[400],
                dark: red[800],
                ...(mode === 'dark' && {
                    light: red[400],
                    main: red[500],
                    dark: red[700],
                }),
            },
            success: {
                light: green[300],
                main: green[400],
                dark: green[800],
                ...(mode === 'dark' && {
                    light: green[400],
                    main: green[500],
                    dark: green[700],
                }),
            },
            grey: {
                ...gray,
            },
            divider: mode === 'dark' ? alpha(gray[700], 0.6) : alpha(gray[300], 0.4),
            background: {
                default: 'hsl(0, 0%, 99%)',
                paper: 'hsl(220, 35%, 97%)',
                ...(mode === 'dark' && { default: gray[900], paper: 'hsl(220, 30%, 7%)' }),
            },
            text: {
                primary: gray[800],
                secondary: gray[600],
                warning: orange[400],
                ...(mode === 'dark' && { primary: 'hsl(0, 0%, 100%)', secondary: gray[400] }),
            },
            action: {
                hover: alpha(gray[200], 0.2),
                selected: `${alpha(gray[200], 0.3)}`,
                ...(mode === 'dark' && {
                    hover: alpha(gray[600], 0.2),
                    selected: alpha(gray[600], 0.3),
                }),
            },
        },
        typography: {
            fontFamily: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'].join(','),
            h1: {
                fontSize: defaultTheme.typography.pxToRem(48),
                fontWeight: 600,
                lineHeight: 1.2,
                letterSpacing: -0.5,
            },
            h2: {
                fontSize: defaultTheme.typography.pxToRem(36),
                fontWeight: 600,
                lineHeight: 1.2,
            },
            h3: {
                fontSize: defaultTheme.typography.pxToRem(30),
                lineHeight: 1.2,
            },
            h4: {
                fontSize: defaultTheme.typography.pxToRem(24),
                fontWeight: 600,
                lineHeight: 1.5,
            },
            h5: {
                fontSize: defaultTheme.typography.pxToRem(20),
                fontWeight: 600,
            },
            h6: {
                fontSize: defaultTheme.typography.pxToRem(18),
                fontWeight: 600,
            },
            subtitle1: {
                fontSize: defaultTheme.typography.pxToRem(18),
            },
            subtitle2: {
                fontSize: defaultTheme.typography.pxToRem(14),
                fontWeight: 500,
            },
            body1: {
                fontSize: defaultTheme.typography.pxToRem(14),
            },
            body2: {
                fontSize: defaultTheme.typography.pxToRem(14),
                fontWeight: 400,
            },
            caption: {
                fontSize: defaultTheme.typography.pxToRem(12),
                fontWeight: 400,
            },
        },
        shape: {
            borderRadius: 8,
        },
        shadows: customShadows,
    };
};

export const colorSchemes = {
    light: {
        palette: {
            primary: {
                light: brand[400],
                main: brand[500],
                dark: brand[600],
                contrastText: brand[50],
                subtle: brand[200]
            },
            secondary: {
                light: gray[400],
                main: gray[500],
                dark: gray[800],
                contrastText: gray[50],
                subtle: gray[200],
            },
            info: {
                light: brand[200],
                main: brand[400],
                dark: brand[600],
                contrastText: gray[50],
            },
            warning: {
                light: orange[300],
                main: orange[400],
                dark: orange[800],
            },
            error: {
                light: red[300],
                main: red[400],
                dark: red[800],
            },
            success: {
                light: green[300],
                main: green[400],
                dark: green[800],
            },
            grey: {
                ...gray,
            },
            divider: alpha(gray[300], 0.4),
            background: {
                default: 'hsl(0, 0%, 99%)',
                paper: 'hsl(220, 35%, 97%)',
            },
            text: {
                primary: gray[800],
                secondary: gray[600],
                warning: orange[400],
            },
            action: {
                hover: alpha(gray[200], 0.2),
                selected: `${alpha(gray[200], 0.3)}`,
            },
            baseShadow: 'hsla(220, 30%, 5%, 0.07) 0px 4px 16px 0px, hsla(220, 25%, 10%, 0.07) 0px 8px 16px -5px',
        },
    },
    dark: {
        palette: {
            primary: {
                contrastText: brand[50],
                light: brand[300],
                main: brand[400],
                dark: brand[500],
            },
            secondary: {
                light: gray[400],
                main: gray[600],
                dark: gray[800],
                contrastText: gray[50],
                subtle: gray[600],
            },
            info: {
                contrastText: brand[300],
                light: brand[400],
                main: brand[500],
                dark: brand[700],
            },
            warning: {
                light: orange[400],
                main: orange[500],
                dark: orange[700],
            },
            error: {
                light: red[400],
                main: red[500],
                dark: red[700],
            },
            success: {
                light: green[400],
                main: green[500],
                dark: green[700],
            },
            grey: {
                ...gray,
            },
            divider: alpha(gray[700], 0.6),
            background: {
                default: gray[900],
                paper: 'hsl(220, 30%, 7%)',
            },
            text: {
                primary: 'hsl(0, 0%, 100%)',
                secondary: gray[400],
            },
            action: {
                hover: alpha(gray[600], 0.2),
                selected: alpha(gray[600], 0.3),
            },
            baseShadow: 'hsla(220, 30%, 5%, 0.7) 0px 4px 16px 0px, hsla(220, 25%, 10%, 0.8) 0px 8px 16px -5px',
        },
    },
};

export const typography = {
    fontFamily: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'].join(','),
    h1: {
        fontSize: defaultTheme.typography.pxToRem(48),
        fontWeight: 600,
        lineHeight: 1.2,
        letterSpacing: -0.5,
    },
    h2: {
        fontSize: defaultTheme.typography.pxToRem(36),
        fontWeight: 600,
        lineHeight: 1.2,
    },
    h3: {
        fontSize: defaultTheme.typography.pxToRem(30),
        lineHeight: 1.2,
    },
    h4: {
        fontSize: defaultTheme.typography.pxToRem(24),
        fontWeight: 600,
        lineHeight: 1.5,
    },
    h5: {
        fontSize: defaultTheme.typography.pxToRem(20),
        fontWeight: 600,
    },
    h6: {
        fontSize: defaultTheme.typography.pxToRem(18),
        fontWeight: 600,
    },
    subtitle1: {
        fontSize: defaultTheme.typography.pxToRem(18),
    },
    subtitle2: {
        fontSize: defaultTheme.typography.pxToRem(14),
        fontWeight: 500,
    },
    body1: {
        fontSize: defaultTheme.typography.pxToRem(14),
    },
    body2: {
        fontSize: defaultTheme.typography.pxToRem(14),
        fontWeight: 400,
    },
    caption: {
        fontSize: defaultTheme.typography.pxToRem(12),
        fontWeight: 400,
    },
};

export const shape = {
    borderRadius: 8,
};
// @ts-ignore
const defaultShadows: Shadows = ['none', 'var(--template-palette-baseShadow)', ...defaultTheme.shadows.slice(2)];
export const shadows = defaultShadows;
