import { AlertColor } from '@mui/material/Alert';
import { createContext, Dispatch, SetStateAction } from 'react';

export interface IAppAlertContext {
    severity: AlertColor;
    setSeverity?: Dispatch<SetStateAction<AlertColor>>;
    isVisible?: boolean;
    setIsVisible?: Dispatch<SetStateAction<boolean>>;
    title: string;
    setTitle?: Dispatch<SetStateAction<string>>;
    subtitle?: string;
    setSubtitle?: Dispatch<SetStateAction<string>>;
    onClose?: () => void;
    anchorId?: string;
    setAnchorId?: Dispatch<SetStateAction<string>>;
    autoHide: boolean;
    setAutoHide?: Dispatch<SetStateAction<boolean>>;
    secToHide: number;
    setSecToHide?: Dispatch<SetStateAction<number>>;
}

export type AlertProps = {
    severity: AlertColor;
    isVisible: boolean;
    title: string;
    subtitle?: string;
    anchorId: string;
    autoHide?: boolean;
    secToHide?: number;
};

export const initialValue: IAppAlertContext = {
    severity: 'info',
    isVisible: false,
    title: null,
    subtitle: null,
    anchorId: null,
    autoHide: false,
    secToHide: 5000,
};

const AlertContext = createContext<IAppAlertContext>(initialValue);

export default AlertContext;
