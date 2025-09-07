import { GlobalTranslations } from "@/layouts/GlobalTranslations"
import { Maybe } from "@/types/Maybe"
import { APP_LANGUAGE } from "@/util/env/APP_LANGUAGE"

export type Language = "en" | "de"

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

    return (key: string): string => {
        if (key.startsWith("global.")) {
            const globalKey: string = key.split(".").splice(1).join(".")
            return GlobalTranslations[appLanguage]?.[globalKey] ?? `${appLanguage}.global.${globalKey}`
        }

        const translation: Maybe<Translation> = translations[appLanguage]
        return translation?.[key] ?? `${appLanguage}.${translations.id}.${key}`
    }
}
