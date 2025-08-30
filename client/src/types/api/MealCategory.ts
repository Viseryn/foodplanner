import { ApiResource } from "@/types/api/ApiResource"

/**
 * This type mirrors the ApiResource `MealCategory`.
 *
 * @see api/src/Entity/MealCategory.php
 */
export type MealCategory = ApiResource & {
    "@type": "MealCategory"
    id: number
    name: string
    icon: string
}
