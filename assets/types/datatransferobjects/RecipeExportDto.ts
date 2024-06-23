import { Nullish } from "@/types/Nullish"

type IngredientExportDto = {
    name: string
    quantityValue: string
    quantityUnit: string
}

type InstructionExportDto = {
    instruction: string
}

export type RecipeExportDto = {
    title: string
    portionSize: number
    ingredients: IngredientExportDto[]
    instructions: InstructionExportDto[]
    image: Nullish<string>
}
