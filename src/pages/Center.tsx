// #region IMPORTS -> /////////////////////////////////////
import { JSX, lazy } from 'react';
import { Container } from '@mui/material';
import { ReactNode, startTransition, Suspense, useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import AppFullPageLoader from '~/components/common/AppFullPageLoader';
import CenterProvider from '~/context/CenterProvider';
import SearchProvider from '~/context/SearchProvider';
import { AppError, ErrorTypeEnum } from '~/core/appError';
// #endregion IMPORTS -> //////////////////////////////////

// #region SINGLETON --> ////////////////////////////////////
const AppCenter = lazy(() => import('~/components/center/AppCenter'));
let key = 0;
// #endregion SINGLETON --> /////////////////////////////////

export default function Center(): JSX.Element {
    // #region STATE --> ///////////////////////////////////////
    const [component, setComponent] = useState<ReactNode>(null);
    // #endregion STATE --> ////////////////////////////////////

    // #region HOOKS --> ///////////////////////////////////////
    const { search } = useLocation();
    const table = useMemo(() => new URLSearchParams(search).get('Table'), [search]);
    // #endregion HOOKS --> ////////////////////////////////////

    // #region METHODS --> /////////////////////////////////////
    const loadingComponent = async (): Promise<JSX.Element> => {
        const params = new URLSearchParams(search);
        try {
            const module = await import(`../components/app/${table}/index.tsx`);
            const DynamicComponent = module.default || module;
            return <DynamicComponent />;
        } catch (error) {
            if (error.message.includes('Unknown variable dynamic import') && table) {
                const table = params.get('Table');
                const componentProps = { entity: table };
                key++; // pour forcer le re-rendu de react quand deux fois le même composant mais pas les même paramètres
                return <AppCenter key={key} {...componentProps} />;
            } else {
                console.error(error.message);
                throw new AppError(ErrorTypeEnum.Technical, 'error while loading main component', 'loading_error', error.message);
            }
        }
    };
    // #endregion METHODS --> //////////////////////////////////

    // #region USEEFFECT --> ///////////////////////////////////
    useEffect(() => {
        let cancelled = false;

        const load = async (): Promise<void> => {
            try {
                const res = await loadingComponent();
                if (!cancelled) {
                    startTransition(() => {
                        setComponent(res);
                    });
                }
            } catch (error) {
                console.error(error);
            }
        };
        const params = new URLSearchParams(search);
        if (params.get('action') === 'new' && params.has('ID')) {
            throw new AppError(ErrorTypeEnum.Functional, 'invalid params', 'invalid_params');
        } else {
            if (table) load();
        }

        return (): void => {
            cancelled = true;
        };
    }, [table]);
    // #endregion USEEFFECT --> ////////////////////////////////

    // #region RENDER --> //////////////////////////////////////
    return (
        <CenterProvider>
            <SearchProvider>
                <Container sx={{ '@media (min-width: 1200px)': { maxWidth: null } }}>
                    <Suspense fallback={<AppFullPageLoader isLoading />}>{component}</Suspense>
                </Container>
            </SearchProvider>
        </CenterProvider>
    );
    // #endregion RENDER --> ///////////////////////////////////
}

// #region IPROPS -->  /////////////////////////////////////
// #endregion IPROPS --> //////////////////////////////////
