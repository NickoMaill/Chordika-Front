import { styled } from '@mui/material/styles';
import { MaterialDesignContent } from 'notistack';
import stylesResources from '~/resources/stylesResources';

const StyledMaterialDesignContent = styled(MaterialDesignContent)(() => ({
    '&.notistack-MuiContent-success': {
        backgroundColor: stylesResources.theme.palette.success.main,
    },
    '&.notistack-MuiContent-error': {
        backgroundColor: stylesResources.theme.palette.error.main,
    },
    '&.notistack-MuiContent-warning': {
        backgroundColor: stylesResources.theme.palette.warning.contrastTextChannel,
        // color: stylesResources.theme.palette.text.secondary
    },
    '&.notistack-MuiContent-info': {
        backgroundColor: stylesResources.theme.palette.primary.main,
    },
}));

export default {
    default: StyledMaterialDesignContent,
    error: StyledMaterialDesignContent,
    success: StyledMaterialDesignContent,
    warning: StyledMaterialDesignContent,
    info: StyledMaterialDesignContent,
};
