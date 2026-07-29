import { CSSProperties, JSX } from 'react';
import { MusicSymbolName } from '~/types/musicSymbol';
import MusicGlyph, { MusicFontSize } from './MusicGlyph';

export type NoteDuration = 'whole' | 'half' | 'quarter' | 'eighth';

export type NoteProps = {
    duration: NoteDuration;
    dots?: number;
    fontSize?: MusicFontSize;
    className?: string;
    style?: CSSProperties;
};

const noteSymbols: Record<NoteDuration, MusicSymbolName> = {
    whole: 'metNoteWhole',
    half: 'noteHalfUp',
    quarter: 'noteQuarterUp',
    eighth: 'note8thUp',
};

export default function Note({ duration, dots = 0, fontSize = '2.5rem', className, style }: NoteProps): JSX.Element {
    const dotCount = Math.max(0, Math.floor(dots));

    return (
        <span
            className={className}
            role="img"
            aria-label={`Note ${duration}${dotCount > 0 ? ` avec ${dotCount} point${dotCount > 1 ? 's' : ''}` : ''}`}
            style={{
                display: 'inline-flex',
                alignItems: 'center',
                ...style,
                fontSize,
            }}
        >
            <MusicGlyph symbol={noteSymbols[duration]} fontSize="1em" />
            {Array.from({ length: dotCount }).map((_, index) => (
                <MusicGlyph
                    key={index}
                    symbol="augmentationDot"
                    fontSize="1em"
                    style={{
                        marginLeft: index === 0 ? '-0.08em' : '-0.35em',
                        transform: 'translateY(-0.1em)',
                    }}
                />
            ))}
        </span>
    );
}
