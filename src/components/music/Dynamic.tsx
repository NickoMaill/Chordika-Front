import { CSSProperties, JSX } from 'react';
import { MusicSymbolName } from '~/types/musicSymbol';
import MusicGlyph, { MusicFontSize } from './MusicGlyph';

export type DynamicValue = 'p' | 'pp' | 'ppp' | 'pppp' | 'ppppp' | 'pppppp' | 'mp' | 'mf' | 'f' | 'ff' | 'fff' | 'ffff' | 'fffff' | 'ffffff' | 'fp' | 'pf' | 'fz' | 'messaDiVoce';

export type DynamicProps = {
    value: DynamicValue;
    fontSize?: MusicFontSize;
    className?: string;
    style?: CSSProperties;
};

const dynamicSymbols: Record<DynamicValue, MusicSymbolName> = {
    p: 'dynamicPiano',
    pp: 'dynamicPP',
    ppp: 'dynamicPPP',
    pppp: 'dynamicPPPP',
    ppppp: 'dynamicPPPPP',
    pppppp: 'dynamicPPPPPP',
    mp: 'dynamicMP',
    mf: 'dynamicMF',
    f: 'dynamicForte',
    ff: 'dynamicFF',
    fff: 'dynamicFFF',
    ffff: 'dynamicFFFF',
    fffff: 'dynamicFFFFF',
    ffffff: 'dynamicFFFFFF',
    fp: 'dynamicFortePiano',
    pf: 'dynamicPF',
    fz: 'dynamicForzando',
    messaDiVoce: 'dynamicMessaDiVoce',
};

export default function Dynamic({ value, fontSize = '2.5rem', className, style }: DynamicProps): JSX.Element {
    return (
        <span className={className} role="img" aria-label={`Nuance ${value}`} style={style}>
            <MusicGlyph symbol={dynamicSymbols[value]} fontSize={fontSize} />
        </span>
    );
}
