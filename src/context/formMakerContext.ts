import { createContext, useContext } from 'react';

export type FormMakerValue = unknown;

export interface IFormMakerContext {
    values: Record<string, FormMakerValue>;
    setValue: (field: string, value: FormMakerValue) => void;
    setValues: (nextValues: Record<string, FormMakerValue>) => void;
    getValue: <T = FormMakerValue>(field: string) => T;
    resetValues: (nextValues?: Record<string, FormMakerValue>) => void;
}

const FormMakerContext = createContext<IFormMakerContext | null>(null);

export function useFormMaker(): IFormMakerContext {
    const context = useContext(FormMakerContext);

    if (!context) {
        throw new Error('useFormMaker must be used within a FormMaker provider');
    }

    return context;
}

export default FormMakerContext;
