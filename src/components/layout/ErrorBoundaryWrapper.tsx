// #region IMPORTS -> /////////////////////////////////////
import React, { JSX } from 'react';
import { ReactNode, useEffect, useState } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import ErrorHandler from '~/core/ErrorHandler';
// #endregion IMPORTS -> //////////////////////////////////

// #region SINGLETON --> ////////////////////////////////////
// #endregion SINGLETON --> /////////////////////////////////

export default function ErrorBoundaryWrapper({ children }: { children: ReactNode }): JSX.Element {
    // #region STATE --> ///////////////////////////////////////
    const [errorKey, setErrorKey] = useState(0);

    useEffect(() => {
        const handleBackNavigation = (): void => {
            setErrorKey((prevKey) => prevKey + 1); // Change la clé pour forcer le reset
        };

        window.addEventListener('popstate', handleBackNavigation);
        return (): void => {
            window.removeEventListener('popstate', handleBackNavigation);
        };
    }, []);
    // #endregion STATE --> ////////////////////////////////////

    // #region HOOKS --> ///////////////////////////////////////
    // #endregion HOOKS --> ////////////////////////////////////

    // #region METHODS --> /////////////////////////////////////
    // #endregion METHODS --> //////////////////////////////////

    // #region USEEFFECT --> ///////////////////////////////////
    // #endregion USEEFFECT --> ////////////////////////////////

    // #region RENDER --> //////////////////////////////////////
    return (
        <ErrorBoundary FallbackComponent={ErrorHandler} resetKeys={[errorKey]}>
            {children}
        </ErrorBoundary>
    );
    // #endregion RENDER --> ///////////////////////////////////
}

// #region IPROPS -->  /////////////////////////////////////
// #enderegion IPROPS --> //////////////////////////////////
