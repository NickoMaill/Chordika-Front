// #region IMPORTS -> /////////////////////////////////////
import React, { ReactNode, ReactPortal, useEffect, useMemo, useRef, useState } from 'react';
import AlertContext, { initialValue } from './alertContext';
import { AlertColor } from '@mui/material/Alert';
import useNavigation from '~/hooks/useNavigation';
import { createPortal } from 'react-dom';
import AppAlert from '~/components/common/AppAlert';
import { JSX } from 'react';
// #endregion IMPORTS -> //////////////////////////////////

// #region SINGLETON --> ////////////////////////////////////
// #endregion SINGLETON --> /////////////////////////////////

export default function AlertProvider({ children }: IAlertProvider): JSX.Element {
    // #region STATE --> ///////////////////////////////////////
    const [severity, setSeverity] = useState<AlertColor>(initialValue.severity);
    const [title, setTitle] = useState(null);
    const [subtitle, setSubtitle] = useState(null);
    const [isVisible, setIsVisible] = useState(false);
    const [anchorId, setAnchorId] = useState<string>(null);
    const [domNode, setDomNode] = useState<HTMLElement>(null);
    const [autoHide, setAutoHide] = useState<boolean>(false);
    const [secToHide, setSecToHide] = useState<number>(5000);

    const timeoutRef = useRef<number | null>(null);

    const value = useMemo(
        () => ({
            severity,
            setSeverity,
            title,
            setTitle,
            subtitle,
            setSubtitle,
            isVisible,
            setIsVisible,
            anchorId,
            setAnchorId,
            autoHide,
            setAutoHide,
            secToHide,
            setSecToHide,
        }),
        [severity, title, subtitle, isVisible, anchorId, secToHide, autoHide]
    );
    // #endregion STATE --> ////////////////////////////////////

    // #region HOOKS --> ///////////////////////////////////////
    const Nav = useNavigation();
    // #endregion HOOKS --> ////////////////////////////////////

    // #region METHODS --> /////////////////////////////////////
    const handleOpenClose = (): void => {
        setIsVisible(false);
        setDomNode(null);
        setAnchorId(null);
        setTitle(null);
        setSubtitle(null);
        setSeverity('info');
        setAutoHide(false);
        setSecToHide(5000);
        if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
        const container = document.getElementById('alertContainer');
        container?.remove();
    };

    const renderAlert = (): ReactPortal => {
        if (!domNode) return null;
        if (!isVisible) return null;
        let container = document.getElementById('alertContainer');
        if (!container) {
            container = document.createElement('div');
            container.id = 'alertContainer';
        }
        domNode.parentNode.insertBefore(container, domNode);
        if (autoHide) {
            timeoutRef.current = window.setTimeout(
                () => {
                    handleOpenClose();
                },
                Math.max(0, secToHide) * 1000
            );
        }
        return createPortal(<AppAlert onClose={handleOpenClose} severity={severity} title={title} subtitle={subtitle} closable isVisible={isVisible} />, container);
    };
    // #endregion METHODS --> //////////////////////////////////

    // #region USEEFFECT --> ///////////////////////////////////
    useEffect(() => {
        if (anchorId) {
            const node = document.getElementById(anchorId);
            if (node) {
                setDomNode(node);
            }
        }
    }, [anchorId]);

    useEffect(() => {
        handleOpenClose();
    }, [Nav.pathname]);
    // #endregion USEEFFECT --> ////////////////////////////////

    // #region RENDER --> //////////////////////////////////////
    return (
        <AlertContext.Provider value={value}>
            {domNode && renderAlert()}
            {children}
        </AlertContext.Provider>
    );
    // #endregion RENDER --> ///////////////////////////////////
}

// #region IPROPS -->  /////////////////////////////////////
interface IAlertProvider {
    children: ReactNode;
}
// #enderegion IPROPS --> //////////////////////////////////
