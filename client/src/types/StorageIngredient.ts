import { Ingredient } from "@/types/api/Ingredient"
import { Editable } from "@/types/Editable"
import { Sortable } from "@/types/Sortable"

/**
 * A wrapper type of `Editable<Ingredient>`. The `position` and `checked` attributes are mandatory.
 */
export type StorageIngredient = Editable<Ingredient> & Sortable & {
    checked: boolean
}
