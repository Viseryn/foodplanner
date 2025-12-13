import { Recipe } from "@/types/api/Recipe"
import { ModelOption } from "@/types/options/ModelOption"
import { RadioOption } from "@/types/options/RadioOption"

export class SideDishOption extends ModelOption<Recipe, RadioOption> {
    getOption(): RadioOption {
        return {
            id: `sideDish_${this.entity.id}`,
            label: this.entity.title,
            value: this.entity["@id"],
        }
    }
}
