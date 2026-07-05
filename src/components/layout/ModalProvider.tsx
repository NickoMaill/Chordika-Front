import { JSX, ReactNode, useState } from 'react';
import ModalContext, { AppModalProperty, ModalActionType } from '~/context/modalContext';
import Modal from '../common/Modal';
import AppFullPageModal from '../common/AppFullPageModal';
import useResources from '~/hooks/useResources';

export default function ModalProvider({ children }): JSX.Element {
    const Resources = useResources();

    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [title, setTitle] = useState<string>('');
    const [content, setContent] = useState<ReactNode>(null);
    const [options, setOptions] = useState<AppModalProperty>({ size: 'md', scroll: 'paper', persistant: false, fullPage: false });
    const [modalActionOptions, setModalActionOptions] = useState<ModalActionType>(null);
    const [dismissLabel, setDismissLabel] = useState<string>(Resources.translate('common.close') as string);

    const value = {
        isOpen,
        setIsOpen,
        title,
        setTitle,
        content,
        setContent,
        options,
        setOptions,
        modalActionOptions,
        setModalActionOptions,
        dismissLabel,
        setDismissLabel,
    };
    const handleClose = (): void => {
        setIsOpen(false);
    };

    return (
        <ModalContext.Provider value={value}>
            {children}
            {options.fullPage ? (
                <AppFullPageModal children={content} isOpen={isOpen} onClose={handleClose} modalTitle={title} />
            ) : (
                <Modal dismissLabel={dismissLabel} modalAction={modalActionOptions?.modalAction} modalActionLabel={modalActionOptions?.modalActionLabel} isModalActionLoading={modalActionOptions?.modalActionLoading} maxWidth={options.size} scroll={options.scroll} persistant={options.persistant} children={content} closable isOpen={isOpen} onClose={handleClose} modalTitle={title} />
            )}
        </ModalContext.Provider>
    );
}
