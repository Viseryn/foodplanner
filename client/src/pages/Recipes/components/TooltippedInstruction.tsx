import { Tooltip } from "@/components/ui/Tooltip"
import { Ingredient } from "@/types/api/Ingredient"
import { Instruction } from "@/types/api/Instruction"
import { byLength } from "@/util/byLength"
import { getFullIngredientName } from "@/util/ingredients/getFullIngredientName"
import React, { ReactElement, ReactNode } from "react"

type TooltippedInstructionProps = {
    instruction: Instruction
    ingredients: Ingredient[]
}

export const TooltippedInstruction = (props: TooltippedInstructionProps): ReactElement => {

    const tooltippedInstruction = (): ReactNode[] => {
        if (props.ingredients.length === 0) {
            return [<>instruction.instruction</>]
        }

        const ingredientNames: string[] = props.ingredients.map(ingredient => ingredient.name).sort(byLength).reverse()
        const regex: RegExp = new RegExp(`(${ingredientNames.join("|")})`, "gi")
        const parts: string[] = props.instruction.instruction.split(regex).filter(x => !!x)

        return parts.map((part: string, index: number): ReactNode => {
            const isIngredient: boolean = ingredientNames.some((name: string) => name.toLowerCase() === part.toLowerCase())

            if (isIngredient) {
                const ingredient: Ingredient = props.ingredients.find(ingredient => ingredient.name.toLowerCase() === part.toLowerCase())!

                return (
                    <Tooltip key={index} text={getFullIngredientName(ingredient)}>
                        <span className={"font-bold text-primary-100 dark:text-secondary-dark-300"}>{part}</span>
                    </Tooltip>
                )
            }

            return <>{part}</>
        })
    }

    return (
        <span>
            {tooltippedInstruction()}
        </span>
    )

}