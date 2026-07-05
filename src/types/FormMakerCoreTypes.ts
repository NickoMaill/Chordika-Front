import { SelectChangeEvent } from '@mui/material/Select';
import { Breakpoint, SxProps } from '@mui/material/styles';
import { DateView } from '@mui/x-date-pickers';
import { CSSProperties, ChangeEvent, Dispatch, ReactNode } from 'react';
import { CenterState, CenterStateAction, GenericActionEnum } from './centerType';
import { JSX } from 'react';
import { IconNameType } from '~/components/common/AppIcon';
import { GridSize } from '@mui/material';

/**
 * @description FormMaker input type options
 */
export interface IFormMakerInput extends InputBaseType {
    /**
     * @description required option if type === 'select'
     */
    selectOptions?: SelectOptionsType[];
    /**
     * @description required option if type === 'groupedSelect'
     */
    groupedSelectOptions?: GroupedSelectOptionType[];
    /**
     * @description required option if type === 'checkbox'
     */
    checkboxOptions?: CheckboxOptionType[];
    /**
     * @description required option if type === 'radio'
     */
    radioOptions?: RadioOptionsType[];
    /**
     * @description to render html content
     */
    htmlContent?: ({ data }: { data: unknown }) => JSX.Element;
    /**
     * @description type of input, see InputType type for more details
     */
    type: InputType;
    /**
     * @description index of input display, if 1, a new line is added, else input is added on same line than previous after it. CANNOT BE EQUALS TO 0 !!
     */
    index: number;
    /**
     * @description limit of char for textarea, or limit for number input type
     */
    limit?: number;
    /**
     * @description number of rows to render for textarea
     */
    rows?: number;
    /**
     * @description date format string, can be dd/mm/yyyy or dddd mmmm yyyy or whatever you want
     */
    dateFormat?: string;
    /**
     * @description determine order of input render as string array like this ['day', 'month', 'year].
     * @property ONLY 'day', 'month', 'year' ARE ALLOWED
     */
    dateViews?: DateView[];
    dateOpenTo?: DateView;
    isInputLoading?: boolean;
    searchValueFormatter?: (v: unknown) => string;
    ssr?: boolean;
    ssrUrlExtension?: string;
    switchValue?: string | number | boolean;
    onDeleteChoices?: (v: SelectOptionsType[]) => void;
    parentField?: string;
    centerState?: CenterState<unknown>;
    centerDispatch?: Dispatch<CenterStateAction<unknown>>;
}

/**
 * @description FormMaker structure Type
 */
export type FormMakerType<T extends FormMakerPartEnum> = FormMakerContentType<T>[];

export type FormMakerContentType<T extends FormMakerPartEnum> = {
    /**
     * @description title of tab if T = FormMakerPartEnum.TAB else title of PANEL
     */
    title: string;
    /**
     * @description determine what part of formMaker content property will be
     */
    type: T extends FormMakerPartEnum.TAB ? FormMakerPartEnum.TAB : T extends FormMakerPartEnum.PANEL ? FormMakerPartEnum.PANEL : FormMakerPartEnum.SEARCH;
    /**
     * @description content of part
     */
    content: T extends FormMakerPartEnum.TAB ? IFormMakerPanel[] : IFormMakerInput[];
    /**
     * @description icon of the panel
     */
    icon?: IconNameType;
    /**
     * @description determine if content need to be masqued
     */
    hidden?: ({ data, action }: { data: unknown; action: GenericActionEnum }) => boolean;
};

export interface IFormMakerPanel {
    /**
     * @description title of FormMaker Panel
     */
    title: string;
    /**
     * @description content of FormMaker Panel
     */
    content: IFormMakerInput[];
    /**
     * @description icon of the panel
     */
    icon?: IconNameType;
    type?: FormMakerPartEnum;
}
/**
 * @description enumerator to identify par of FormMaker
 */
export enum FormMakerPartEnum {
    TAB = 0,
    PANEL = 1,
    SEARCH = 2,
}

/**
 * @description type of error for focus on error feature of FormMaker, field is the field name to focus, name is the field name to display in error message and message is the error message to display
 */
export type FormMakerFocusErrorType = {
    field: string;
    name: string;
    message: string;
};

//====================================>
/**
 * @description Input regular type
 */
export interface InputBaseType {
    label?: string;
    id: string;
    onChange?: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent<unknown> | File | string | Date | boolean, args?: unknown) => void;
    required?: boolean;
    error?: boolean;
    success?: boolean;
    warning?: boolean;
    size?: GridSize | Array<GridSize | null> | { [key in Breakpoint]?: GridSize | null }
    helpText?: string;
    errorMessage?: string | ReactNode;
    autoComplete?: AutoCompleteType;
    autoCapitalize?: AutoCapitalizeType;
    value?: unknown;
    disabled?: boolean;
    readOnly?: boolean;
    pattern?: RegExp;
    showLabel?: boolean;
    placeholder?: string;
    sx?: SxProps;
    hidden?: boolean;
    style?: CSSProperties;
    isLoading?: boolean;
    icon?: IconNameType;
    className?: string;
    defaultValue?: unknown;
    onFocusChange?: (isFocused: boolean) => void;
    isSearchForm?: boolean;
    resetSignal?: unknown;
    showErrorContainer?: boolean;
}

export type AutoCompleteType = 'on' | 'off' | 'given-name' | 'family-name' | 'email' | 'address-line1' | 'country' | 'country-name' | 'bday' | 'new-password';
export type AutoCapitalizeType = 'off' | 'on' | 'words' | 'characters';
export type InputType =
    | 'button'
    | 'email'
    | 'hidden'
    | 'number'
    | 'password'
    | 'reset'
    | 'search'
    | 'tel'
    | 'text'
    | 'url'
    | 'select'
    | 'checkbox'
    | 'radio'
    | 'autocomplete'
    | 'multipleAutocomplete'
    | 'textarea'
    | 'date'
    | 'dateSearch'
    | 'color'
    | 'switch'
    | 'htmlContent'
    | 'file'
    | 'range'
    | 'value'
    | 'datetime'
    | 'richText'
    | 'cron'
    | 'center'
    | 'htmlParser'
    | 'JSON'
    | 'richText'
    | 'groupedSelect';
export type InputModeType = 'decimal' | 'email' | 'search' | 'tel' | 'text' | 'url' | 'none' | 'numeric';

export type SelectOptionsType = {
    value: string | number | boolean;
    label: string;
};

export type GroupedSelectOptionType = {
    label: string;
    options: SelectOptionsType[];
};

export type RadioOptionsType = SelectOptionsType;

export type CheckboxOptionType = SelectOptionsType & {
    defaultChecked: boolean;
};
