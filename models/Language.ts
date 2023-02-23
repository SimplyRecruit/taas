export const LANGUAGES = ['en', 'tr'] as const
type Language = (typeof LANGUAGES)[number]
export const LANGUAGE_NAMES: { [key in Language]: string } = {
  en: 'English',
  tr: 'Türkçe',
}
export const isLanguage = (lang: string) => LANGUAGES.includes(lang as Language)
export default Language
