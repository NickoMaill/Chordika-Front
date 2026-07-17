// #region IMPORTS -> /////////////////////////////////////
import { Box, BoxProps } from '@mui/material';
import { JSX, ReactNode, useCallback, useLayoutEffect, useRef, useState } from 'react';
// #endregion IMPORTS -> //////////////////////////////////

// #region SINGLETON --> ////////////////////////////////////
// #endregion SINGLETON --> /////////////////////////////////

export default function AutoFitText ({ children, minFontSize = 7, maxFontSize = 12, precision = 0.25, sx, ...props }: IAutoFitText): JSX.Element {
    // #region STATE --> ///////////////////////////////////////
    const containerRef = useRef<HTMLDivElement>(null);
    const textRef = useRef<HTMLSpanElement>(null);
    const [fontSize, setFontSize] = useState(maxFontSize);
    // #endregion STATE --> ////////////////////////////////////

    // #region HOOKS --> ///////////////////////////////////////
    // #endregion HOOKS --> ////////////////////////////////////

    // #region METHODS --> /////////////////////////////////////
    const calculateFontSize = useCallback(() => {
        const container = containerRef.current;
        const text = textRef.current;

        if (!container || !text) {
            return;
        }

        const availableWidth = container.clientWidth;
        const availableHeight = container.clientHeight;

        if (availableWidth <= 0 || availableHeight <= 0) {
            return;
        }

        let min = minFontSize;
        let max = maxFontSize;
        let bestSize = minFontSize;

        while (max - min > precision) {
            const currentSize = (min + max) / 2;

            text.style.fontSize = `${currentSize}px`;

            const fitsWidth = text.scrollWidth <= availableWidth;
            const fitsHeight = text.scrollHeight <= availableHeight;

            if (fitsWidth && fitsHeight) {
                bestSize = currentSize;
                min = currentSize;
            } else {
                max = currentSize;
            }
        }

        setFontSize(bestSize);
    }, [maxFontSize, minFontSize, precision]);
    // #endregion METHODS --> //////////////////////////////////

    // #region USEEFFECT --> ///////////////////////////////////
    useLayoutEffect(() => {
        calculateFontSize();

        const container = containerRef.current;

        if (!container) {
            return;
        }

        const resizeObserver = new ResizeObserver(() => {
            calculateFontSize();
        });

        resizeObserver.observe(container);

        return (): void => {
            resizeObserver.disconnect();
        };
    }, [calculateFontSize, children]);
    // #endregion USEEFFECT --> ////////////////////////////////

    // #region RENDER --> //////////////////////////////////////
    return (
        <Box
            ref={containerRef}
            {...props}
            sx={{
                minWidth: 0,
                width: '100%',
                height: '100%',
                overflow: 'hidden',
                display: 'flex',
                alignItems: 'center',
                ...sx,
            }}
        >
            <Box
                ref={textRef}
                component="span"
                sx={{
                    display: 'inline-block',
                    maxWidth: '100%',
                    whiteSpace: 'nowrap',
                    lineHeight: 1,
                    fontSize: `${fontSize}px`,
                }}
            >
                {children}
            </Box>
        </Box>
    );
    // #endregion RENDER --> ///////////////////////////////////
}

// #region IPROPS -->  /////////////////////////////////////
type IAutoFitText = BoxProps & {
    children: ReactNode;
    minFontSize?: number;
    maxFontSize?: number;
    precision?: number;
};
// #enderegion IPROPS --> //////////////////////////////////