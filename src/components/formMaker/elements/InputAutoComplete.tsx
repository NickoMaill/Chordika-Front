import { InputBaseType, SelectOptionsType } from '~/types/FormMakerCoreTypes';
import { FocusEvent, lazy, ReactNode, SyntheticEvent, useEffect, useRef, useState } from 'react';
import useDataTextService from '~/hooks/services/useDataTextService';
import parse from 'autosuggest-highlight/parse';
import match from 'autosuggest-highlight/match';
import { Bold } from '~/components/common/Text';
import stylesResources from '~/resources/stylesResources';
import { JSX } from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import Autocomplete, { AutocompleteRenderInputParams } from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import { useTheme } from '@mui/material/styles';
const AppIcon = lazy(() => import('~/components/common/AppIcon'));
// #endregion IMPORTS -> //////////////////////////////////

export default function InputAutoComplete({
    sx,
    style,
    disabled,
    required,
    onChange,
    onSelectAutocompleteInput,
    error,
    id,
    icon,
    value,
    ssrUrlExtension,
    isSearchForm,
    ssr = false,
    options = [],
    placeholder,
    resetSignal,
    includeTextField = false,
    freeSolo = true,
    limitChar = 2,
    filedComponent
}: IInputAutoComplete): JSX.Element {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [choices, setChoices] = useState<SelectOptionsType[]>(options);
    const [selected, setSelected] = useState<SelectOptionsType>(null);
    const [isError, setIsError] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string>(null);
    const [inputValue, setInputValue] = useState<string>('');
    // eslint-disable-next-line no-undef
    const searchTimeout = useRef<NodeJS.Timeout | null>(null);
    const previousResetSignal = useRef(resetSignal);
    const ignoreExternalValueUntilEmpty = useRef(false);

    const DataText = useDataTextService();
    const theme = useTheme();

    const reset = (): void => {
        setSelected(null);
        setInputValue('');
        setIsError(false);
        setErrorMessage(null);
        if (ssr) {
            setChoices([]);
        }
        if (searchTimeout.current) {
            clearTimeout(searchTimeout.current);
        }
        if (onChange) {
            onChange('');
        }
    };

    const fetchData = async (q?: string, code?: unknown): Promise<void> => {
        setIsError(false);
        setErrorMessage(null);
        try {
            if (String(code ?? '') !== '') {
                const res = await DataText.searchByCode(String(code).split('¤')[0], ssrUrlExtension);
                const options = res.records.map((r) => ({ label: r.description, value: r.code }));
                if (options.length > 0) {
                    setSelected(options[0]);
                    setInputValue(options[0].label);
                }
                setChoices(options);
            } else {
                const res = await DataText.search(q, ssrUrlExtension);
                setChoices(res.records.map((r) => ({ label: r.description, value: r.code })));
            }
        } catch (err) {
            if (err.code === 'not_found') {
                setChoices([]);
                setIsError(true);
                setErrorMessage('Resources non trouvées...');
            }
        } finally {
            setIsLoading(false);
        }
    };

    const onTextFieldChange = async (_: SyntheticEvent<Element, Event>, nextInputValue: string, reason: string): Promise<void> => {
        setInputValue(nextInputValue);
        if (reason === 'clear') {
            reset();
            return;
        }

        if (ssr) {
            setIsLoading(true);
            if (searchTimeout.current) {
                clearTimeout(searchTimeout.current);
            }
            if (nextInputValue && nextInputValue.length >= limitChar) {
                searchTimeout.current = setTimeout(() => {
                    fetchData(nextInputValue);
                }, 400);
            } else {
                setChoices([]);
                setIsLoading(false);
            }
        }
    };

    const onBlur = (e: FocusEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
        if (e.target.value === '') {
            if (ssr) {
                setChoices([]);
            }
        }
    };

    const onSelect = (e: SyntheticEvent<Element, Event>, v: SelectOptionsType | null): void => {
        if (onSelectAutocompleteInput) onSelectAutocompleteInput(e, v);
        if (v) {
            setSelected(v);
            setInputValue(v.label);
        } else {
            reset();
            return;
        }

        if (onChange) {
            const nextValue = v ? (isSearchForm ? `${v.value}¤${v.label}` : v.value) : '';
            onChange(nextValue as unknown as string);
        }
    };

    useEffect(() => {
        if (ignoreExternalValueUntilEmpty.current) {
            if (String(value ?? '') === '') {
                ignoreExternalValueUntilEmpty.current = false;
            } else {
                return;
            }
        }

        if (String(value ?? '') === '') {
            setSelected(null);
            setInputValue('');
            return;
        }

        if (ssr) {
            fetchData('', value as string);
        } else {
            const option = options.find((o) => String(o.value) === String(value));
            if (option) {
                setSelected(option);
                setInputValue(option.label);
            }
        }
    }, [value]);

    useEffect(() => {
        if (previousResetSignal.current !== resetSignal) {
            previousResetSignal.current = resetSignal;
            ignoreExternalValueUntilEmpty.current = true;
            reset();
        }
    }, [resetSignal]);

    return (
        <>
            <Autocomplete
                freeSolo={freeSolo}
                disabled={disabled}
                options={choices}
                value={selected}
                // inputValue={inputValue}
                isOptionEqualToValue={(option, value) => option.value === value.value}
                onChange={onSelect}
                onInputChange={onTextFieldChange}
                getOptionLabel={(e: SelectOptionsType) => e.label ?? ''}
                noOptionsText="Introuvable"
                loading={isLoading}
                id={id + 'Field'}
                fullWidth
                slotProps={{
                    clearIndicator: {
                        sx: {
                            backgroundColor: 'transparent',
                            border: 'none',
                            color: (theme.vars || theme).palette.grey[400],
                            '&:hover': {
                                backgroundColor: 'transparent',
                                color: (theme.vars || theme).palette.grey[800],
                            },
                            ...theme.applyStyles('dark', {
                                '&:hover': {
                                    backgroundColor: 'transparent',
                                    color: (theme.vars || theme).palette.grey[30],
                                },
                            }),
                        },
                    },
                }}
                renderOption={(props, option, { inputValue }) => {
                    const { key, ...optionProps } = props;
                    const matches = match(option.label, inputValue, { insideWords: true, findAllOccurrences: true });
                    const parts = parse(option.label, matches);
                    return (
                        <li key={option.value as string} {...optionProps}>
                            <div>
                                {parts.map((p, i) => (
                                    <Bold
                                        key={i}
                                        component={'span'}
                                        className={p.highlight ? 'rounded' : ''}
                                        sx={{
                                            backgroundColor: p.highlight ? stylesResources.theme.palette.primary.main : 'transparent',
                                            padding: p.highlight ? '2px' : '',
                                            color: p.highlight ? 'white' : 'dark',
                                        }}
                                    >
                                        {p.text}
                                    </Bold>
                                ))}
                            </div>
                        </li>
                    );
                }}
                renderInput={filedComponent ? filedComponent : (params): ReactNode => (
                    <TextField
                        margin="dense"
                        disabled={disabled}
                        variant="outlined"
                        required={required}
                        helperText={errorMessage}
                        placeholder={placeholder}
                        error={isError || error}
                        onBlur={onBlur}
                        sx={{ marginTop: '4px', marginBottom: '4px', borderRadius: 1, ...sx }}
                        {...params}
                        slotProps={{
                            input: {
                                ...params.InputProps,
                                className: 'autocomplete-textfield-override',
                                style: style,
                                name: includeTextField ? id + 'Field' : null,
                                startAdornment: icon && (
                                    <InputAdornment position="start">
                                        <AppIcon name={icon} />
                                    </InputAdornment>
                                ),
                                endAdornment: (
                                    <>
                                        {isLoading && <CircularProgress color="inherit" size={18} />}
                                        {params.InputProps.endAdornment}
                                    </>
                                ),
                            },
                        }}
                    />
                )}
            />
            <input
                type="hidden"
                required={required}
                id={id as string}
                name={id as string}
                value={selected ? (isSearchForm ? `${selected.value}¤${selected.label}` : (selected.value as string)) : ''}
            />
        </>
    );
}

// #region IPROPS -->  /////////////////////////////////////
interface IInputAutoComplete extends InputBaseType {
    options?: SelectOptionsType[];
    ssr?: boolean;
    ssrUrlExtension?: string;
    onSelectAutocompleteInput?: (e: SyntheticEvent<Element, Event>, v: SelectOptionsType | null) => void;
    includeTextField?: boolean;
    filedComponent?: (params: AutocompleteRenderInputParams) => ReactNode;
    freeSolo?: boolean;
    limitChar?: number;
}
// #endregion IPROPS --> //////////////////////////////////
