/**
 *          => ScorePage => Bar group => Bar => Bar Content
 *                      => Page Text
 * Score
 *          => Score info
 */

import { MusicSymbol } from "~/types/musicSymbol";

/**
 * @description Conteneur de la Grille (Page)
 */
export interface Score {
    id: number;
    userId: number;
    isLib: boolean;
    isFavorite: boolean;
    title: string;
    composer: string;
    version?: string;
    key: string;
    keyType: string;
    tempo: number;
    nume: string;
    denom: string;
    comment?: string;
    fontSize?: number;
    orientation: ScoreOrientation;
    content: ScorePage[];
    addedAt: string;
    updatedAt?: string;
}
export type ScorePayload = {
    userId: number;
    title: string;
    composer: string;
    isFavorite: boolean;
    timeSig: string;
    key: string;
    keyType: string;
    tempo: number;
    comment?: string;
    fontSize?: number;
    orientation: ScoreOrientation;
    version?: string;
};
/**
 * @description Information sur le document
 */
export type ScoreInfo = {
    title: string;
    composer: string;
    denom: number;
    nume: number;
    tempo: number;
    key: string;
    comment?: string;
    orientation: ScoreOrientation;
};

export enum ScoreOrientation {
    PORTRAIT = 0,
    LANDSCAPE = 1,
}

/**
 * @description Page du document
 */
export type ScorePage = {
    index: number;
    content: ScoreBarGroup[];
    texts: ScorePageText[];
};

/**
 * @description Groupe de mesure
 */
export type ScoreBarGroup = {
    id: string;
    index: number;
    title: string;
    maxLength: number;
    position: {
        x: number;
        y: number;
    };
    content: ScoreBar[];
};

/**
 * @description Mesure de la grille
 */
export type ScoreBar = {
    id: string;
    type: BarTypeEnum;
    index: number;
    timeBar?: {
        nume: number;
        denom: number;
    };
    tempo?: number;
    key?: string;
    mesureNumber?: number;
    isRepeatStart?: boolean;
    isRepeatEnd?: boolean;
    content: ScoreBarContent[];
    isTheEnd?: boolean;
};

export type ScoreBarPayload = {
    type: BarTypeEnum;
    timeBar?: {
        nume: number;
        denom: number;
    };
    tempo?: number;
    key?: string;
    repeat?: 'start' | 'end' | null;
};

/**
 * @description Division de la mesure
 */
export type ScoreBarContent = {
    chordName: string;
    id: string;
    index: number;
    symbols?: keyof typeof MusicSymbol;
};

/**
 * @description Texte présent sur les page de la grille
 */
export type ScorePageText = {
    content: string;
    index: number;
    parentPage: number;
    position: {
        x: number;
        y: number;
    };
    size: {
        width: number;
        height: number;
    };
};

export type BarsPayload = {
    title: string;
    nb: string;
    perLines: string;
};

export enum BarTypeEnum {
    B1T_1T_1T_1T = '1t-1t-1t-1t',
    B1T_1T_1T = '1t-1t-1t',
    B1T_1T_2T = '1t-1t-2t',
    B1T_2T_1T = '1t-2t-1t',
    B1T_3T = '1t-3t',
    B2T_1T_1T = '2t-1t-1t',
    B2T_2T = '2t-2t',
    B3T_1T = '3t-1t',
    B4T = '4t',
}
