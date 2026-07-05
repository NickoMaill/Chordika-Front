export {};

declare global {
    interface Array<T> {
        distinct(): T[];
        distinctBy<K>(selector: (item: T) => K): T[];
        sum(this: number[]): number;
        sumBy(selector: (item: T) => number): number;
        sumBy(predicate: (item: T) => boolean, selector: (item: T) => number): number;
        has(value: unknown): boolean;
    }
}

if (!Array.prototype.distinct) {
    Array.prototype.distinct = function <T>(this: T[]): T[] {
        return [...new Set(this)];
    };
}

if (!Array.prototype.distinctBy) {
    Array.prototype.distinctBy = function <T, K>(this: T[], selector: (item: T) => K): T[] {
        return [...new Map(this.map((item) => [selector(item), item])).values()];
    };
}

if (!Array.prototype.sum) {
    Array.prototype.sum = function (this: number[]): number {
        return this.reduce((total, value) => total + value, 0);
    };
}

if (!Array.prototype.sumBy) {
    Array.prototype.sumBy = function <T>(this: T[], arg1: ((item: T) => number) | ((item: T) => boolean), arg2?: (item: T) => number): number {
        if (!arg2) {
            const selector = arg1 as (item: T) => number;
            return this.reduce((total, item) => total + selector(item), 0);
        }
        const predicate = arg1 as (item: T) => boolean;
        const selector = arg2;

        return this.reduce((total, item) => {
            return predicate(item) ? total + selector(item) : total;
        }, 0);
    };
}

if (!Array.prototype.has) {
    Array.prototype.has = function (value: unknown): boolean {
        return new Set(this).has(value);
    };
}
