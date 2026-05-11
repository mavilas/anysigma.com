import ja from "./locales/ja.json";

export type Locale = "ja";

const dictionaries = { ja };

export function getDictionary(locale: Locale = "ja") {
  return dictionaries[locale] ?? dictionaries.ja;
}
