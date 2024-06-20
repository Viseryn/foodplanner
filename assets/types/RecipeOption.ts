import { ModelOption } from "@/types/ModelOption"
import { RadioOption } from "@/types/RadioOption"
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
