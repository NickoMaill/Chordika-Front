export type DocumentApiModel = {
    id: string;
    userId?: number;
    userName?: string;
    type: string;
    titre: string;
    fichier: string;
    folder: string;
    added: Date;
    updated: Date;
};
