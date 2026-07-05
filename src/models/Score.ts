/**
 *          => ScorePage => Bar group => Bar => Bar Content
 *                      => Page Text
 * Score
 *          => Score info
 */

/**
 * @description Conteneur de la Grille (Page)
 */
export interface Score {
    id: number;
    userId: number;
    isLib: boolean;
    title: string;
    composer: string;
    key: string;
    tempo: number;
    nume: string;
    denom: string;
    comment?: string;
    fontStyle?: string;
    orientation: ScoreOrientation;
    content: ScorePage[];
    addedAt: string;
    updatedAt?: string;
}
export type ScorePayload = {
    userId: number;
    title: string;
    composer: string;
    nume: number;
    denom: number;
    key: string;
    tempo: number;
    comment?: string;
    fontStyle?: string;
    orientation: ScoreOrientation;
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
    title: string;
    index: number;
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
    type: string;
    index: number;
    timeBar?: {
        nume: number;
        denom: number;
    };
    tempo?: number;
    key?: string;
    mesureNumber?: number;
    isRepeat?: boolean;
    content: ScoreBarContent[];
    isTheEnd?: boolean;
};

/**
 * @description Division de la mesure
 */
export type ScoreBarContent = {
    chordName: string;
    chordID: string;
    index: number;
    symbols?: string;
};

/**
 * @description Texte présent sur les page de la grille
 */
export type ScorePageText = {
    content: string;
    parentPage: number;
    position: {
        x: number;
        y: number;
    };
};

export type BarsPayload = {
    title: string;
    nb: number;
    perLines: number;
};
