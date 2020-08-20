import i18n from "i18next";
import { initReactI18next } from 'react-i18next';
import LanguageDetector from "i18next-browser-languagedetector";

i18n
.use(LanguageDetector)
.use(initReactI18next)
.init({
  // we init with resources
  resources: {
    en: {
      translations: {
        Accept:"Accept",
        Cancel:"Cancel",
        Edit:"Edit",
        Delete:"Delete",
        "Add Note":"Add Note",
        'Test project by Dmytro Hryshchenko':'Test project by Dmytro Hryshchenko',
      }
    },
    ua: {
      translations: {
        Accept:"Прийняти",
        Cancel:"Відмінити",
        Edit:"Редагувати",
        Delete:"Видалити",
        "Add Note":"Додати Примітку",
        'Test project by Dmytro Hryshchenko':'Тестовий проект Грищенка Дмитра'
      }
    },
    ru: {
      translations: {
        Accept:"Принять",
        Cancel:"Отмена",
        Edit:"Редактировать",
        Delete:"Удалить",
        "Add Note":"Добавить Заметку",
        'Test project by Dmytro Hryshchenko':'Тестовый проект Грищенко Дмитрия'
      }
    },
  },
  fallbackLng: "en",
  debug: true,

  // have a common namespace used around the full app
  ns: ["translations"],
  defaultNS: "translations",

  keySeparator: false, // we use content as keys

  interpolation: {
    escapeValue: false, // not needed for react!!
    formatSeparator: ","
  },

  react: {
    wait: true
  }
});

export default i18n;