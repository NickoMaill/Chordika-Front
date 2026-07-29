// #region IMPORTS -> /////////////////////////////////////
import { Box } from '@mui/material';
import { JSX, ReactNode, useEffect, useRef, useState } from 'react';
// #endregion IMPORTS -> //////////////////////////////////

// #region SINGLETON --> ////////////////////////////////////
// #endregion SINGLETON --> /////////////////////////////////

export default function AppResizableElement({ width, height, children, onResize, className, onMouseOver }: IAppResizableElement): JSX.Element {
    // #region STATE --> ///////////////////////////////////////
    const [isMouseOver, setIsMouseOver] = useState<boolean>(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const mouseTimeout = useRef<ReturnType<typeof setTimeout>>(null);
    // #endregion STATE --> ////////////////////////////////////

    // #region HOOKS --> ///////////////////////////////////////
    // #endregion HOOKS --> ////////////////////////////////////

    // #region METHODS --> /////////////////////////////////////
    const handleMouseOver = (isOver: boolean): void => {
        if (isOver) {
            setIsMouseOver(true);
            if (onMouseOver) onMouseOver(true)
            clearTimeout(mouseTimeout.current);
        } else {
            mouseTimeout.current = setTimeout(() => {
                setIsMouseOver(false);
                if (onMouseOver) onMouseOver(false)
            }, 100);
        }
    };
    // #endregion METHODS --> //////////////////////////////////

    // #region USEEFFECT --> ///////////////////////////////////

    useEffect(() => {
        const element = containerRef.current;

        if (!element) return;
        let timeoutId: number;

        const observer = new ResizeObserver(([entry]) => {
            const width = Math.round(entry.borderBoxSize?.[0]?.inlineSize ?? entry.contentRect.width);
            const height = Math.round(entry.borderBoxSize?.[0]?.blockSize ?? entry.contentRect.height);
            window.clearTimeout(timeoutId);

            timeoutId = window.setTimeout(() => {
                onResize(width, height);
            }, 200);
        });
        observer.observe(element);

        return (): void => {
            window.clearTimeout(timeoutId);
            observer.disconnect();
        };
    }, []);
    // #endregion USEEFFECT --> ////////////////////////////////

    // #region RENDER --> //////////////////////////////////////
    return (
        <Box
            ref={containerRef}
            component={'div'}
            className={className}
            onMouseOver={() => handleMouseOver(true)}
            onMouseOut={() => handleMouseOver(false)}
            sx={{ width, height, resize: isMouseOver ? 'both' : 'none', overflow: 'hidden', boxSizing: 'border-box', border: isMouseOver ? 'solid 1px' : null }}
        >
            {children}
        </Box>
    );
    // #endregion RENDER --> ///////////////////////////////////
}

// #region IPROPS -->  /////////////////////////////////////
interface IAppResizableElement {
    width: number;
    height: number;
    children: ReactNode;
    onResize: (w: number, h: number) => void;
    onMouseOver?: (isOver: boolean) => void;
    className?: string;
}
// #enderegion IPROPS --> //////////////////////////////////
