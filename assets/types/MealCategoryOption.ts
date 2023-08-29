/*************************************
 * ./assets/types/MealCategoryOption.ts *
 *************************************/

import ModelOption from '@/types/ModelOption'
import MealCategoryModel from '@/types/MealCategoryModel'
import RadioOption from '@/types/RadioOption'

class MealCategoryOption extends ModelOption<MealCategoryModel, RadioOption> {
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

export default MealCategoryOption
