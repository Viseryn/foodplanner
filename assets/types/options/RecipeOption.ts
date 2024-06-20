import { ModelOption } from "@/types/options/ModelOption"
import { RadioOption } from "@/types/options/RadioOption"
import RecipeModel from "@/types/RecipeModel"

export class RecipeOption extends ModelOption<RecipeModel, RadioOption> {
    getOption(): RadioOption {
        return {
            id: `recipe_${this.entity.id}`,
            label: this.entity.title,
            value: this.entity.id.toString(),
        }
    }
}
