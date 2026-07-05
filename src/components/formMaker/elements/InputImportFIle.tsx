// #region IMPORTS -> /////////////////////////////////////
import { lazy, useEffect, useState, JSX } from 'react';
import { Regular } from '~/components/common/Text';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
const AppIcon = lazy(() => import('~/components/common/AppIcon'));
// #endregion IMPORTS -> //////////////////////////////////

// #region SINGLETON --> ////////////////////////////////////
// #endregion SINGLETON --> /////////////////////////////////

export default function InputImportFile({ typeFile, filesLimit = 1, className = '', dropzoneText, onChange, shouldReset = false }: IInputImportFile): JSX.Element {
    // #region STATE --> ///////////////////////////////////////
    const [value, setValue] = useState<File[]>(null);
    const [isWrongTypeFile, setIsWrongTypeFile] = useState<boolean>(false);
    const [isDrag, setIsDrag] = useState<boolean>(false);
    // #endregion STATE --> ////////////////////////////////////

    // #region HOOKS --> ///////////////////////////////////////
    // #endregion HOOKS --> ////////////////////////////////////

    // #region METHODS --> /////////////////////////////////////
    const deleteFiles = (targetFile: number): void => {
        const newValue = [...value].filter((_, i2) => i2 !== targetFile);
        if (newValue.length > 0) {
            setValue(newValue);
            onChange(value);
        } else {
            setValue(null);
            onChange(null);
        }
    };

    const verifyFile = (files: File[]): void => {
        let isOk = true;
        if (files.length === 0) {
            isOk = false;
        }
        files.forEach((f) => {
            if (!typeFile.includes(f.type as FileExtension)) {
                isOk = false;
            }
        });
        if (isOk) {
            onChange(files);
            setValue(files);
            setIsWrongTypeFile(false);
        } else {
            setIsWrongTypeFile(true);
        }
    };
    // #endregion METHODS --> //////////////////////////////////

    // #region USEEFFECT --> ///////////////////////////////////
    useEffect(() => {
        if (shouldReset) {
            setValue(null);
        }
    }, [shouldReset]);
    // #endregion USEEFFECT --> ////////////////////////////////

    // #region RENDER --> //////////////////////////////////////
    return (
        <>
            {value && value.length > 0 ? (
                [...value].map((file, i) => {
                    return (
                        <Paper key={i} sx={{ padding: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 1 }}>
                            <Box display="flex" alignItems={'center'}>
                                <AppIcon sx={{ mr: 1 }} name={value[0].type.includes('image') ? 'Image' : 'InsertDriveFileOutlined'} />
                                <Regular mt={0.3}>{file.name}</Regular>
                            </Box>
                            <IconButton onClick={() => deleteFiles(i)}>
                                <AppIcon name="Close" />
                            </IconButton>
                        </Paper>
                    );
                })
            ) : (
                <>
                    <Box
                        component="div"
                        onDragOver={() => setIsDrag(true)}
                        draggable
                        onDragLeave={() => setIsDrag(false)}
                        onDrop={() => setIsDrag(false)}
                        className={`rounded w-100 drag-base ${isDrag ? 'drag-on' : 'drag-off'} ${className}`}
                    >
                        <Box
                            sx={{ borderStyle: 'dashed' }}
                            className="position-relative border border-2 rounded border-secondary w-100 h-100 d-flex flex-column justify-content-center align-items-center"
                        >
                            <Box className="d-flex flex-column justify-content-evenly align-items-center h-75">
                                <AppIcon name={isWrongTypeFile ? 'Error' : 'CloudUploadOutlined'} sx={{ fontSize: '4rem' }} color={isWrongTypeFile ? 'error' : 'secondary'} />
                                <Regular component="span" id="fileMonitor">
                                    {isWrongTypeFile ? (
                                        <>
                                            Format du fichier <b>invalide</b> ...
                                        </>
                                    ) : (
                                        <>
                                            {dropzoneText ?? (
                                                <>
                                                    Cliquez ou Glissez / déposez votre fichier <b>ici</b>
                                                </>
                                            )}
                                        </>
                                    )}
                                </Regular>
                            </Box>
                            <input
                                type="file"
                                onChange={(e) => verifyFile([...e.target.files])}
                                multiple={filesLimit > 1}
                                className="opacity-0 position-absolute w-100 h-100 border"
                                name="file"
                                id="file"
                            />
                        </Box>
                    </Box>
                </>
            )}
        </>
    );
    // #endregion RENDER --> ///////////////////////////////////
}

// #region IPROPS -->  /////////////////////////////////////
interface IInputImportFile {
    typeFile: AllowedFilesInput;
    filesLimit?: number;
    className?: string;
    dropzoneText?: string;
    onChange: (e: File[]) => void;
    shouldReset?: boolean;
}

export type AllowedFilesInput = FileExtension[];
export type FileExtension =
    | 'text/csv'
    | 'text/pdf'
    | 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    | 'application/xml'
    | 'application/vnd.ms-excel'
    | 'image/jpeg'
    | 'image/webp'
    | 'image/png';
// #endregion IPROPS --> //////////////////////////////////
