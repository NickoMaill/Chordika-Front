import { alpha, Theme } from '@mui/material/styles';

export { dataGridCustomizations } from './dataGrid';
export { datePickersCustomizations } from './datePickers';
export { formInputCustomizations } from './formInput';
export { sidebarCustomizations } from './sidebar';

export function alphaColor(theme: Theme, color: keyof Theme['palette'], opacity: number): string {
    if ('vars' in theme && theme.vars) {
        return `rgb(${theme.vars.palette[color].mainChannel} / ${opacity})`;
    }

    return alpha(theme.palette[color] as string, opacity);
}