import { Dispatch, SetStateAction } from 'react';
import { FormMakerContentType, FormMakerPartEnum, IFormMakerInput, IFormMakerPanel } from '~/types/FormMakerCoreTypes';
import { RecursiveKeyOf } from '~/types/custom';

class StateHelper {
    // public --> start region /////////////////////////////////////////////
    /**
     * @description a tool that update a state object
     * @param key key to update
     * @param value value of key to update
     * @param setState useStateHooks start with `set`
     */
    public updateStateObject<T, S>(key: string, value: T, setState: Dispatch<SetStateAction<S>>): void {
        setState((prevState) => {
            return { ...prevState, [key]: value };
        });
    }
    /**
     * @description a tool that append a value or object in state array
     * @param value can be primitive value or object or array
     * @param setState useStateHooks start with `set`
     */
    public AppendValueInStateArray<T>(value: T, setState: Dispatch<SetStateAction<T[]>>): void {
        setState((prevState) => {
            return [...prevState, value];
        });
    }
    /**
     * a tool that remove a value or object in state array
     * @param index index of value
     * @param setState useStateHooks start with `set`
     */
    public RemoveValueInStateArray<T>(index: number, setState: Dispatch<SetStateAction<T[]>>): void {
        setState((prevState) => {
            return prevState.filter((_x, i) => i !== index);
        });
    }

    /**
     * a tool that Update an object value in state array
     * @param key key to update
     * @param value value of key to update
     * @param index index of object
     * @param setState useStateHooks start with `set`
     */
    public updateObjectInStateArray<T, V>(key: string, value: V, index: number, setState: Dispatch<SetStateAction<T[]>>): void {
        setState((prevState) => {
            return prevState.map((obj, i) => {
                if (i === index) {
                    return { ...obj, [key]: value };
                } else {
                    return obj;
                }
            });
        });
    }

    public updateTabFormMaker(key: RecursiveKeyOf<IFormMakerInput>, value: string | number | boolean, setState: Dispatch<SetStateAction<FormMakerContentType<FormMakerPartEnum.TAB>[]>>): void {
        setState((prevState) => {
            return prevState.map((p: FormMakerContentType<FormMakerPartEnum.TAB>) => {
                return {
                    ...p,
                    content: p.content.map((c: IFormMakerPanel) => {
                        return {
                            ...c,
                            content: c.content.map((f: IFormMakerInput) => {
                                return { ...f, [key]: value };
                            }),
                        };
                    }),
                };
            });
        });
    }

    public updatePanelFormMaker(key: RecursiveKeyOf<IFormMakerInput>, value: string | number | boolean, setState: Dispatch<SetStateAction<FormMakerContentType<FormMakerPartEnum.PANEL>[]>>): void {
        setState((prevState) => {
            return prevState.map((f) => {
                return {
                    ...f,
                    content: f.content.map((x) => {
                        return { ...x, [key]: value };
                    }),
                };
            });
        });
    }

    // public --> end region ///////////////////////////////////////////////

    // private --> start region ////////////////////////////////////////////
    // private --> end region //////////////////////////////////////////////
}
export default new StateHelper();
