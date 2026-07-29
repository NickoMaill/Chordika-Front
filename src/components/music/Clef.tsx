import { CSSProperties, JSX } from 'react';
import { MusicSymbolName } from '~/types/musicSymbol';
import MusicGlyph, { MusicFontSize } from './MusicGlyph';

export type ClefType = 'g' | 'f' | 'c';

export type ClefProps = {
    type: ClefType;
    fontSize?: MusicFontSize;
    className?: string;
    style?: CSSProperties;
};

const clefSymbols: Record<ClefType, MusicSymbolName> = {
    g: 'gClef',
    f: 'fClef',
    c: 'cClef',
};

export default function Clef({ type, fontSize = '4rem', className, style }: ClefProps): JSX.Element {
    return (
        <span className={className} role="img" aria-label={`Clé de ${type}`} style={style}>
            <MusicGlyph symbol={clefSymbols[type]} fontSize={fontSize} />
        </span>
    );
}
