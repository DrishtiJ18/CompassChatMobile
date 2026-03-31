import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';

import en from './locales/en.json';
import ar from './locales/ar.json';

export const defaultNamespace = 'default';

export const changeLanguage = async (language: string) => {
  await i18n.changeLanguage(language);

  await AsyncStorage.setItem(
    'selected_language',
    JSON.stringify({
      language: language,
    }),
  );
};

export const resources = {
  en: {
    [defaultNamespace]: en,
  },
  ar: {
    [defaultNamespace]: ar,
  },
};

const getLanguage = async () => {
  try {
    let language = 'en';
    const details = await AsyncStorage.getItem('selected_language');

    if (details) {
      const parsedDetails = JSON.parse(details);
      language = parsedDetails.language ?? 'en';
    }

    return language;
  } catch (error) {
    console.error('Error retrieving or parsing stored language:', error);
    return 'en';
  }
};

const initializeI18n = async () => {
  const defaultLanguage = await getLanguage();

  i18n.use(initReactI18next).init({
    defaultNS: 'default',
    ns: ['default'],
    resources: {
      en: {
        default: en,
      },
      ar: {
        default: ar,
      },
    },
    lng: defaultLanguage,
    fallbackLng: defaultLanguage,
    interpolation: {
      escapeValue: false,
    },
  });
};

initializeI18n();

export default i18n;
