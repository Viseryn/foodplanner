import { TranslationFunction, Translations, useTranslation } from "@/hooks/useTranslation"
import { PAGE_CONFIGS } from "@/types/constants/PAGE_CONFIGS"
import { HomepageConfig } from "@/types/enums/HomepageConfig"
import { Page } from "@/types/Page"

const findPageById = (id: string): Page => {
    const matches: Page[] = PAGE_CONFIGS.filter(page => page.id === id)

    if (matches.length !== 1) {
        throw Error(`There is not exactly one page for identifier ${id}.`)
    }

    return matches[0]
}

const HomepageTranslations: Translations = {
    id: "homepage",

    en: {
        "planner": "Planner",
        "recipes": "Recipes",
        "shoppinglist": "Shopping List",
        "pantry": "Pantry",
    },

    de: {
        "planner": "Wochenplan",
        "recipes": "Rezepte",
        "shoppinglist": "Einkaufsliste",
        "pantry": "Vorratskammer",
    },
}

const t: TranslationFunction = useTranslation(HomepageTranslations)

export const HOMEPAGE_CONFIGS: HomepageConfig[] = [
    { homepage: "PLANNER", icon: "date_range", label: t("planner"), page: findPageById("planner") },
    { homepage: "RECIPES", icon: "receipt_long", label: t("recipes"), page: findPageById("recipes") },
    { homepage: "SHOPPING_LIST", icon: "shopping_cart", label: t("shoppinglist"), page: findPageById("shoppinglist") },
    { homepage: "PANTRY", icon: "home_work", label: t("pantry"), page: findPageById("pantry") },
] as const
