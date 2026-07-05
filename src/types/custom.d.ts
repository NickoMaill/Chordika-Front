export type RecursiveKeyOf<TObj extends object> = {
    [TKey in keyof TObj & string]: TObj[TKey] extends object ? `${TKey}.${RecursiveKeyOf<TObj[TKey]>}` : `${TKey}`;
}[keyof TObj & string];
