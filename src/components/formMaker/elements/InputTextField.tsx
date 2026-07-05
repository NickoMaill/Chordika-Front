// #region IMPORTS -> /////////////////////////////////////
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import InputAdornment from '@mui/material/InputAdornment';
import { ChangeEvent, CSSProperties, useEffect, useState, JSX, lazy } from 'react';
import { AutoCapitalizeType, AutoCompleteType, InputBaseType, InputModeType, InputType } from '~/types/FormMakerCoreTypes';
import { Regular } from '~/components/common/Text';
import OutlinedInput from '@mui/material/OutlinedInput';
const AppIcon = lazy(() => import('~/components/common/AppIcon'));
// #endregion IMPORTS -> //////////////////////////////////

// #region SINGLETON --> ////////////////////////////////////
// #endregion SINGLETON --> /////////////////////////////////

export default function InputTextField({ style, inputStyle, disabled, required, onChange, error, id, type = 'text', icon, mode, autoComplete, autoCapitalize, value, isLoading, success, warning, placeholder, readOnly, min, max }: IInput): JSX.Element {
    // #region STATE --> ///////////////////////////////////////
    const [currentMode, setCurrentMode] = useState<typeof mode>(null);
    const [currentVal, setCurrentVal] = useState<unknown>(value);
    // #endregion STATE --> ////////////////////////////////////

    // #region HOOKS --> ///////////////////////////////////////
    // #endregion HOOKS --> ////////////////////////////////////

    // #region METHODS --> /////////////////////////////////////
    const buildMode = (): void => {
        switch (type) {
            case 'email':
                setCurrentMode('email');
                break;
            case 'text':
                setCurrentMode('text');
                break;
            case 'number':
                setCurrentMode('numeric');
                break;
            case 'search':
                setCurrentMode('search');
                break;
            case 'url':
                setCurrentMode('url');
                break;
            case 'tel':
                setCurrentMode('tel');
                break;
            default:
                setCurrentMode('none');
                break;
        }
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
        setCurrentVal(e.target.value);
        if (onChange) {
            onChange(e);
        }
    };

    const formatValue = (v: unknown): string => {
        if (!v) {
            return '';
        } else {
            return v as string;
        }
    };
    // #endregion METHODS --> //////////////////////////////////
    // #region USEEFFECT --> ///////////////////////////////////
    useEffect(() => {
        if (!mode) {
            buildMode();
        }
    }, []);

    useEffect(() => {
        if (value) {
            setCurrentVal(value);
        }
    }, [value]);
    // #endregion USEEFFECT --> ////////////////////////////////

    // #region RENDER --> //////////////////////////////////////
    return (
        <>
            {type === 'value' ? (
                <Box className="d-flex align-items-center">
                    {icon && <AppIcon color="disabled" sx={{ marginTop: 1, marginBottom: 2, marginRight: 1 }} name={icon} />}
                    <Regular sx={{ marginTop: 1, marginBottom: 2 }}>{formatValue(value)}</Regular>
                </Box>
            ) : (
                <OutlinedInput
                    disabled={disabled}
                    type={type}
                    inputMode={currentMode}
                    placeholder={placeholder}
                    value={currentVal ?? ''}
                    name={id}
                    id={id}
                    readOnly={readOnly}
                    className={`mt-1 ${success ? 'text-field-success' : warning ? 'text-field-warning' : ''}`}
                    required={required}
                    margin="dense"
                    fullWidth
                    onChange={handleChange}
                    error={error}
                    autoComplete={autoComplete}
                    autoCapitalize={autoCapitalize}
                    style={style}
                    startAdornment={
                        icon && (
                            <InputAdornment position="start">
                                <AppIcon name={icon} />
                            </InputAdornment>
                        )
                    }
                    endAdornment={
                        isLoading && (
                            <Box sx={{ display: 'flex' }}>
                                <CircularProgress size={25} />
                            </Box>
                        )
                    }
                    slotProps={{
                        input: {
                            style: inputStyle,
                            min,
                            max,
                        },
                    }}
                    // sx={{ backgroundColor: disabled ? '#e8e5e5' : 'transparent' }}
                />
            )}
        </>
    );
    // #endregion RENDER --> ///////////////////////////////////
}

// #region IPROPS -->  /////////////////////////////////////
interface IInput extends InputBaseType {
    type?: InputType;
    mode?: InputModeType;
    autoComplete?: AutoCompleteType;
    autoCapitalize?: AutoCapitalizeType;
    inputStyle?: CSSProperties;
    max?: number;
    min?: number;
}
// #endregion IPROPS --> ///////////////////////////////////
