const languages = ['en', 'tr'] as const
type Language = (typeof languages)[number]
export const isLanguage = (lang: string) => languages.includes(lang as Language)
export default Language
