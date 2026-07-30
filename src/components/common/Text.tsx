import Typography, { TypographyProps } from '@mui/material/Typography';
import { RecursiveKeyOf } from '~/types/custom';
import { TranslationResourcesType } from '~/types/i18nTypes';
import useResources from '~/hooks/useResources';
import { JSX } from 'react';

export default function Text({ iText, iArgs, weight = 'Regular', ...props }: IText): JSX.Element {
    const { translate } = useResources();
    return (
        <Typography {...props} sx={{ fontWeight: weight }}>
            {translate(iText, iArgs)}
        </Typography>
    );
}

export function Regular(props: TypographyProps): JSX.Element {
    return <Typography {...props} />;
}

export function Bold(props: TypographyProps): JSX.Element {
    return <Typography {...props} sx={{ fontWeight: 'bold' }} />;
}

export function Bolder(props: TypographyProps): JSX.Element {
    return <Typography {...props} sx={{ fontWeight: 'bolder' }} />;
}

export function Thin(props: TypographyProps): JSX.Element {
    return <Typography {...props} sx={{ fontWeight: 'thin' }} />;
}

export function Italic(props: TypographyProps): JSX.Element {
    return <Typography {...props} sx={{ fontStyle: 'italic' }} />;
}

interface IText {
    iText: RecursiveKeyOf<TranslationResourcesType>;
    iArgs?: Record<string, string>;
    weight?: 'Regular' | 'Bold' | 'Bolder' | 'Thin' | 'italic';
}
