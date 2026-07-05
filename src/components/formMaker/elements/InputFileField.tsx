// #region IMPORTS -> /////////////////////////////////////
import { InputBaseType } from '~/types/FormMakerCoreTypes';
import { MuiFileInput } from 'mui-file-input';
import { useEffect, useState, JSX } from 'react';
// #endregion IMPORTS -> //////////////////////////////////

// #region SINGLETON --> ////////////////////////////////////
// #endregion SINGLETON --> /////////////////////////////////

export default function InputFileField({ disabled, id, onChange, value = '', error, sx, isLoading }: IInputFileField): JSX.Element {
    // #region STATE --> ///////////////////////////////////////
    const [file, setFile] = useState<File | undefined>(undefined);
    // #endregion STATE --> ////////////////////////////////////

    // #region HOOKS --> ///////////////////////////////////////
    // #endregion HOOKS --> ////////////////////////////////////

    // #region METHODS --> /////////////////////////////////////
    const handleChange = (e: File): void => {
        if (onChange) {
            onChange(e);
        }
        setFile(e);
    };
    // #endregion METHODS --> //////////////////////////////////

    // #region USEEFFECT --> ///////////////////////////////////
    // Handle initial value if it's a string (e.g., a filename or URL)
    useEffect(() => {
        if (typeof value === 'string' && value !== '') {
            const fileName = value.split('/').pop() || 'unknown';
            const placeholderFile = new File([''], fileName, { type: 'application/octet-stream' });
            setFile(placeholderFile);
        }
    }, [value]);
    // #endregion USEEFFECT --> ////////////////////////////////

    // #region RENDER --> //////////////////////////////////////
    return (
        <>
            <MuiFileInput error={error} sx={{ ...sx, backgroundColor: 'transparent' }} value={file ?? null} onChange={handleChange} disabled={disabled || isLoading} hideSizeText id={id} name={id} />
            <input hidden type="hidden" name={id + 'Old'} defaultValue={value as string} />
            <input hidden type="hidden" name={id + 'Path'} defaultValue={file?.name || (value as string)?.split('/').pop() || ''} />
        </>
    );
    // #endregion RENDER --> ///////////////////////////////////
}

// #region IPROPS -->  /////////////////////////////////////
interface IInputFileField extends InputBaseType {}
// #endregion IPROPS --> //////////////////////////////////
