import en from "./locales/en.json";
import ja from "./locales/ja.json";

export type Locale = "ja" | "en";

const dictionaries = { ja, en };

export function getDictionary(locale: Locale = "ja") {
  return dictionaries[locale] ?? dictionaries.ja;
}
