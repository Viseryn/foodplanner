import { StorageIngredient } from "@/types/StorageIngredient"

export const parseQuantityValue = (ingredient: StorageIngredient): string => {
    return ingredient.quantityValue === undefined || ingredient.quantityValue === ""
        ? "1"
        : ingredient.quantityValue
}
