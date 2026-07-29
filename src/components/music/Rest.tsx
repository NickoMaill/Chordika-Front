import { CSSProperties, JSX } from 'react';
import MusicGlyph, { MusicFontSize } from './MusicGlyph';
import { MusicSymbolName } from '~/types/musicSymbol';

export type RestDuration = 'whole' | 'half' | 'quarter' | 'eighth';

export type RestProps = {
    duration: RestDuration;
    dots?: number;
    fontSize?: MusicFontSize;
    dotOffsetX?: number | string;
    dotOffsetY?: number | string;
    className?: string;
    style?: CSSProperties;
};

const restSymbols: Record<RestDuration, MusicSymbolName> = {
    whole: 'restWholeLegerLine',
    half: 'restHalfLegerLine',
    quarter: 'restQuarter',
    eighth: 'rest8th',
};

export default function Rest({ duration, dots = 0, fontSize = '2.5rem', dotOffsetX = '-0.08em', dotOffsetY = '-0.1em', className, style }: RestProps): JSX.Element {
    const dotCount = Math.max(0, Math.floor(dots));

    return (
        <span
            className={className}
            role="img"
            aria-label={`Silence ${duration}${dotCount > 0 ? ` avec ${dotCount} point${dotCount > 1 ? 's' : ''}` : ''}`}
            style={{
                display: 'inline-flex',
                alignItems: 'center',
                ...style,
                fontSize,
            }}
        >
            <MusicGlyph symbol={restSymbols[duration]} fontSize="1em" />
            {Array.from({ length: dotCount }).map((_, index) => (
                <MusicGlyph
                    key={index}
                    symbol="augmentationDot"
                    fontSize="1em"
                    style={{
                        marginLeft: index === 0 ? dotOffsetX : '-0.35em',
                        transform: `translateY(${dotOffsetY})`,
                    }}
                />
            ))}
        </span>
    );
}
