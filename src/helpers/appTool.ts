import { SearchField, SortField } from '~/context/searchContext';
import { FormMakerContentType, FormMakerPartEnum, IFormMakerInput } from '~/types/FormMakerCoreTypes';
import { LevelAccessEnum } from '~/models/Session';
import DOMPurify from 'dompurify';
import { translate } from '~/resources/i18n/i18n';
import { GenericActionEnum } from '~/types/centerType';
import dayjs from 'dayjs';

class AppTool {
    constructor() {}

    // public --> start region /////////////////////////////////////////////
    public changeTitle(title: string): void {
        document.title = title;
    }

    public findDuplicates(arr: string[]): string[] {
        const count: { [key: string]: number } = {};
        const duplicates: string[] = [];

        arr.forEach((item) => {
            count[item] = (count[item] || 0) + 1;
        });

        for (const key in count) {
            if (count[key] > 1) {
                duplicates.push(key);
            }
        }

        return duplicates;
    }

    public calcPercent(nb: number, total: number): number {
        return Math.floor((nb * 100) / total);
    }

    public URLTester(url: string): boolean {
        try {
            new URL(url);
            return true;
        } catch {
            return false;
        }
    }

    public getContrastTextColor(hexColor: string): string {
        const hex = hexColor.replace('#', '');

        const r = parseInt(hex.substring(0, 2), 16);
        const g = parseInt(hex.substring(2, 4), 16);
        const b = parseInt(hex.substring(4, 6), 16);

        const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

        return luminance > 0.5 ? '#000000' : '#ffffff';
    }

    public BuildSearchURL(filters: SearchField[], sort: SortField = null, start: string = '&'): string {
        const search = new URLSearchParams();
        if (filters.length === 0 && !sort) return '';

        filters.forEach((f) => {
            search.append(f.field, f.values);
        });
        if (sort) search.append('sort', `${sort.sortField} ${sort.order}`);
        return start + search.toString();
    }

    private searchValueFormatter(el: IFormMakerInput, v: string): string {
        if (el.searchValueFormatter) {
            return el.searchValueFormatter(v);
        }
        if (el.type === 'dateSearch') {
            return this.dateRangeFormater(v);
        }
        if (el.type === 'select') {
            const opt = el.selectOptions.find((o) => o.value.toString().split('¤')[0] === v.split('¤')[0]);
            if (opt) {
                const parts = opt.label.split('¤');
                return parts.length > 1 ? parts[1] : parts[0];
            }
        }
        if (el.type === 'autocomplete') {
            const parts = decodeURIComponent(decodeURIComponent(v)).replace(/\+/g, ' ').split('¤');
            if (parts.length > 1) return parts[1];
            else return parts[0];
        }
        if (el.type === 'multipleAutocomplete') {
            const parts = decodeURIComponent(decodeURIComponent(v)).replace(/\+/g, ' ').split(',');
            const formatted = parts
                .map((p) => {
                    const c = p.split('¤');
                    if (c.length > 1) return c[1];
                    else c[0];
                })
                .join(', ');
            return formatted;
        }
        return v;
    }

    private dateRangeFormater(v: string): string {
        const s = v.split('$');
        const ds = s[0].split(',');
        const t = s[1];
        let out = '';
        switch (t) {
            case '>':
                out = 'Supérieur au';
                break;
            case '<':
                out = 'Inférieur au';
                break;
            case 'd':
                out = 'Du';
                break;
            default:
                break;
        }
        out += ' ' + ds.map((d) => dayjs(d).format('DD/MM/YYYY')).join(' au ');
        return out;
    }

    public ParseSearchUrl(searchForm: FormMakerContentType<FormMakerPartEnum.SEARCH>[], f: Record<string, string> = null): SearchField[] {
        const searchField: SearchField[] = [];
        if (!searchForm || searchForm.length === 0) return searchField;
        let keyValue: Record<string, string>;
        if (f) {
            keyValue = f;
        } else {
            const query = window.location.search
                .replace('?', '')
                .split('&')
                .filter((q) => !q.toLowerCase().startsWith('Table') && !q.toLowerCase().startsWith('action') && !q.toLowerCase().startsWith('sort'));
            const obj = new Object();
            query.forEach((kv) => {
                const v = kv.split('=');
                Object.defineProperty(obj, v[0], { value: v[1], writable: true });
            });
            keyValue = obj as Record<string, string>;
        }
        Object.getOwnPropertyNames(keyValue).forEach((q) => {
            const index = searchForm[0].content.findIndex((c) => c.id.toLowerCase() === q.toLowerCase());
            if ((keyValue[q] ?? '').toString() !== '' && index > -1) {
                const formElement = searchForm[0].content[index];
                let value = keyValue[q].includes('~') ? keyValue[q].split('~')[0] : keyValue[q];
                if (formElement.type === 'multipleAutocomplete') {
                    value = keyValue[q]
                        .split(',')
                        .map((v) => {
                            return v.split('~')[0];
                        })
                        .join(',');
                } else {
                    value = keyValue[q];
                }
                const formattedValue: string = this.searchValueFormatter(formElement, decodeURIComponent(value));
                searchField.push({
                    field: q,
                    fieldName: decodeURIComponent(formElement.label),
                    values: decodeURIComponent(value),
                    formattedValue: formattedValue,
                });
            }
        });
        return searchField;
    }

    public toCapitalize(str: string): string {
        const words = str.split(' ');
        const capitalizedWords = words.map((word) => word.charAt(0).toUpperCase() + word.slice(1));
        return capitalizedWords.join(' ');
    }

    public LevelAccessTranslater(l: LevelAccessEnum): string {
        switch (l) {
            case LevelAccessEnum.ADMIN:
                return translate('user.admin');
            case LevelAccessEnum.USER:
                return translate('user.singular');
            default:
                return 'n/a';
        }
    }

    public getTotalMilliseconds(timeString: string): number {
        const parts = timeString.split(':');
        const hours = parseInt(parts[0]) || 0;
        const minutes = parseInt(parts[1]) || 0;
        const secondsWithFraction = parts[2].split('.');
        const seconds = parseInt(secondsWithFraction[0]) || 0;
        const milliseconds = parseInt(secondsWithFraction[1]) || 0;

        // Convertir les heures, minutes et secondes en millisecondes
        const totalMilliseconds = (hours * 3600 + minutes * 60 + seconds) * 1000 + milliseconds;

        return totalMilliseconds;
    }
    public fetchDispatcher(str: string): string {
        switch (str.toLowerCase()) {
            case 'failed to fetch':
                return 'failed_request';
            case 'cancelled':
                return 'cancelled';
            case 'networkError when attempting to fetch resource':
                return 'network_error';
            case 'response has unsupported mime type':
                return 'unsupported_mime';
            case "failed to execute 'json' on 'Response': body stream is locked":
                return 'reader_error';
            case 'has been blocked by cors policy':
                return 'cors_error';
            default:
                return 'unknow_error';
        }
    }
    public sanitizeHTML(str: string): string {
        const sanitized = DOMPurify.sanitize(str);
        return sanitized;
    }
    public async runSequential(...tasks: (() => Promise<unknown>)[]): Promise<unknown[]> {
        const results = [];

        for (const task of tasks) {
            const result = await task();
            results.push(result);
        }
        return results;
    }

    public toBase64(obj: string | ArrayBuffer | Uint8Array, urlMode: boolean = false): string {
        let bytes: Uint8Array;

        if (typeof obj === 'string') {
            // Convertir la string en bytes (UTF-8)
            bytes = new TextEncoder().encode(obj);
        } else if (obj instanceof Uint8Array) {
            bytes = obj;
        } else if (obj instanceof ArrayBuffer) {
            bytes = new Uint8Array(obj);
        } else {
            throw new Error('Unsupported input type');
        }

        const binary = String.fromCharCode(...bytes);
        const b64 = btoa(binary);
        if (urlMode) {
            return b64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
        } else {
            return b64;
        }
    }

    public containsHTML(str: string): boolean {
        return /<[^>]+>/.test(str);
    }

    public getAction(action: string = ''): GenericActionEnum {
        switch (action.toLowerCase()) {
            case 'update':
                return GenericActionEnum.UPDATE;
            case 'new':
                return GenericActionEnum.NEW;
            case 'delete':
                return GenericActionEnum.DELETE;
            case 'view':
                return GenericActionEnum.VIEW;
            default:
                return GenericActionEnum.TABLE;
        }
    }
    // public --> end region ///////////////////////////////////////////////

    // private --> start region ////////////////////////////////////////////
    // private --> end region //////////////////////////////////////////////
}
export default new AppTool();
