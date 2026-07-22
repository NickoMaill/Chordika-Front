import { SearchField, SortField } from '~/context/searchContext';
import { FormMakerType, FormMakerPartEnum, IFormMakerInput, PasswordStrengthEnum } from '~/types/FormMakerCoreTypes';
import { LevelAccessEnum } from '~/models/Session';
import DOMPurify from 'dompurify';
import { translate } from '~/resources/i18n/i18n';
import { GenericActionEnum } from '~/types/centerType';
import dayjs, { Dayjs } from 'dayjs';
import configManager from '~/managers/configManager';
import { hexToRgb, rgbToHex } from '@mui/material';

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

    public BuildSearchURL(filters: SearchField[] = [], sort: SortField = null, start: string = '&'): string {
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

    public ParseSearchUrl(searchForm: FormMakerType<FormMakerPartEnum.SEARCH>, f: Record<string, string> = null): SearchField[] {
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

        for await (const task of tasks) {
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
    public buildCompanyLogoUrl(id: number, logo: string): string {
        return `${configManager.getConfig.API_BASEURL}${configManager.getConfig.API_PUBLIC_URL}/companies/${id}/${logo}`;
    }
    public getWidth(height: number, width: number, newHeight: number): number {
        const newWidth: number = Math.floor((width / height) * newHeight);
        return newWidth;
    }
    public guessResolution(res: string = ''): number {
        if (res === '2160p') return 3840;
        if (res === '1440p') return 2560;
        if (res === '1080p') return 1920;
        if (res === '720p') return 1280;
        if (res === '480p') return 854;
        return 0;
    }
    public isHD(res: string = ''): boolean {
        const screenRes = this.guessResolution(res);
        return screenRes >= 1280;
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

    public formatFancyTime(from: Dayjs | string | Date): string {
        const date = dayjs(from);
        const now = dayjs();
        const diffMinutes = now.diff(date, 'minute');
        const diffHours = now.diff(date, 'hour');
        const diffDays = now.diff(date, 'day');

        if (diffMinutes < 5) return 'Maintenant';
        if (diffMinutes < 60) return `Il y a ${diffMinutes} minute${diffMinutes > 1 ? 's' : ''}`;
        if (diffHours < 12) return `Il y a ${diffHours} heure${diffHours > 1 ? 's' : ''}`;
        if (diffHours < 36) return 'Hier';
        if (diffDays < 7) return date.format('dddd');
        if (diffDays < 15) return `Il y a ${diffDays} jour${diffDays > 1 ? 's' : ''}`;
        if (diffDays < 365) return date.format('DD MMM');
        return date.format('DD MMM YYYY');
    }

    public formatEventDate(eventStartDate?: string, eventEndDate?: string): string {
        if (eventStartDate || eventEndDate) {
            const dates = [eventStartDate, eventEndDate].filter((d) => d);
            let isYearDifferent = dates.length === 2 && dayjs(dates[0]).year() !== dayjs(dates[1]).year();
            return dates
                .map((d) => dayjs(d).format(`DD MMMM${isYearDifferent ? 'YYYY' : ''}`))
                .distinct()
                .join(' - ');
        } else {
            return '-';
        }
    }

    public getReadableTextColor(hex: string): string {
        const [r, g, b] = hexToRgb(hex)
            .replace('rgb(', '')
            .replace(')', '')
            .split(',')
            .map((h) => parseInt(h.trim()));

        const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

        // Couleur très claire : on force un texte sombre neutre
        if (luminance > 0.78) {
            return '#1F2937';
        }

        // Couleur moyenne : on assombrit la couleur choisie
        if (luminance > 0.55) {
            return this.darkenHex(hex, 0.45);
        }

        // Couleur déjà foncée : on garde la couleur
        return hex;
    }
    public darkenHex(hex: string, amount = 0.35): string {
        const [r, g, b] = hexToRgb(hex)
            .replace('rgb(', '')
            .replace(')', '')
            .split(',')
            .map((h) => parseInt(h.trim()));

        return rgbToHex('rgb(' + [r * (1 - amount), g * (1 - amount), b * (1 - amount)].join(', ') + ')');
    }

    public logFormData(form: FormData): void {
        const obj = this.formToObj(form);
        console.log(obj);
    }

    public formToObj(form: FormData): Record<string, string> {
        const obj: Record<string, string> = {};
        for (const [key, value] of form.entries()) {
            obj[key] = String(value);
        }
        return obj;
    }

    public uuidv4(): string {
        return '10000000-1000-4000-8000-100000000000'.replace(/[018]/g, (c) => (+c ^ (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (+c / 4)))).toString(16));
    }

    public checkPasswordStrength(pwd: string): PasswordStrengthEnum {
        if (!pwd) {
            return PasswordStrengthEnum.NOTSET;
        }

        const baseRules: RegExp[] = [
            /^.{8,}$/, // Au moins 8 caractères
            /[a-z]/, // Une minuscule
            /[A-Z]/, // Une majuscule
            /\d/, // Un chiffre
            /[^\p{L}\p{N}\s]/u, // Un caractère spécial
        ];

        const passedBaseRules = baseRules.filter((rule) => rule.test(pwd)).length;

        if (passedBaseRules <= 2) {
            return PasswordStrengthEnum.POOR;
        }

        if (passedBaseRules < baseRules.length) {
            return PasswordStrengthEnum.INSUFFISANT;
        }

        const hasBonus = pwd.length >= 12 && !this.hasSimpleSequence(pwd) && !/(.)\1{2,}/u.test(pwd);

        return hasBonus ? PasswordStrengthEnum.OK : PasswordStrengthEnum.PASSABLE;
    }
    private hasSimpleSequence(password: string): boolean {
        const normalized = password.toLocaleLowerCase();

        const sequences = ['abcdefghijklmnopqrstuvwxyz', 'zyxwvutsrqponmlkjihgfedcba', '0123456789', '9876543210', 'azertyuiop', 'qwertyuiop'];

        return sequences.some((sequence) => {
            for (let i = 0; i <= sequence.length - 4; i++) {
                if (normalized.includes(sequence.slice(i, i + 4))) {
                    return true;
                }
            }

            return false;
        });
    }
    // public --> end region ///////////////////////////////////////////////

    // private --> start region ////////////////////////////////////////////
    // private --> end region //////////////////////////////////////////////
}

const appTool = new AppTool();
export default appTool;
