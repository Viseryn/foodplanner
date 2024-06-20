import { Form } from "@/types/forms/Form"

export type RecipeForm = Form & {
    title: string
    portionSize: number
    ingredients: string
    instructions: string
}
