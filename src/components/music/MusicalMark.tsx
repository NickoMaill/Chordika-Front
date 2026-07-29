import { CSSProperties, JSX } from 'react';
import { MusicSymbolName } from '~/types/musicSymbol';
import MusicGlyph, { MusicFontSize } from './MusicGlyph';

export type MusicalMarkType = 'coda' | 'codaSquare' | 'daCapo' | 'caesura' | 'repeatLeft' | 'repeatRight' | 'repeatBar';

export type MusicalMarkProps = {
    type: MusicalMarkType;
    fontSize?: MusicFontSize;
    className?: string;
    style?: CSSProperties;
};

const musicalMarkSymbols: Record<MusicalMarkType, MusicSymbolName> = {
    coda: 'coda',
    codaSquare: 'codaSquare',
    daCapo: 'daCapo',
    caesura: 'caesuraThick',
    repeatLeft: 'repeatLeft',
    repeatRight: 'repeatRight',
    repeatBar: 'repeat1Bar',
};

export default function MusicalMark({ type, fontSize = '2.5rem', className, style }: MusicalMarkProps): JSX.Element {
    return (
        <span className={className} role="img" aria-label={`Symbole musical ${type}`} style={style}>
            <MusicGlyph symbol={musicalMarkSymbols[type]} fontSize={fontSize} />
        </span>
    );
}
