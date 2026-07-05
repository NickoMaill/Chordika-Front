import DateTime from '~/core/classes/DateTime';

export interface BaseModel {
    id: number;
    addedAt: DateTime;
    updatedAt?: DateTime;
}
