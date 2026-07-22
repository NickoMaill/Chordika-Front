import { ChangeEvent, lazy, RefObject, useEffect, useMemo, useState } from 'react';
import { FormMakerType, FormMakerFocusErrorType, FormMakerPartEnum, IFormMakerInput, IFormMakerPanel, InputBaseType, InputType, FormMakerContentType } from '~/types/FormMakerCoreTypes';
import TabsView from '../common/TabsView';
import AppGridContainer from '../common/AppGridContainer';
import InputBase from './elements/InputBase';
import InputSubmit from './elements/InputSubmit';
import { AppError, ErrorTypeEnum } from '~/core/appError';
import appTool from '~/helpers/appTool';
import { GenericActionEnum } from '~/types/centerType';
import useResources from '~/hooks/useResources';
import InputAutoComplete from './elements/InputAutoComplete';
import { useParams } from 'react-router-dom';
import CenterProvider from '~/context/CenterProvider';
import InputValue from './elements/InputValue';
import JSONView from './elements/JSONView';
import SearchProvider from '~/context/SearchProvider';
import { JSX } from 'react';
import { IconNameType } from '~/components/common/AppIcon';
import AppFullPageLoader from '../common/AppFullPageLoader';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import SectionLayout from '../layout/SectionLayout';
import dayjs from 'dayjs';
import FormMakerContext, { FormMakerValue } from '~/context/formMakerContext';
// #endregion IMPORTS -> //////////////////////////////////

// #region SINGLETON --> ////////////////////////////////////
const InputTextField = lazy(() => import('./elements/InputTextField'));
const InputFileField = lazy(() => import('./elements/InputFileField'));
const RangeInput = lazy(() => import('./elements/RangeInput'));
const InputSwitchField = lazy(() => import('./elements/InputSwitchField'));
const InputColorField = lazy(() => import('./elements/InputColorField'));
const RangeDateField = lazy(() => import('./elements/RangeDateField'));
const InputDateField = lazy(() => import('./elements/InputDateField'));
const InputTextAreaField = lazy(() => import('./elements/InputTextAreaField'));
const InputRadioField = lazy(() => import('./elements/InputRadioField'));
const InputAutoCompleteMultiple = lazy(() => import('./elements/InputAutoCompleteMultiple'));
const InputTelephoneField = lazy(() => import('./elements/InputTelephoneField'));
const InputSelectField = lazy(() => import('./elements/InputSelectField'));
const InputCheckBoxField = lazy(() => import('./elements/InputCheckBoxField'));
const InputRichTextField = lazy(() => import('./elements/InputRichTextField'));
const InputCronField = lazy(() => import('./elements/InputCronField'));
const InputGroupedSelectField = lazy(() => import('./elements/InputGroupedSelectField'));
const AppCenter = lazy(() => import('../center/AppCenter'));

const noInputBase: InputType[] = ['hidden'];
const elementSpacing = 2;
// #endregion SINGLETON --> /////////////////////////////////
export default function FormMaker<T>({
    onSubmit,
    structure,
    data,
    outputType = 'formData',
    onBackPress,
    isSubmitLoading,
    focusOnError = [],
    action,
    grammar,
    isView = false,
    submitLabel,
    submitFullWidth = false,
    showBackPress = true,
    showBottom = true,
    idExtension = '',
    formRef = null,
    isSearchForm = false,
    isFormLoading = false,
    resetCount = 0,
    recordId,
}: IFormMaker<T>): JSX.Element {
    // #region STATE --> ///////////////////////////////////////
    const [file, setFile] = useState<File>(null);
    const [fileField, setFileFields] = useState<string>(null);
    const [formValues, setFormValues] = useState<Record<string, FormMakerValue>>({});
    let groupIds = 0;
    // const [initialValues, setInitialValues] = useState({});
    // const [formSubmitted, setFormSubmitted] = useState(false);
    // #endregion STATE --> ////////////////////////////////////

    // #region HOOKS --> ///////////////////////////////////////
    // const [params] = useSearchParams();
    const { translate } = useResources();
    const { id } = useParams();
    const centerParentId = recordId ?? id;
    // #endregion HOOKS --> ////////////////////////////////////

    // #region METHODS --> /////////////////////////////////////
    const handleSubmit = (e: ChangeEvent<HTMLFormElement>): FormData | T => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        if (outputType === 'JSON') {
            const obj = {};
            for (const pair of formData.entries()) {
                Object.defineProperty(obj, pair[0], { value: pair[1], writable: true });
            }
            return obj as T;
        } else {
            if (file && fileField) {
                formData.delete(fileField);
                formData.append(fileField, file);
            }
            return formData;
        }
    };

    const extractInitialValues = (): Record<string, FormMakerValue> => {
        const values: Record<string, FormMakerValue> = {};

        const assignValue = (input: IFormMakerInput): void => {
            if (!input) return;
            const source = data && typeof data === 'object' ? (data as Record<string, FormMakerValue>) : null;
            values[input?.id] = source && input.id in source ? (source[input.id] as FormMakerValue) : ((input.value ?? '') as FormMakerValue);
        };

        if (!structure?.length) {
            return values;
        }

        structure.forEach((part) => {
            if (part.type === FormMakerPartEnum.TAB) {
                (part.content as IFormMakerPanel[]).forEach((panel) => {
                    panel.content.forEach(assignValue);
                });
            } else {
                (part.content as IFormMakerInput[]).forEach(assignValue);
            }
        });

        return values;
    };

    const setValue = (field: string, value: FormMakerValue): void => {
        setFormValues((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const setValues = (nextValues: Record<string, FormMakerValue>): void => {
        setFormValues((prev) => ({
            ...prev,
            ...nextValues,
        }));
    };

    const getValue = <TValue = FormMakerValue,>(field: string): TValue => {
        return (formValues[field] ?? null) as TValue;
    };

    const resetValues = (nextValues?: Record<string, FormMakerValue>): void => {
        setFormValues(nextValues ?? extractInitialValues());
    };

    const formMakerContextValue = useMemo(
        () => ({
            values: formValues,
            setValue,
            setValues,
            getValue,
            resetValues,
        }),
        [formValues]
    );
    /**
     * @description method that parse and render form
     * @returns form content HTML Element
     */
    const renderForm = (): JSX.Element => {
        if (structure && structure.length > 0) {
            checkIds();
            if (structure[0].type === FormMakerPartEnum.TAB) {
                const tabTitles: { label: string; icon: IconNameType }[] = [];
                const tabGlobalContent: JSX.Element[][] = [];
                let tabContent: JSX.Element[] = [];

                structure
                    .filter((s) => (s.hidden ? s.hidden({ data, action }) === false : true))
                    .forEach((tab: FormMakerContentType<FormMakerPartEnum>) => {
                        tabTitles.push({ label: tab.title, icon: tab.icon });
                        tab.content.forEach((panel, i) => {
                            tabContent.push(buildPanelContent(panel, i));
                        });
                        tabGlobalContent.push(tabContent);
                        tabContent = [];
                    });
                return <TabsView tabTitles={tabTitles} content={tabGlobalContent} />;
            } else {
                return <>{structure.filter((s) => (s.hidden ? s.hidden({ data, action }) === false : true)).map((s, i) => buildPanelContent(s, i))}</>;
            }
        }
    };

    /**
     * @description check if ids are uniq
     * @throws an AppError if not ids are founds
     */
    const checkIds = (): void => {
        const ids: string[] = [];
        if (structure && structure.length > 0) {
            structure.forEach((s) => {
                if (s.type === FormMakerPartEnum.TAB) {
                    (s.content as IFormMakerPanel[]).forEach((p: IFormMakerPanel) => {
                        p.content.forEach((el) => {
                            if (!el) return;
                            ids.push(el.id);
                        });
                    });
                } else {
                    (s.content as IFormMakerInput[]).forEach((el) => {
                        if (!el) return;
                        ids.push(el.id);
                    });
                }
            });
        }
        const duplicate = appTool.findDuplicates(ids);

        if (duplicate.length > 0) {
            // throw new AppError(ErrorTypeEnum.Technical, `found duplicate ids in formMaker (${duplicate.join(',')}) input must have uniq id`);
        }
    };

    const buildPanelContent = (struct: FormMakerContentType<FormMakerPartEnum.PANEL | FormMakerPartEnum.SEARCH>, index: number): JSX.Element => {
        const groupedElement: JSX.Element[] = [];
        let currentGroup: JSX.Element[] = [];
        struct.content.forEach((element, i) => {
            if (!element || element.hidden) return;
            const inputBaseProps: InputBaseType = {
                className: element.className,
                sx: element.sx,
                success: element.success,
                warning: element.warning,
                required: element.required,
                disabled: element.disabled,
                showLabel: element.showLabel,
                size: element.size,
                id: element.type === 'autocomplete' || element.type === 'multipleAutocomplete' ? element.id + 'Field' : element.id,
                helpText: element.helpText,
                label: element.label,
                error: focusOnError.some((f) => f.field.toLowerCase() === element.id.toLowerCase()) || element.error,
                errorMessage: focusOnError.find((f) => f.field.toLowerCase() === element.id.toLowerCase())?.message ?? element.errorMessage,
                showErrorContainer: element.showErrorContainer
            };
            if (element.index === 1) {
                if (currentGroup.length > 0) {
                    groupedElement.push(
                        <AppGridContainer key={`group-${groupIds}`} id={`group-${groupIds}`} spacing={elementSpacing}>
                            {currentGroup}
                        </AppGridContainer>
                    );
                    currentGroup = [];
                    groupIds++;
                }
                currentGroup.push(
                    noInputBase.includes(element.type) ? (
                        buildInput(element, i)
                    ) : (
                        <InputBase key={i} {...inputBaseProps}>
                            {buildInput(element, i)}
                        </InputBase>
                    )
                );
            } else {
                currentGroup.push(
                    noInputBase.includes(element.type) ? (
                        buildInput(element, i)
                    ) : (
                        <InputBase key={i} {...inputBaseProps}>
                            {buildInput(element, i)}
                        </InputBase>
                    )
                );
            }

            if (i === struct.content.length - 1) {
                groupedElement.push(
                    <AppGridContainer key={'a' + i} spacing={elementSpacing}>
                        {currentGroup}
                    </AppGridContainer>
                );
                currentGroup = [];
            }
        });
        if (struct.type === FormMakerPartEnum.PANEL || structure[0].type === FormMakerPartEnum.TAB) {
            return (
                <SectionLayout key={index} icon={struct.icon} title={struct.title}>
                    {groupedElement}
                </SectionLayout>
            );
        } else {
            return (
                <Box key={index} display="flex" justifyContent="center" flexDirection="column" alignItems="center">
                    {groupedElement}
                </Box>
            );
        }
    };

    const buildInput = (element: IFormMakerInput, i: number): JSX.Element => {
        if (element.type === 'checkbox' && !element.checkboxOptions) throw new AppError(ErrorTypeEnum.Technical, 'type checkbox must have checkbox options');
        else if (element.type === 'radio' && !element.radioOptions) throw new AppError(ErrorTypeEnum.Functional, 'type radio must have radio options');
        else if (element.type === 'switch' && !element.switchValue) throw new AppError(ErrorTypeEnum.Functional, 'type switch must have a target value');
        else if (element.type === 'select' && !element.selectOptions) throw new AppError(ErrorTypeEnum.Functional, 'type select must have select options');
        else if (element.type === 'groupedSelect' && !element.groupedSelectOptions) throw new AppError(ErrorTypeEnum.Functional, 'type grouped select must have grouped select options');
        else if (element.type === 'multipleAutocomplete' && !element.selectOptions) throw new AppError(ErrorTypeEnum.Functional, 'type tokenmultiple must have select options');
        else if (element.type === 'htmlContent' && !element.htmlContent) throw new AppError(ErrorTypeEnum.Functional, 'type htmlContent must have htmlContent');
        let elementType = element.type;
        const baseProps: InputBaseType = {
            size: element.size,
            icon: element.icon,
            id: element.id,
            helpText: element.helpText,
            label: element.label,
            required: element.required,
            disabled: element.disabled,
            value: formValues[element.id] ?? '',
            errorMessage: element.type !== "checkbox" ? focusOnError.find((f) => f.field.toLowerCase() === element.id.toLowerCase())?.message ?? element.errorMessage : null,
            error: element.type !== "checkbox" ? focusOnError.some((f) => f.field.toLowerCase() === element.id.toLowerCase()) || element.error : false,
            isLoading: element.isLoading,
            success: element.success,
            warning: element.warning,
            onChange: (inputValue, args) => {
                let nextValue = inputValue as FormMakerValue;

                if (typeof inputValue === 'object' && inputValue !== null && 'target' in inputValue) {
                    nextValue = (inputValue.target as HTMLInputElement | HTMLTextAreaElement)?.value ?? '';
                }

                setValue(element.id, nextValue);

                if (element.onChange) {
                    element.onChange(inputValue, args);
                }
            },
            sx: element.sx,
            autoComplete: element.autoComplete,
            autoCapitalize: element.autoCapitalize,
            placeholder: element.placeholder,
            readOnly: element.readOnly,
            isSearchForm,
            resetSignal: element.resetSignal,
        };
        if (isView) {
            let founded = null;
            switch (elementType) {
                case 'autocomplete':
                case 'select':
                    if (baseProps.value) {
                        if (element.ssr) break;
                        founded = element.selectOptions.find((e) => e.value === baseProps.value);
                        if (founded) {
                            baseProps.value = founded.label;
                        }
                    }
                    break;
                case 'radio':
                    founded = null;
                    if (baseProps.value) {
                        founded = element.radioOptions.find((e) => e.value === baseProps.value);
                        if (founded) {
                            baseProps.value = founded.label;
                        }
                    }
                    break;
                case 'checkbox':
                    founded = null;
                    if (baseProps.value) {
                        founded = element.checkboxOptions.find((e) => e.value === baseProps.value);
                        if (founded) {
                            baseProps.value = founded.label;
                        }
                    }
                    break;
                case 'date': {
                    const date = dayjs(baseProps.value as string | Date).format('DD/MM/YYYY');
                    baseProps.value = date as unknown;
                    break;
                }
                case 'datetime': {
                    const datetime = dayjs(baseProps.value as string | Date).format('DD/MM/YYYY HH:mm:ss');
                    baseProps.value = datetime as unknown;
                    break;
                }
                default:
                    break;
            }
            if (elementType !== 'htmlContent' && elementType !== 'hidden' && elementType !== 'JSON' && elementType !== 'htmlParser') {
                elementType = 'value';
            }
        }
        switch (elementType) {
            case 'email':
            case 'number':
            case 'search':
            case 'url':
            case 'text':
            case 'value': {
                return <InputTextField {...baseProps} key={i} type={elementType} />;
            }
            case "password": {
                return <InputTextField {...baseProps} key={i} showPasswordMeasure={element.showPasswordMeasure} passwordMeasureMsg={element.passwordMeasureMsg} type="password" />;
            }
            case 'hidden': {
                return <input key={i} name={baseProps.id} id={baseProps.id} value={(baseProps.value as string) ?? ''} type="hidden" />;
            }
            case 'htmlParser': {
                return <InputValue {...baseProps} key={i} parseHTML />;
            }
            case 'JSON': {
                return <JSONView {...baseProps} />;
            }
            case 'checkbox': {
                return <InputCheckBoxField {...baseProps} key={i} options={element.checkboxOptions} spacing={element.spacing} checkboxError={focusOnError.some((f) => f.field.toLowerCase() === element.id.toLowerCase()) ? focusOnError.find((f) => f.field.toLowerCase() === element.id.toLowerCase()) : null} />;
            }
            case 'select': {
                return <InputSelectField {...baseProps} key={i} options={element.selectOptions} />;
            }
            case 'groupedSelect': {
                return <InputGroupedSelectField {...baseProps} key={i} groups={element.groupedSelectOptions} />;
            }
            case 'tel': {
                return <InputTelephoneField {...baseProps} key={i} />;
            }
            case 'autocomplete': {
                return <InputAutoComplete {...baseProps} key={i} options={element.selectOptions} ssr={element.ssr} ssrUrlExtension={element.ssrUrlExtension} />;
            }
            case 'multipleAutocomplete': {
                return <InputAutoCompleteMultiple {...baseProps} key={i} options={element.selectOptions} ssr={element.ssr} ssrUrlExtension={element.ssrUrlExtension} />;
            }
            case 'radio': {
                return <InputRadioField {...baseProps} key={i} options={element.radioOptions} />;
            }
            case 'textarea': {
                return <InputTextAreaField {...baseProps} key={i} limit={element.limit} rows={element.rows} />;
            }
            case 'richText': {
                return <InputRichTextField {...baseProps} key={i} maxLength={element.limit} />;
            }
            case 'date':
            case 'datetime': {
                return <InputDateField {...baseProps} key={i} mode={elementType} format={element.dateFormat} views={element.dateViews} openTo={element.dateOpenTo} />;
            }
            case 'dateSearch': {
                return <RangeDateField {...baseProps} key={i} format={element.dateFormat} views={element.dateViews} openTo={element.dateOpenTo} />;
            }
            case 'color': {
                return <InputColorField {...baseProps} key={i} />;
            }
            case 'switch': {
                return <InputSwitchField {...baseProps} key={i} switchValue={element.switchValue} />;
            }
            case 'range': {
                return <RangeInput {...baseProps} key={i} />;
            }
            case 'center': {
                const props = { entity: element.id, parentId: centerParentId!, isSubCenter: true, action: GenericActionEnum.TABLE, parentField: element.parentField };
                return (
                    <CenterProvider isSub forcedTableName={element.id}>
                        <SearchProvider>
                            <AppCenter {...props} key={i} />
                        </SearchProvider>
                    </CenterProvider>
                );
            }
            case 'htmlContent': {
                return <element.htmlContent data={data} />;
            }
            case 'cron': {
                return <InputCronField {...baseProps} key={i} />;
            }
            case 'file': {
                return (
                    <InputFileField
                        {...baseProps}
                        onChange={(e) => {
                            setValue(element.id, e);
                            setFile(e as File);
                            setFileFields(baseProps.id);
                            if (element.onChange) {
                                element.onChange(e);
                            }
                        }}
                        key={i}
                    />
                );
            }
            default: {
                return <InputTextField {...baseProps} key={i} />;
            }
        }
    };

    const getActionLabel = (str: string): string => {
        switch (str) {
            case GenericActionEnum.UPDATE:
                return translate('common.update') as string;
            case GenericActionEnum.DELETE:
                return translate('common.delete') as string;
            case GenericActionEnum.TABLE:
                return translate('common.search') as string;
            default:
                return translate('common.add') as string;
        }
    };
    // #endregion METHODS --> //////////////////////////////////

    // #region USEEFFECT --> ///////////////////////////////////
    useEffect(() => {
        setFormValues(extractInitialValues());
    }, [structure, data]);

    useEffect(() => {
        if (resetCount > 0) {
            resetValues();
        }
    }, [resetCount]);
    // #endregion USEEFFECT --> ////////////////////////////////

    // #region RENDER --> //////////////////////////////////////
    return (
        <FormMakerContext.Provider value={formMakerContextValue}>
            {isFormLoading ? (
                <AppFullPageLoader count={300} counting isLoading message={`${grammar} en cours de chargement...`} />
            ) : (
                <Box
                    encType="multipart/form-data"
                    ref={formRef ? formRef : null}
                    name={`Form${idExtension}`}
                    id={`Form${idExtension}`}
                    onSubmit={onSubmit ? (e): void => onSubmit(handleSubmit(e)) : null}
                    component="form"
                    className="position-relative"
                    sx={{ width: '100%', flexGrow: 1, marginTop: 2 }}
                >
                    <input type="hidden" id="action" name="action" value={action} />
                    {renderForm()}
                    {showBottom && (
                        <Container component="div" className="d-flex align-items-center justify-content-center w-100">
                            <InputSubmit
                                showSubmit={action === GenericActionEnum.DELETE ? true : !isView}
                                isLoading={isSubmitLoading}
                                label={submitLabel ? submitLabel : `${getActionLabel(action)} ${grammar}`}
                                showBackPress={showBackPress}
                                onBackPress={onBackPress}
                                fullWidth={submitFullWidth}
                            />
                        </Container>
                    )}
                </Box>
            )}
        </FormMakerContext.Provider>
    );
    // #endregion RENDER --> ///////////////////////////////////
}

// #region IPROPS -->  /////////////////////////////////////
export interface IFormMaker<T> {
    onSubmit?: (f: FormData | T) => void;
    onBackPress?: () => void;
    structure: FormMakerType<FormMakerPartEnum>;
    data?: T;
    outputType?: 'formData' | 'JSON';
    idExtension?: string;
    isFormLoading?: boolean;
    isSubmitLoading?: boolean;
    submitFullWidth?: boolean;
    focusOnError?: FormMakerFocusErrorType[];
    action?: GenericActionEnum;
    grammar?: string;
    isView?: boolean;
    submitLabel?: string;
    resetCount?: number;
    showBackPress?: boolean;
    showBottom?: boolean;
    formRef?: RefObject<HTMLFormElement>;
    isSearchForm?: boolean;
    recordId?: string;
}
// #endregion IPROPS --> //////////////////////////////////
