import React, { useState } from 'react';
import LoaderGif from '~/assets/pictures/load.gif';
import { JSX } from 'react';
import Box, { BoxProps } from '@mui/material/Box';
// #endregion IMPORTS -> //////////////////////////////////

// #region SINGLETON --> ////////////////////////////////////
export default function AppImage(props: IAppImage): JSX.Element {
    const { src, alt, ...rest } = props;
    const [isLoading, setIsLoading] = useState(true);

    const handleLoad = (): void => {
        setIsLoading(false);
    };

    return (
        <>
            {/* Placeholder (visible tant que l'image principale n'est pas chargée) */}
            {isLoading && <Box component="img" src={LoaderGif} alt="loading..." sx={{ display: 'block', maxWidth: '100%', ...rest.sx }} />}

            {/* Image principale */}
            <Box
                component="img"
                src={src}
                alt={alt}
                loading="lazy"
                onError={handleLoad}
                onLoad={handleLoad}
                sx={{
                    display: 'block',
                    // width: isLoading ? 0 : null,
                    maxWidth: '100%',
                    ...rest.sx,
                }}
                {...rest}
            />
        </>
    );
}
// #endregion SINGLETON --> /////////////////////////////////

// #region IPROPS -->  /////////////////////////////////////
interface IAppImage extends BoxProps<'img'> {
    alt?: string; // utile pour l’accessibilité
    src: string; // obligatoire
}
// #enderegion IPROPS --> //////////////////////////////////
