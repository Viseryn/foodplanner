import { User } from "@/types/api/User"
import { ModelOption } from "@/types/options/ModelOption"
import { SelectOption } from "@/types/options/SelectOption"

export class UserOption extends ModelOption<User, SelectOption> {
    getOption(): SelectOption {
        return {
            id: this.entity["@id"],
            label: this.entity.username,
        }
    }
}
