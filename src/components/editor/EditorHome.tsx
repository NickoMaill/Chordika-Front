// #region IMPORTS -> /////////////////////////////////////
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import { JSX } from 'react';
import AppIcon from '../common/AppIcon';
// #endregion IMPORTS -> //////////////////////////////////

// #region SINGLETON --> ////////////////////////////////////
// #endregion SINGLETON --> /////////////////////////////////

export default function EditorHome({ onAddClick, onImportClick }: IEditorHome): JSX.Element {
    // #region STATE --> ///////////////////////////////////////
    // #endregion STATE --> ////////////////////////////////////

    // #region HOOKS --> ///////////////////////////////////////
    // #endregion HOOKS --> ////////////////////////////////////

    // #region METHODS --> /////////////////////////////////////
    // #endregion METHODS --> //////////////////////////////////

    // #region USEEFFECT --> ///////////////////////////////////
    // #endregion USEEFFECT --> ////////////////////////////////

    // #region RENDER --> //////////////////////////////////////
    return (
        <Container>
            <Stack className="m-auto" direction="row" spacing={8} useFlexGap sx={{ justifyContent: 'center', alignItems: 'center', maxWidth: '400px' }}>
                <Button onClick={onAddClick} startIcon={<AppIcon name="AddRounded" />} variant="contained">
                    Créer une grille
                </Button>
                <Button onClick={onImportClick} startIcon={<AppIcon name="CloudUploadRounded" />} variant="contained">
                    Importer un grille
                </Button>
            </Stack>
        </Container>
    );
    // #endregion RENDER --> ///////////////////////////////////
}

// #region IPROPS -->  /////////////////////////////////////
interface IEditorHome {
    onAddClick: () => void;
    onImportClick: () => void;
}
// #enderegion IPROPS --> //////////////////////////////////
