// #region IMPORTS -> /////////////////////////////////////
import { InputBaseType } from '~/types/FormMakerCoreTypes';
import { MuiFileInput } from 'mui-file-input';
import { useEffect, useState, JSX, lazy } from 'react';
const AppIcon = lazy(() => import('~/components/common/AppIcon'));
// #endregion IMPORTS -> //////////////////////////////////

export default function InputFileField({ disabled, id, onChange, value = '', error, sx, isLoading, icon }: IInputFileField): JSX.Element {
    const [file, setFile] = useState<File | undefined>(undefined);

    const handleChange = (nextFile: File | null): void => {
        if (onChange) {
            onChange(nextFile);
        }
        setFile(nextFile ?? undefined);
    };

    useEffect(() => {
        if (value instanceof File) {
            setFile(value);
            return;
        }

        if (typeof value === 'string' && value !== '') {
            const fileName = value.split('/').pop() || 'unknown';
            const placeholderFile = new File([''], fileName, { type: 'application/octet-stream' });
            setFile(placeholderFile);
            return;
        }

        setFile(undefined);
    }, [value]);

    return (
        <>
            <MuiFileInput
                placeholder="Ajouter un fichier"
                slotProps={{
                    input: {
                        startAdornment: icon ? <AppIcon name={icon} /> : null,
                    },
                    htmlInput: {
                        accept: 'image/*,application/pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx',
                    },
                }}
                error={error}
                sx={{ ...sx }}
                value={file ?? null}
                onChange={handleChange}
                clearIconButtonProps={{
                    color: 'secondary',
                    title: 'Supprimer le fichier',
                    children: <AppIcon name="CloseRounded" color="primary" />,
                }}
                disabled={disabled || isLoading}
                id={id}
                name={id}
            />
            <input hidden type="hidden" name={id + 'Old'} value={typeof value === 'string' ? value : ''} readOnly />
            <input hidden type="hidden" name={id + 'Path'} value={file?.name || (typeof value === 'string' ? value.split('/').pop() || '' : '')} readOnly />
        </>
    );
}

interface IInputFileField extends InputBaseType {}
