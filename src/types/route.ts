import { JSX } from 'react';
import { ParsedUrlQuery } from 'querystring';
import { RecursiveKeyOf } from './custom';
import { LevelAccessEnum } from '~/models/Session';
import { TranslationResourcesType } from './i18nTypes';
import { IconNameType } from '~/components/common/AppIcon';

export type RouterDescription = {
    name: RecursiveKeyOf<RouteNameReference>;
    path: string;
    isAuthRequired?: boolean;
    query?: ParsedUrlQuery;
    element?: (props?: unknown) => JSX.Element;
    title: string;
    levelAccess: LevelAccessEnum;
    isIndex?: boolean;
    children?: RouterDescription[];
};

export type RouteNameReference = {
    Home;
    Users;
    Error;
    Login;
    Reset;
    Center;
    CenterTable;
    CenterNew;
    CenterUpdate;
    CenterDelete;
    CenterView;
    Profile;
    Proxy;
    NotFound;
    SQLTest;
    Monitor;
    Scores;
    Editor;
    ScoreImport;
    ScoreAdd;
    Register;
    Notifications;
};

export type RootHeaderlinkType = {
    name: RecursiveKeyOf<TranslationResourcesType> | 'divider';
    icon?: IconNameType;
    levelAccess?: LevelAccessEnum;
    [key: string]: unknown;
    isFolder?: boolean;
};

export type HeaderLinkType = RootHeaderlinkType & {
    link?: string;
    method?: string;
};
