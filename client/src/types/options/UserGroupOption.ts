import { UserGroup } from "@/types/api/UserGroup"
import { ModelOption } from "@/types/options/ModelOption"
import { RadioOption } from "@/types/options/RadioOption"

export class UserGroupOption extends ModelOption<UserGroup, RadioOption> {
    getOption(): RadioOption {
        return {
            id: 'userGroup_' + this.entity.name,
            label: this.entity.name,
            icon: this.entity.icon,
            checked: false,
            value: this.entity["@id"],
        }
    }
}
