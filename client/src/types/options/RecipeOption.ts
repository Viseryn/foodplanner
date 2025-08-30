import { Recipe } from "@/types/api/Recipe"
import { ModelOption } from "@/types/options/ModelOption"
import { RadioOption } from "@/types/options/RadioOption"

export class RecipeOption extends ModelOption<Recipe, RadioOption> {
    getOption(): RadioOption {
        return {
            id: `recipe_${this.entity.id}`,
            label: this.entity.title,
            value: this.entity["@id"],
        }
    }
}
