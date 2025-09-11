import { TranslationFunction, useTranslation } from "@/hooks/useTranslation"
import { GlobalTranslations } from "@/layouts/GlobalTranslations"
import { UserGroup } from "@/types/api/UserGroup"
import { ModelOption } from "@/types/options/ModelOption"
import { RadioOption } from "@/types/options/RadioOption"

export class UserGroupOption extends ModelOption<UserGroup, RadioOption> {
    getOption(): RadioOption {
        const t: TranslationFunction = useTranslation(GlobalTranslations)


        return {
            id: 'userGroup_' + this.entity.name,
            label: this.entity.name === "Alle" ? t(`global.usergroup.${this.entity.name}`) : this.entity.name,
            icon: this.entity.icon,
            checked: false,
            value: this.entity["@id"],
        }
    }
}
