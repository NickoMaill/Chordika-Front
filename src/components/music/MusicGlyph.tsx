import { CSSProperties, ElementType, JSX } from 'react';
import { MusicSymbol, MusicSymbolName } from '~/types/musicSymbol';

export type MusicFontSize = CSSProperties['fontSize'];

export type MusicGlyphProps = {
    symbol: MusicSymbolName;
    fontSize?: MusicFontSize;
    className?: string;
    style?: CSSProperties;
    component?: ElementType;
};

export default function MusicGlyph({ symbol, fontSize = '1em', className, style, component: Component = 'span' }: MusicGlyphProps): JSX.Element {
    return (
        <Component
            className={className}
            aria-hidden="true"
            style={{
                display: 'inline-block',
                fontFamily: 'Bravura',
                lineHeight: 1,
                fontWeight: 'normal',
                fontStyle: 'normal',
                ...style,
                fontSize,
            }}
        >
            {MusicSymbol[symbol]}
        </Component>
    );
}
