import { getLocales } from "expo-localization";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { NativeModules, Platform } from "react-native";
import en from "./en.json";
import he from "./he.json";

const getDeviceLang = () => {
  const appLanguage =
    Platform.OS === "ios"
      ? NativeModules.SettingsManager.settings.AppleLocale ||
        NativeModules.SettingsManager.settings.AppleLanguages[0]
      : NativeModules.I18nManager.localeIdentifier;

  return appLanguage.search(/-|_/g) !== -1
    ? appLanguage.slice(0, 2)
    : appLanguage;
};

const fixHeberwLocale = () => {
  if (getDeviceLang() === "iw") {
    return "he";
  } else {
    return getDeviceLang();
  }
};

// The function sets the default language to the first item in the locales array, with a fallback language of "en".
// It also defines the available resources for the translation, in this case English and Hebrew.
// The interpolation property is used to configure the library's interpolation options, in this case the escapeValue is set to false, because React already has protection against XSS attacks.

export default i18n.use(initReactI18next).init({
  compatibilityJSON: "v3",
  lng: fixHeberwLocale(),
  fallbackLng: "en",
  resources: {
    en: en,
    he: he,
  },
  interpolation: {
    escapeValue: false, // react already safes from xss
  },
});

export const isRTL = i18n.dir() === "rtl" ? true : false;