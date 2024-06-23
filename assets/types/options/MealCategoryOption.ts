import { ModelOption } from '@/types/options/ModelOption'
import MealCategoryModel from '@/types/MealCategoryModel'
import { RadioOption } from '@/types/options/RadioOption'

export class MealCategoryOption extends ModelOption<MealCategoryModel, RadioOption> {
    getOption(): RadioOption {
        return {
            id: 'mealCategory_' + this.entity.name,
            label: this.entity.name,
            icon: this.entity.icon,
            checked: false,
            value: this.entity.id.toString(),
        }
    }
}
