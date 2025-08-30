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

export const HOMEPAGE_CONFIGS: HomepageConfig[] = [
    { homepage: "PLANNER", icon: "date_range", label: "Wochenplan", page: findPageById("planner") },
    { homepage: "RECIPES", icon: "receipt_long", label: "Rezepte", page: findPageById("recipes") },
    { homepage: "SHOPPING_LIST", icon: "shopping_cart", label: "Einkaufsliste", page: findPageById("shoppinglist") },
    { homepage: "PANTRY", icon: "home_work", label: "Vorratskammer", page: findPageById("pantry") },
] as const
