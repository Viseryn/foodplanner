import { TranslationFunction, Translations, useTranslation } from "@/hooks/useTranslation"

const PickFileTranslations: Translations = {
    id: "pickfile",

    en: {
        "pick.file": "Pick a file",
    },

    de: {
        "pick.file": "Datei auswählen",
    },
}

const t: TranslationFunction = useTranslation(PickFileTranslations)

export const PICK_FILE: string = t("pick.file")