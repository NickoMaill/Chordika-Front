import { InputBaseType, SelectOptionsType } from '~/types/FormMakerCoreTypes';
import { ChangeEvent, FocusEvent, lazy, SyntheticEvent, useEffect, useRef, useState } from 'react';
import useDataTextService from '~/hooks/services/useDataTextService';
import parse from 'autosuggest-highlight/parse';
import match from 'autosuggest-highlight/match';
import { Bold } from '~/components/common/Text';
import stylesResources from '~/resources/stylesResources';
import { JSX } from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import { useTheme } from '@mui/material/styles';
const AppIcon = lazy(() => import('~/components/common/AppIcon'));
// #endregion IMPORTS -> //////////////////////////////////

export default function InputAutoComplete({ sx, style, disabled, required, onSelectAutocompleteInput, error, id, icon, value, ssrUrlExtension, isSearchForm, ssr = false, options = [] }: IInputAutoComplete): JSX.Element {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [choices, setChoices] = useState<SelectOptionsType[]>(options);
    const [selected, setSelected] = useState<SelectOptionsType>(null);
    const [isError, setIsError] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string>(null);
    // eslint-disable-next-line no-undef
    const searchTimeout = useRef<NodeJS.Timeout | null>(null);

    const DataText = useDataTextService();
    const theme = useTheme();

    const fetchData = async (q?: string, code?: string): Promise<void> => {
        setIsError(false);
        setErrorMessage(null);
        try {
            if ((code ?? '') !== '') {
                const res = await DataText.searchByCode(code.split('¤')[0], ssrUrlExtension);
                const options = res.records.map((r) => ({ label: r.description, value: r.code }));
                if (options.length > 0) setSelected(options[0]);
                setChoices(options);
            } else {
                const res = await DataText.search(q, ssrUrlExtension);
                setChoices(res.records.map((r) => ({ label: r.description, value: r.code })));
            }
        } catch (err) {
            console.log(err);
            if (err.code === 'not_found') {
                setChoices([]);
                setIsError(true);
                setErrorMessage('Resources non trouvées...');
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
                setChoices([]);
            }
        }
    };

    const onSelect = (e: SyntheticEvent<Element, Event>, v: SelectOptionsType | null): void => {
        if (onSelectAutocompleteInput) onSelectAutocompleteInput(e, v);
        if (v) {
            setSelected(v);
        } else {
            setSelected(null);
            if (ssr) {
                setChoices([]);
            }
        }
    };

    useEffect(() => {
        if (value !== '' && ssr) {
            fetchData('', value as string);
        }
    }, [value]);

    return (
        <>
            <Autocomplete
                freeSolo
                disabled={disabled}
                options={choices}
                value={selected}
                isOptionEqualToValue={(option, value) => option.value === value.value}
                onChange={onSelect}
                getOptionLabel={(e: SelectOptionsType) => e.label ?? ''}
                noOptionsText="Introuvable"
                loading={isLoading}
                fullWidth
                slotProps={{
                    clearIndicator: {
                        sx: {
                            // backgroundColor: 'transparent',
                            border: 'none',
                            color: (theme.vars || theme).palette.grey[400],
                            '&:hover': {
                                // backgroundColor: 'transparent',
                                color: (theme.vars || theme).palette.grey[800],
                            },
                            ...theme.applyStyles('dark', {
                                '&:hover': {
                                    // backgroundColor: 'transparent',
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
                renderInput={(params) => (
                    <TextField
                        margin="dense"
                        disabled={disabled}
                        variant="outlined"
                        required={required}
                        helperText={errorMessage}
                        error={isError || error}
                        onChange={onTextFieldChange}
                        onBlur={onBlur}
                        sx={{ marginTop: '4px', marginBottom: '4px', backgroundColor: disabled ? '#e8e5e5' : 'transparent', borderRadius: 1, ...sx }}
                        {...params}
                        slotProps={{
                            input: {
                                ...params.InputProps,
                                className: 'autocomplete-textfield-override',
                                style: style,
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
                                sx: {
                                    backgroundColor: disabled ? '#e8e5e5' : 'transparent',
                                },
                            },
                        }}
                    />
                )}
            />
            <input type="hidden" id={id as string} name={id as string} value={selected ? (isSearchForm ? `${selected.value}¤${selected.label}` : (selected.value as string)) : ''} />
        </>
    );
}

// #region IPROPS -->  /////////////////////////////////////
interface IInputAutoComplete extends InputBaseType {
    options: SelectOptionsType[];
    ssr?: boolean;
    ssrUrlExtension?: string;
    onReset?: () => void;
    onSelectAutocompleteInput?: (e: SyntheticEvent<Element, Event>, v: SelectOptionsType | null) => void;
}
// #endregion IPROPS --> //////////////////////////////////
