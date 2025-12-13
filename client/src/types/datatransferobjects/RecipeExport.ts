import { Nullish } from "@/types/Nullish"

type IngredientExport = {
    name: string
    quantityValue: string
    quantityUnit: string
}

type InstructionExport = {
    instruction: string
}

export type RecipeExport = {
    title: string
    portionSize: number
    ingredients: IngredientExport[]
    instructions: InstructionExport[]
    image: Nullish<string>
    externalUrl?: string
    sideDish: boolean
}
