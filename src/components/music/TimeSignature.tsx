import { CSSProperties, JSX, useMemo } from 'react';
import { MusicSymbol, MusicSymbolName } from '~/types/musicSymbol';
import { MusicFontSize } from './MusicGlyph';

export type TimeSignatureProps = {
    numerator: number | string;
    denominator: number | string;
    fontSize?: MusicFontSize;
    gap?: number | string;
    className?: string;
    style?: CSSProperties;
};

const numeratorSymbols: Record<string, MusicSymbolName> = {
    '0': 'timeSig0Numerator',
    '1': 'timeSig1Numerator',
    '2': 'timeSig2Numerator',
    '3': 'timeSig3Numerator',
    '4': 'timeSig4Numerator',
    '5': 'timeSig5Numerator',
    '6': 'timeSig6Numerator',
    '7': 'timeSig7Numerator',
    '8': 'timeSig8Numerator',
    '9': 'timeSig9Numerator',
};

const denominatorSymbols: Record<string, MusicSymbolName> = {
    '0': 'timeSig0Denominator',
    '1': 'timeSig1Denominator',
    '2': 'timeSig2Denominator',
    '3': 'timeSig3Denominator',
    '4': 'timeSig4Denominator',
    '5': 'timeSig5Denominator',
    '6': 'timeSig6Denominator',
    '7': 'timeSig7Denominator',
    '8': 'timeSig8Denominator',
    '9': 'timeSig9Denominator',
};

const createNumberGlyphs = (value: number | string, symbols: Record<string, MusicSymbolName>): string =>
    String(value)
        .split('')
        .map((character) => {
            const symbol = symbols[character];
            return symbol ? MusicSymbol[symbol] : character;
        })
        .join('');

export default function TimeSignature({ numerator, denominator, fontSize = '2.5rem', gap = '-0.15em', className, style }: TimeSignatureProps): JSX.Element {
    const numeratorValue = useMemo(() => createNumberGlyphs(numerator, numeratorSymbols), [numerator]);
    const denominatorValue = useMemo(() => createNumberGlyphs(denominator, denominatorSymbols), [denominator]);

    return (
        <span
            className={className}
            role="img"
            aria-label={`Mesure ${numerator} sur ${denominator}`}
            style={{
                display: 'inline-flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: 'Bravura',
                fontWeight: 'normal',
                fontStyle: 'normal',
                lineHeight: 0.75,
                ...style,
                fontSize,
            }}
        >
            <span>{numeratorValue}</span>
            <span style={{ marginTop: gap }}>{denominatorValue}</span>
        </span>
    );
}
