import { createContext, Dispatch, useContext } from 'react';
import { CenterState, CenterStateAction } from '~/types/centerType';

export type CenterContextValue<T> = {
    state: CenterState<T>;
    dispatch: Dispatch<CenterStateAction<T>>;
};

export const CenterContext = createContext<CenterContextValue<unknown> | undefined>(undefined);

export default function useCenterContext<T>(): CenterContextValue<T> {
    const context = useContext(CenterContext);
    if (!context) throw new Error('useCenterContext must be used within a CenterProvider');

    return context as CenterContextValue<T>;
}
