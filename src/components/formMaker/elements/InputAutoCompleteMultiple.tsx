// #region IMPORTS -> /////////////////////////////////////
import { ChangeEvent, FocusEvent, SyntheticEvent, useEffect, useRef, useState } from 'react';
import { InputBaseType, SelectOptionsType } from '~/types/FormMakerCoreTypes';
import { Bold } from '~/components/common/Text';
import stylesResources from '~/resources/stylesResources';
import parse from 'autosuggest-highlight/parse';
import match from 'autosuggest-highlight/match';
import useDataTextService from '~/hooks/services/useDataTextService';
import { JSX } from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import Chip from '@mui/material/Chip';
import TextField from '@mui/material/TextField';
import { useTheme } from '@mui/material/styles';
// #endregion IMPORTS -> //////////////////////////////////

// #region SINGLETON --> ////////////////////////////////////
// #endregion SINGLETON --> /////////////////////////////////

export default function InputAutoCompleteMultiple({
    sx,
    style,
    disabled,
    required,
    onChange,
    onSelectAutocompleteInput,
    error,
    id,
    value,
    success,
    warning,
    ssrUrlExtension,
    isSearchForm,
    ssr = false,
    options = [],
}: IInputAutoCompleteMultiple): JSX.Element {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [choices, setChoices] = useState<SelectOptionsType[]>(options);
    const [values, setValues] = useState<SelectOptionsType[]>([]);
    // eslint-disable-next-line no-undef
    const searchTimeout = useRef<NodeJS.Timeout | null>(null);
    const theme = useTheme();

    const DataText = useDataTextService();

    const fetchData = async (q?: string, code?: string): Promise<void> => {
        try {
            if ((code ?? '') !== '') {
                const toSearch = code
                    .split(',')
                    .map((c) => c.split('¤')[0])
                    .join(',');
                const res = await DataText.searchByCode(toSearch, ssrUrlExtension);
                setChoices(res.records.map((r) => ({ label: r.description, value: r.code })));
            } else {
                const res = await DataText.search(q, ssrUrlExtension);
                setChoices(res.records.map((r) => ({ label: r.description, value: r.code })));
            }
        } finally {
            setIsLoading(false);
        }
    };
    const onTextFieldChange = async (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): Promise<void> => {
        const inputValue = e.target.value;

        if (ssr) {
            setIsLoading(true);
            if (searchTimeout.current) {
                clearTimeout(searchTimeout.current);
            }

            if (inputValue && inputValue.length >= 4) {
                searchTimeout.current = setTimeout(() => {
                    fetchData(inputValue);
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
                setValues([]);
                setChoices([]);
            }
        }
    };

    const onSelect = (e: SyntheticEvent<Element, Event>, v: SelectOptionsType[] | null): void => {
        if (onSelectAutocompleteInput) onSelectAutocompleteInput(e, v);
        setValues(v ?? []);
        if (!v && ssr) {
            setChoices([]);
        }

        if (onChange) {
            onChange((v ?? []).map((item) => (isSearchForm ? `${item.value}¤${item.label}` : item.value)).join(','));
        }
    };

    useEffect(() => {
        if (!value || value === '') {
            setValues([]);
            return;
        }

        if (ssr) {
            fetchData('', value as string);
        } else {
            const vs = decodeURIComponent((value as string) ?? '')
                .split(',')
                .map((v) => v.split('¤')[0]);
            const founded = vs
                .map((v) => {
                    const f = options.find((o) => o.value.toString() === v);
                    if (f) return f;
                })
                .filter((x) => x !== undefined);
            setValues(founded);
        }
    }, [value]);

    return (
        <>
            <Autocomplete
                multiple
                freeSolo
                disabled={disabled}
                options={choices}
                value={values}
                isOptionEqualToValue={(option, value) => option.value === value.value}
                onChange={onSelect}
                getOptionLabel={(e: SelectOptionsType) => e.label ?? ''}
                filterSelectedOptions
                noOptionsText="Introuvable"
                loading={isLoading}
                className={error ? 'autocomplete-error' : success ? 'autocomplete-success' : warning ? 'autocomplete-warning' : undefined}
                fullWidth
                slotProps={{
                    clearIndicator: {
                        sx: {
                            backgroundColor: 'transparent',
                            border: 'none',
                            color: (theme.vars || theme).palette.grey[400],
                            '&:hover': {
                                backgroundColor: 'transparent',
                                color: (theme.vars || theme).palette.grey[30],
                            },
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
                renderInput={(params) => (
                    <TextField
                        margin="dense"
                        disabled={disabled}
                        variant="outlined"
                        required={required}
                        onChange={ssr ? onTextFieldChange : null}
                        id={id + 'Field'}
                        onBlur={ssr ? onBlur : null}
                        {...params}
                        InputProps={{
                            ...params.InputProps,
                            className: 'autocomplete-textfield-override',
                            style: style,
                            sx,
                        }}
                    />
                )}
                renderValue={(values, getItemProps) =>
                    values.map((option, index) => {
                        const { key, ...itemProps } = getItemProps({ index });
                        return <Chip key={key} variant="outlined" size="small" label={(option as SelectOptionsType).label} {...itemProps} className="m-0 me-2" />;
                    })
                }
            />
            <input type="hidden" id={id as string} name={id as string} value={values.map((v) => (isSearchForm ? `${v.value}¤${v.label}` : v.value)).join(',')} readOnly />
        </>
    );
    // #endregion RENDER --> ///////////////////////////////////
}

// #region IPROPS -->  /////////////////////////////////////
interface IInputAutoCompleteMultiple extends InputBaseType {
    options: SelectOptionsType[];
    ssr?: boolean;
    ssrUrlExtension?: string;
    onReset?: () => void;
    onSelectAutocompleteInput?: (e: SyntheticEvent<Element, Event>, v: SelectOptionsType[] | null) => void;
}
// #endregion IPROPS --> //////////////////////////////////
