// #region IMPORTS -> /////////////////////////////////////
import { Box, IconButton, Popover, Slider, Tooltip } from '@mui/material';
import { JSX, MouseEvent, useState } from 'react';
import AppIcon from '../common/AppIcon';
import { Bold } from '../common/Text';
import useEditorActions from '~/hooks/useEditorActions';
import useEditorContext from '~/context/EditorContext';
// #endregion IMPORTS -> //////////////////////////////////

// #region SINGLETON --> ////////////////////////////////////
// #endregion SINGLETON --> /////////////////////////////////

export default function EditorFontSizeMenu(): JSX.Element {
    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
    const { setFontSize } = useEditorActions();
    const { state } = useEditorContext();
    const handleClick = (event: MouseEvent<HTMLButtonElement>): void => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = (): void => {
        setAnchorEl(null);
    };
    const open = Boolean(anchorEl);
    return (
        <>
            <Tooltip title="Taille de la police">
                <IconButton aria-describedby="fontSizeSlider" id="fontSize" className="me-2" outline="true" onClick={handleClick}>
                    <AppIcon name="FormatSizeRounded" />
                </IconButton>
            </Tooltip>
            <Popover
                id="fontSizeSlider"
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
            >
                <Box className="p-3">
                    <Bold>Réglez la taille de la police</Bold>
                    <Slider defaultValue={state.data.fontSize} step={2} valueLabelDisplay="auto" marks min={10} max={45} onChange={(e) => setFontSize(Number((e.target as HTMLInputElement).value))} />
                </Box>
            </Popover>
        </>
    );
}

// #region IPROPS -->  /////////////////////////////////////
interface IEditorFontSizeMenu {}
// #enderegion IPROPS --> //////////////////////////////////
