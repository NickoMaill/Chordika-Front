import { CSSProperties, JSX } from 'react';
import { MusicSymbolName } from '~/types/musicSymbol';
import MusicGlyph, { MusicFontSize } from './MusicGlyph';

export type FermataType = 'normal' | 'long' | 'longHenze';
export type FermataPlacement = 'above' | 'below';

export type FermataProps = {
    type?: FermataType;
    placement?: FermataPlacement;
    fontSize?: MusicFontSize;
    className?: string;
    style?: CSSProperties;
};

const fermataSymbols: Record<FermataType, Record<FermataPlacement, MusicSymbolName>> = {
    normal: {
        above: 'fermataAbove',
        below: 'fermataBelow',
    },
    long: {
        above: 'fermataLongAbove',
        below: 'fermataLongBelow',
    },
    longHenze: {
        above: 'fermataLongHenzeAbove',
        below: 'fermataLongHenzeBelow',
    },
};

export default function Fermata({ type = 'normal', placement = 'above', fontSize = '2.5rem', className, style }: FermataProps): JSX.Element {
    return (
        <span className={className} role="img" aria-label={`Point d'orgue ${type} ${placement}`} style={style}>
            <MusicGlyph symbol={fermataSymbols[type][placement]} fontSize={fontSize} />
        </span>
    );
}
