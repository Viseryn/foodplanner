import { ApiResource } from "@/types/api/ApiResource"
import { Image } from "@/types/api/Image"
import { Ingredient } from "@/types/api/Ingredient"
import { Instruction } from "@/types/api/Instruction"

/**
 * This type mirrors the ApiResource `Recipe`.
 *
 * @see api/src/Entity/Recipe.php
 */
export type Recipe = ApiResource & {
    "@type": "Recipe"
    id: number
    title: string
    portionSize: number
    ingredients: Ingredient[]
    instructions: Instruction[]
    image?: Image
    deleted?: boolean
    externalUrl?: string
}
