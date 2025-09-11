import { TranslationFunction, useTranslation } from "@/hooks/useTranslation"
import { GlobalTranslations } from "@/layouts/GlobalTranslations"
import { MealCategory } from "@/types/api/MealCategory"
import { ModelOption } from "@/types/options/ModelOption"
import { RadioOption } from "@/types/options/RadioOption"

export class MealCategoryOption extends ModelOption<MealCategory, RadioOption> {
    getOption(): RadioOption {
        const t: TranslationFunction = useTranslation(GlobalTranslations)

        return {
            id: 'mealCategory_' + this.entity.name,
            label: t("global.mealcategory." + this.entity.name),
            icon: this.entity.icon,
            checked: false,
            value: this.entity["@id"],
        }
    }
}
