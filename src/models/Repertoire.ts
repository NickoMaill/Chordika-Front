import { Score } from "./Score";

export type Repertoire = {
    id: number;
    userId: number;
    userName: string;
    title: string;
    addedAt: string;
    updatedAt: string;
    scores?: ScoreRepertoire[];
}

export type ScoreRepertoire = {
    id: number;
    repertoireId: number;
    scoreId: number;
    sortOrder: number;
    addedAt: string;
    updatedAt: string;
    score?: Score;
}