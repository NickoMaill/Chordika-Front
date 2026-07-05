import { Breakpoint } from '@mui/material/styles';
import { DialogProps } from '@mui/material/Dialog';
import { Dispatch, ReactNode, SetStateAction, createContext } from 'react';

interface IModalContext {
    isOpen: boolean;
    setIsOpen?: Dispatch<SetStateAction<boolean>>;
    title: string;
    setTitle?: Dispatch<SetStateAction<string>>;
    content: ReactNode;
    setContent?: Dispatch<SetStateAction<ReactNode>>;
    options: AppModalProperty;
    setOptions?: Dispatch<SetStateAction<AppModalProperty>>;
    modalActionOptions: ModalActionType;
    setModalActionOptions?: Dispatch<SetStateAction<ModalActionType>>;
    dismissLabel: string;
    setDismissLabel?: Dispatch<SetStateAction<string>>;
}

const initialContext: IModalContext = {
    isOpen: false,
    title: '',
    content: null,
    modalActionOptions: null,
    dismissLabel: '',
    options: { size: 'md', scroll: 'paper', persistant: false },
};

export type AppModalProperty = {
    size?: Breakpoint;
    scroll?: DialogProps['scroll'];
    persistant?: boolean;
    fullPage?: boolean;
};

export type ModalActionType = {
    modalAction: () => void;
    modalActionLabel: string;
    modalActionLoading: boolean;
};

const ModalContext = createContext<IModalContext>(initialContext);
export default ModalContext;
