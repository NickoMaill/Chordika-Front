import { createContext } from 'react';
import { CenterState, CenterStateAction } from '~/types/centerType';
import { useContext } from 'react';
import { Dispatch } from 'react';

/* eslint-disable @typescript-eslint/no-explicit-any*/
export const CenterContext = createContext<any>(undefined);

export default function useCenterContext<T>(): { state: CenterState<T>; dispatch: Dispatch<CenterStateAction<T>> } {
    const context = useContext(CenterContext);
    if (!context) throw new Error('useCenterContext must be used within a CenterProvider');

    return context;
}
