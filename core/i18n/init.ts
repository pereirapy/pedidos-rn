import i18n, { Resource } from 'i18next';
import { initReactI18next } from 'react-i18next';

import { fallbackChecker } from './fallbackChecker';
import storage from '~/utils/storage';
import { STORAGE_KEY_LANGUAGE_SELECTED } from '~/utils/constants';

type Init18n = {
  resources: Resource;
  fallbackLng: string;
};

export const init18n = ({ resources, fallbackLng }: Init18n) => {
  storage
    .load({
      key: STORAGE_KEY_LANGUAGE_SELECTED,
      autoSync: true,
      syncInBackground: false,
    })
    .then((ret) => {
      const lng = ret;
      return i18n.use(initReactI18next).init({
        lng,
        resources,
        fallbackLng: fallbackChecker(resources, fallbackLng),
        compatibilityJSON: 'v3', // By default React Native projects does not support Intl
        interpolation: {
          escapeValue: false,
        },
      });
    })
    .catch((err) => {
      const lng = 'en';
      return i18n.use(initReactI18next).init({
        lng,
        resources,
        fallbackLng: fallbackChecker(resources, fallbackLng),
        compatibilityJSON: 'v3', // By default React Native projects does not support Intl
        interpolation: {
          escapeValue: false,
        },
      });
    });
};
