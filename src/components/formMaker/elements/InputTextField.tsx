// #region IMPORTS -> /////////////////////////////////////
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import InputAdornment from '@mui/material/InputAdornment';
import { ChangeEvent, CSSProperties, useEffect, useState, JSX, lazy } from 'react';
import { AutoCapitalizeType, AutoCompleteType, InputBaseType, InputModeType, InputType, PasswordStrengthEnum } from '~/types/FormMakerCoreTypes';
import { Regular } from '~/components/common/Text';
import OutlinedInput from '@mui/material/OutlinedInput';
import { Grid, IconButton } from '@mui/material';
import { grey } from '@mui/material/colors';
import appTool from '~/helpers/appTool';
const AppIcon = lazy(() => import('~/components/common/AppIcon'));
// #endregion IMPORTS -> //////////////////////////////////

// #region SINGLETON --> ////////////////////////////////////
// #endregion SINGLETON --> /////////////////////////////////

export default function InputTextField({
    style,
    inputStyle,
    disabled,
    required,
    onChange,
    error,
    id,
    type = 'text',
    icon,
    mode,
    autoComplete,
    autoCapitalize,
    value,
    isLoading,
    success,
    warning,
    placeholder,
    readOnly,
    showPasswordMeasure = false,
    passwordMeasureMsg = null,
}: IInput): JSX.Element {
    // #region STATE --> ///////////////////////////////////////
    const [currentMode, setCurrentMode] = useState<typeof mode>(null);
    const [currentVal, setCurrentVal] = useState<unknown>(value);
    const [currentType, setCurrentType] = useState<typeof type>(type);
    const [passwordStrength, setPasswordStrength] = useState<PasswordStrengthEnum>(PasswordStrengthEnum.NOTSET);
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
        if (type === 'password') {
            const pwdTest = appTool.checkPasswordStrength(e.target.value);
            setPasswordStrength(pwdTest);
        }
    };

    const formatValue = (v: unknown): string => {
        if (!v) {
            return '';
        } else {
            return v as string;
        }
    };

    const handleShowHidePassword = (t: typeof type): void => {
        setCurrentType(t);
    };
    // #endregion METHODS --> //////////////////////////////////
    // #region USEEFFECT --> ///////////////////////////////////
    useEffect(() => {
        if (!mode) {
            buildMode();
        }
    }, []);

    useEffect(() => {
        setCurrentVal(value ?? '');
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
                <Box>
                    <OutlinedInput
                        disabled={disabled}
                        type={currentType}
                        inputMode={currentMode}
                        placeholder={placeholder}
                        value={currentVal ?? ''}
                        name={id}
                        id={id}
                        readOnly={readOnly || isLoading}
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
                            type === 'password' ? (
                                <IconButton size="medium" disableRipple onMouseDown={() => handleShowHidePassword('text')} onMouseUp={() => handleShowHidePassword('password')}>
                                    <AppIcon name="RemoveRedEyeRounded" />
                                </IconButton>
                            ) : isLoading ? (
                                <Box sx={{ display: 'flex' }}>
                                    <CircularProgress size={25} />
                                </Box>
                            ) : null
                        }
                        slotProps={{
                            input: {
                                style: inputStyle,
                            },
                        }}
                    />
                    {type === 'password' && showPasswordMeasure ? (
                        <Box>
                            <PasswordStrength id={id} strength={passwordStrength} />
                            {passwordMeasureMsg && <Regular variant="caption">{passwordMeasureMsg}</Regular>}
                            <input id={id + 'Strength'} name={id + 'Strength'} value={passwordStrength} type="hidden" />
                        </Box>
                    ) : null}
                </Box>
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
    showPasswordMeasure?: boolean;
    passwordMeasureMsg?: string;
}
// #endregion IPROPS --> ///////////////////////////////////

function PasswordStrength({ id, strength }: { id: string; strength: PasswordStrengthEnum }): JSX.Element {
    const getValues = (): string[] => {
        switch (strength) {
            case PasswordStrengthEnum.POOR:
                return ['var(--mui-palette-error-main)', grey[400], grey[400], grey[400]];
            case PasswordStrengthEnum.INSUFFISANT:
                return ['var(--mui-palette-warning-main)', 'var(--mui-palette-warning-main)', grey[400], grey[400]];
            case PasswordStrengthEnum.PASSABLE:
                return ['var(--mui-palette-success-main)', 'var(--mui-palette-success-main)', 'var(--mui-palette-success-main)', grey[400]];
            case PasswordStrengthEnum.OK:
                return ['var(--mui-palette-success-main)', 'var(--mui-palette-success-main)', 'var(--mui-palette-success-main)', 'var(--mui-palette-success-main)'];
            default:
                return [grey[400], grey[400], grey[400], grey[400]];
        }
    };
    return (
        <Grid container spacing={1} component={'div'} id={id + 'PasswordMonitor'} className="my-2">
            {getValues().map((c, i) => (
                <Grid size={3} sx={{ bgcolor: c, height: 5 }} component={'span'} key={i} className="rounded" />
            ))}
        </Grid>
    );
}
