// #region IMPORTS -> /////////////////////////////////////
// #endregion IMPORTS -> //////////////////////////////////

import { RecursiveKeyOf } from '~/types/custom';

// #region SINGLETON --> ////////////////////////////////////
export type StorageType = {
    lang: string;
    darkMode: string;
    maxRows: number;
};

export type SessionStorageType = {
    annonces: string;
};
// #endregion SINGLETON --> /////////////////////////////////

export default function useStorage(): IUseStorage {
    // #region STATE --> ///////////////////////////////////////
    // #endregion STATE --> ////////////////////////////////////

    // #region HOOKS --> ///////////////////////////////////////
    // #endregion HOOKS --> ////////////////////////////////////

    // #region METHODS --> /////////////////////////////////////
    const getItem = (key: RecursiveKeyOf<StorageType>): string => {
        const item = window.localStorage.getItem(key);
        return item;
    };

    const getSessionItem = (key: RecursiveKeyOf<SessionStorageType>): string => {
        const item = window.sessionStorage.getItem(key);
        return item;
    };

    const setItem = (key: RecursiveKeyOf<StorageType>, value): boolean => {
        window.localStorage.setItem(key, value.toString());
        return true;
    };

    const setSessionItem = (key: RecursiveKeyOf<SessionStorageType>, value: string): boolean => {
        window.localStorage.setItem(key, value);
        return true;
    };

    const getParsedItem = <T,>(key: RecursiveKeyOf<StorageType>): T => {
        const item = getItem(key);
        if (!item) {
            return null;
        } else {
            return JSON.parse(item) as T;
        }
    };

    const getParsedSessionItem = <T,>(key: RecursiveKeyOf<SessionStorageType>): T => {
        const item = getSessionItem(key);
        if (!item) {
            return null;
        } else {
            return JSON.parse(item) as T;
        }
    };

    const isItemExist = (key: RecursiveKeyOf<StorageType>): boolean => {
        return !!getItem(key);
    };

    const isSessionItemExist = (key: RecursiveKeyOf<SessionStorageType>): boolean => {
        return !!getSessionItem(key);
    };

    const removeItem = (key: RecursiveKeyOf<StorageType>): boolean => {
        window.localStorage.removeItem(key);
        return true;
    };

    const removeSessionItem = (key: RecursiveKeyOf<SessionStorageType>): boolean => {
        window.sessionStorage.removeItem(key);
        return true;
    };

    const clearStorage = (): boolean => {
        window.localStorage.clear();
        return true;
    };

    const clearSessionStorage = (): boolean => {
        window.sessionStorage.clear();
        return true;
    };

    // #endregion METHODS --> //////////////////////////////////

    // #region USEEFFECT --> ///////////////////////////////////
    // #endregion USEEFFECT --> ////////////////////////////////

    // #region RENDER --> //////////////////////////////////////
    return {
        getItem,
        getSessionItem,
        setItem,
        setSessionItem,
        isItemExist,
        isSessionItemExist,
        getParsedItem,
        getParsedSessionItem,
        removeItem,
        removeSessionItem,
        clearStorage,
        clearSessionStorage,
    };
    // #endregion RENDER --> ///////////////////////////////////
}

// #region IPROPS -->  /////////////////////////////////////
interface IUseStorage {
    getItem: (key: RecursiveKeyOf<StorageType>) => string;
    getSessionItem: (key: RecursiveKeyOf<SessionStorageType>) => string;
    setItem: (key: RecursiveKeyOf<StorageType>, value) => boolean;
    setSessionItem: (key: RecursiveKeyOf<SessionStorageType>, value: string) => boolean;
    getParsedItem: <T>(key: RecursiveKeyOf<StorageType>) => T;
    getParsedSessionItem: <T>(key: RecursiveKeyOf<SessionStorageType>) => T;
    isItemExist: (key: RecursiveKeyOf<StorageType>) => boolean;
    isSessionItemExist: (key: RecursiveKeyOf<SessionStorageType>) => boolean;
    removeItem: (key: RecursiveKeyOf<Storage>) => boolean;
    removeSessionItem: (key: RecursiveKeyOf<SessionStorageType>) => boolean;
    clearStorage: () => boolean;
    clearSessionStorage: () => boolean;
}
// #endregion IPROPS --> //////////////////////////////////
