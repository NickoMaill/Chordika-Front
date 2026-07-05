// #region IMPORTS -> /////////////////////////////////////
import { ReactNode, useContext, useEffect } from 'react';
import { Breakpoint } from '@mui/material/styles';
import { DialogProps } from '@mui/material/Dialog';
import ModalContext, { ModalActionType } from '~/context/modalContext';
// #endregion IMPORTS -> //////////////////////////////////

// #region SINGLETON --> ////////////////////////////////////
export type ModalOptions = {
    title: string;
    content: ReactNode;
    size?: Breakpoint;
    scroll?: DialogProps['scroll'];
    persistant?: boolean;
    fullPage?: boolean;
    modalActionOptions?: ModalActionType;
    isLoading?: boolean;
};
// #endregion SINGLETON --> /////////////////////////////////

export default function useModal(): IUseModal {
    // #region STATE --> ///////////////////////////////////////
    // #endregion STATE --> ////////////////////////////////////

    // #region HOOKS --> ///////////////////////////////////////
    const ModalCxt = useContext(ModalContext);
    // #endregion HOOKS --> ////////////////////////////////////

    // #region METHODS --> /////////////////////////////////////

    const openModal = ({ title, content, size = 'sm', scroll = 'paper', persistant = false, fullPage = false, modalActionOptions = null, isLoading = false }: ModalOptions): void => {
        ModalCxt.setContent(content);
        ModalCxt.setTitle(title);
        ModalCxt.setModalActionOptions(modalActionOptions);
        ModalCxt.setOptions({ size, scroll, persistant, fullPage });
        ModalCxt.setIsLoading(isLoading);
        ModalCxt.setIsOpen(true);
    };

    const closeModal = (): void => {
        ModalCxt.setIsLoading(false);
        ModalCxt.setIsOpen(false);
    };
    // #endregion METHODS --> //////////////////////////////////

    // #region USEEFFECT --> ///////////////////////////////////
    useEffect(() => {
        window.addEventListener('popstate', closeModal);
        window.addEventListener('pushState', closeModal);
        window.addEventListener('replaceState', closeModal);

        return (): void => {
            window.removeEventListener('popstate', closeModal);
            window.removeEventListener('pushState', closeModal);
            window.removeEventListener('replaceState', closeModal);
        };
    }, []);
    // #endregion USEEFFECT --> ////////////////////////////////

    // #region RENDER --> //////////////////////////////////////
    return { openModal, closeModal };
    // #endregion RENDER --> ///////////////////////////////////
}

// #region IPROPS -->  /////////////////////////////////////
interface IUseModal {
    openModal: (o: ModalOptions) => void;
    closeModal: () => void;
}
// #enderegion IPROPS --> //////////////////////////////////
