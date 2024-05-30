import { init18n } from 'core/i18n/init';
import en from 'translation/en.json';
import pt from 'translation/pt.json';
import es from 'translation/es.json';

export const resources = {
  en: {
    translation: en,
  },
  pt: {
    translation: pt,
  },
  es: {
    translation: es,
  },
};

export const fallbackLng = 'en';

export type LanguageCode = keyof typeof resources;

const i18n = init18n({ resources, fallbackLng });

export type LanguagesEnabled = {
  code: string;
  name: string;
}

export const languagesEnabled: LanguagesEnabled[] = [
  { code: 'en', name: 'english' },
  { code: 'pt', name: 'portuguese' },
  { code: 'es', name: 'spanish' },
];

export default i18n;
