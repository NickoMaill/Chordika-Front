// #region IMPORTS -> /////////////////////////////////////
import { useContext, useEffect, useMemo } from 'react';
import { GenericActionEnum, ICenter } from '~/types/centerType';
import AppContext from '~/context/appContext';
import { LevelAccessEnum } from '~/models/Session';
import SessionContext from '~/context/sessionContext';
import { useCenterActions, useCenterQuery, useCenterTools } from '~/hooks/useCenterActions';
import { doneProgress } from '~/helpers/progressHelper';
import useCenterContext from '~/context/centerContext';
import { useLocation } from 'react-router-dom';
import RenderCenter from './RenderCenter';
import appTool from '~/helpers/appTool';
import SearchContext from '~/context/searchContext';
import { JSX } from 'react';
import nProgress from 'nprogress';
import AppFullPageLoader from '../common/AppFullPageLoader';
// #endregion IMPORTS -> //////////////////////////////////

// #region SINGLETON --> ////////////////////////////////////
// #endregion SINGLETON --> /////////////////////////////////

export default function AppCenter<T>(props: ICenter<T>): JSX.Element {
    // #region STATE --> ///////////////////////////////////////
    const { search } = useLocation();
    const action = appTool.getAction((props.isSubCenter ? GenericActionEnum.TABLE : props.action) || '');
    const id = useMemo(() => (props.id ? props.id : new URLSearchParams(search).get('ID')), [search]);
    // #endregion STATE --> ////////////////////////////////////

    // #region HOOKS --> ///////////////////////////////////////
    const Ses = useContext(SessionContext);
    const App = useContext(AppContext);
    const Ctx = useCenterContext<T>();
    const Search = useContext(SearchContext);

    const { getConfig } = useCenterActions<T>({ props, action, id });
    const { tableQuery, queryOne } = useCenterQuery<T>({ props, action, id });
    const { setSearchURL } = useCenterTools({ props, action, id });
    // #endregion HOOKS --> ////////////////////////////////////

    // #region METHODS --> /////////////////////////////////////
    /**
     * @description Load appropriate config in terms of `GenericAction`
     */
    const load = async (): Promise<void> => {
        if (Ctx.state.config) {
            if (Ctx.state.config?.level !== LevelAccessEnum.NOBODY && Ctx.state.config?.level <= Ses.accessLevel) {
                switch (action) {
                    case GenericActionEnum.TABLE:
                        await tableQuery();
                        break;
                    case GenericActionEnum.UPDATE:
                    case GenericActionEnum.VIEW:
                    case GenericActionEnum.DELETE:
                        Ctx.dispatch({ type: 'SET_ALERT_VISIBLE', payload: false });
                        await queryOne();
                        break;
                    case GenericActionEnum.NEW:
                        Ctx.dispatch({ type: 'SET_ALERT_VISIBLE', payload: false });
                        Ctx.dispatch({ type: 'SET_LOADING', payload: false });
                        break;
                }
            } else {
                App.setIsNoAccess(true);
            }
        }
    };
    // #endregion
    // #endregion

    // #endregion METHODS --> //////////////////////////////////

    // #region USEEFFECT --> ///////////////////////////////////
    useEffect(() => {
        if (action !== GenericActionEnum.NEW && !Ctx.state.isLoading) {
            Ctx.dispatch({ type: 'SET_LOADING', payload: true });
        }
        if (action === GenericActionEnum.NEW) doneProgress();
        if (action !== GenericActionEnum.TABLE) {
            if (action !== GenericActionEnum.NEW) {
                Ctx.dispatch({ type: 'SET_REFRESH', payload: true });
            }
            Ctx.dispatch({ type: 'SET_ALERT_VISIBLE', payload: false });
        }
        if (action === GenericActionEnum.TABLE) Ctx.dispatch({ type: 'SET_DATA', payload: null });

        if (!Ctx.state.isInitialized) {
            getConfig();
        }
    }, []);

    useEffect(() => {
        if (Ctx.state.refresh && Ctx.state.isInitialized) {
            Ctx.dispatch({ type: 'SET_LOADING', payload: true });
            if (action === GenericActionEnum.TABLE && !props.isSubCenter) {
                setSearchURL();
            }
            load().finally(() => nProgress.done());
            Ctx.dispatch({ type: 'SET_REFRESH', payload: false });
        }
    }, [Ctx.state.refresh, action, Ctx.state.isInitialized]);

    useEffect(() => {
        if (Ctx.state.config) {
            if (Ctx.state.config?.level === LevelAccessEnum.NOBODY) {
                App?.setIsNoAccess(true);
            } else {
                if (App.setIsNoAccess) App.setIsNoAccess(false);
            }
        }
    }, [Ctx.state.config?.level]);

    useEffect(() => {
        Ctx.dispatch({ type: 'SET_REFRESH', payload: true });
    }, [Search.page, Search.sortedBy]);
    // #endregion USEEFFECT --> ////////////////////////////////

    // #region RENDER --> //////////////////////////////////////
    // return <>{!Ctx.state.isInitialized ? <AppFullPageLoader isLoading count={3000} counting /> : <RenderCenter props={props} action={action} id={id} table={table} />}</>;
    return <>{!Ctx.state.isInitialized ? <AppFullPageLoader isLoading count={1000} counting /> : Ctx.state.config && Ctx.state.handlersLoaded ? <RenderCenter props={props} action={action} id={id} table={props.entity} /> : <></>}</>;
    // #endregion RENDER --> ///////////////////////////////////
}

// #region IPROPS -->  /////////////////////////////////////
// #endregion IPROPS --> //////////////////////////////////
