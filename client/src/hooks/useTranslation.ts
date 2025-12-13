import { GlobalTranslations } from "@/layouts/GlobalTranslations"
import { Maybe } from "@/types/Maybe"
import { APP_LANGUAGE } from "@/util/env/APP_LANGUAGE"

const LANGUAGES = [
    "en",
    "de",
] as const

export type Language = typeof LANGUAGES[number]

export type Translations = {
    id: string
} & {
    [K in Language]?: Translation
}

export type Translation = {
    [key: string]: string
}

export type TranslationFunction = (key: string) => string

/**
 * This hook provides a `TranslationFunction` for the configured application language which is defined as environment variable.
 * Given a `Translations` object, the `TranslationFunction` returns a proper translated text for the given `key`.
 * If the given `key` starts with `"global."`, only `GlobalTranslations` is searched for a translated text.
 */
export const useTranslation = (translations: Translations): TranslationFunction => {
    const appLanguage: Language = APP_LANGUAGE as Language

    validateTranslations(translations)

    return (key: string): string => {
        if (key.startsWith("global.")) {
            const globalKey: string = key.split(".").splice(1).join(".")
            return GlobalTranslations[appLanguage]?.[globalKey] ?? `${appLanguage}.global.${globalKey}`
        }

        const translation: Maybe<Translation> = translations[appLanguage]
        return translation?.[key] ?? `${appLanguage}.${translations.id}.${key}`
    }
}

const validateTranslations = (translations: Translations) => {
    const languages: Language[] = Object.keys(translations).filter((key: string): key is Language => LANGUAGES.includes(key as Language)) as Language[]

    if (!arraysEqual(languages, LANGUAGES)) {
        const missingLanguages: Language[] = LANGUAGES.filter((l: Language) => !languages.includes(l))
        throw new Error(`The translation file "${translations.id}" does not provide translations for these languages: ${missingLanguages}`)
    }

    languages.forEach((language: Language) => {
        languages
            .filter((lang: Language) => lang !== language)
            .forEach((otherLanguage: Language) => {
                if (!translations[language]
                    || !translations[otherLanguage]
                    || !arraysEqual(Object.keys(translations[language]), Object.keys(translations[otherLanguage]))) {
                    throw new Error(`The translation file "${translations.id}" is incomplete.`)
                }
            })
    })
}

const arraysEqual = (a: readonly string[], b: readonly string[]): boolean => {
    return a.length === b.length && a.every((value, index) => value === b[index])
}
