import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import frResource from './dictionaries/fr.json';
import enResource from './dictionaries/en.json';
import { RecursiveKeyOf } from '~/types/custom';
import { TranslationResourcesType } from '~/types/i18nTypes';

export const resources = {
    fr: {
        translation: frResource,
    },
    en: {
        translation: enResource,
    },
};

i18n.use(initReactI18next).init({
    compatibilityJSON: 'v4',
    resources,
    lng: window.localStorage.getItem('lang'),
    fallbackLng: 'fr',
    interpolation: {
        escapeValue: false,
    },
    react: {
        transSupportBasicHtmlNodes: true,
        transKeepBasicHtmlNodesFor: ['br', 'strong', 'i', 'p', 'b'],
        useSuspense: true,
    },
});

/**
 *
 * @param {RecursiveKeyOf<TranslationResourcesType>} key of translation
 * @param args dynamic value
 * @description !!! PLEASE use this function when you're inside a React function, otherwise use `useResources().translate() hooks`
 * @returns
 */
export const translate = (key: RecursiveKeyOf<TranslationResourcesType>, args?: Record<string, string>): string => {
    return i18n.t(key, args);
};

export default i18n;
