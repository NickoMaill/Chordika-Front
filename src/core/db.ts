import Dexie, { Table } from 'dexie';
import { Maison } from '~/models/Maison';
import { UserSessionDb } from '~/models/Users';

export class AppDB extends Dexie {
    session!: Table<UserSessionDb, number>;
    maisons!: Table<Maison, number>;
    constructor() {
        super('AppDB');
        this.version(1).stores({
            session: 'id',
            maison: 'id',
        });
    }
}

export const db = new AppDB();
