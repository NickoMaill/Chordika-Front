import useResources from '~/hooks/useResources';
import { JSX } from 'react';
import Button from '@mui/material/Button';
// #endregion IMPORTS -> //////////////////////////////////

// #region SINGLETON --> ////////////////////////////////////
// #endregion SINGLETON --> /////////////////////////////////

export default function InputSubmit({ label, onBackPress, isLoading, title, showBackPress = true, showSubmit = true, fullWidth = false }: IInputSubmit): JSX.Element {
    // #region STATE --> ///////////////////////////////////////
    // #endregion STATE --> ////////////////////////////////////

    // #region HOOKS --> ///////////////////////////////////////
    const { translate } = useResources();
    // #endregion HOOKS --> ////////////////////////////////////

    // #region METHODS --> /////////////////////////////////////
    // #endregion METHODS --> //////////////////////////////////

    // #region USEEFFECT --> ///////////////////////////////////
    // #endregion USEEFFECT --> ////////////////////////////////

    // #region RENDER --> //////////////////////////////////////
    return (
        <>
            {showSubmit ? (
                <>
                    <Button title={title} className={fullWidth ? "w-100" : null} loading={isLoading} variant="contained" type="submit">
                        {label}
                    </Button>
                    {showBackPress && (
                        <Button title={'Annuler la saisie'} sx={{ marginLeft: 2 }} onClick={onBackPress} variant="contained" color="secondary">
                            {translate('common.dismiss')}
                        </Button>
                    )}
                </>
            ) : (
                <></>
            )}
        </>
    );
    // #endregion RENDER --> ///////////////////////////////////
}

// #region IPROPS -->  /////////////////////////////////////
interface IInputSubmit {
    label: string;
    onBackPress?: () => void;
    isLoading?: boolean;
    title?: string;
    showBackPress?: boolean;
    showSubmit?: boolean;
    fullWidth?: boolean;
}
// #endregion IPROPS --> //////////////////////////////////
