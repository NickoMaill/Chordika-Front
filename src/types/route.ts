import { JSX } from 'react';
import { ParsedUrlQuery } from 'querystring';
import { RecursiveKeyOf } from './custom';
import { OverridableComponent } from '@mui/material/OverridableComponent';
import { SvgIconTypeMap } from '@mui/material/SvgIcon';
import { LevelAccessEnum } from '~/models/Session';
import { TranslationResourcesType } from './i18nTypes';

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
    Register;
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
    Pivot;
    Setup;
    Scores;
    Editor;
    ScoreImport;
    ScoreAdd;
};

export type RootHeaderlinkType = {
    name: RecursiveKeyOf<TranslationResourcesType> | 'divider';
    Icon: OverridableComponent<SvgIconTypeMap<object, 'svg'>> & {
        muiName: string;
    };
    levelAccess?: LevelAccessEnum;
    wildcard?: boolean;
    [key: string]: unknown;
};

export type HeaderLinkType =
    | (RootHeaderlinkType & {
          link: string;
          redirect: true;
      })
    | (RootHeaderlinkType & {
          redirect: false;
          method: string;
      })
    | {
          name: 'divider';
      };
