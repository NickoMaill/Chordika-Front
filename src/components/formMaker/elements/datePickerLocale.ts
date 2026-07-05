import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import updateLocale from 'dayjs/plugin/updateLocale';
import 'dayjs/locale/fr';

export const DATE_PICKER_LOCALE = 'fr';

dayjs.extend(customParseFormat);
dayjs.extend(updateLocale);
dayjs.locale(DATE_PICKER_LOCALE);
dayjs.updateLocale(DATE_PICKER_LOCALE, {
    months: ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'],
    monthsShort: ['Janv.', 'Févr.', 'Mars', 'Avr.', 'Mai', 'Juin', 'Juil.', 'Août', 'Sept.', 'Oct.', 'Nov.', 'Déc.'],
});
