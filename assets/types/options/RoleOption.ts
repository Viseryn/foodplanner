import { ModelOption } from "@/types/options/ModelOption"
import { SelectOption } from "@/types/options/SelectOption"
import { Role } from "@/types/Role"

export class RoleOption extends ModelOption<Role, SelectOption> {
    getOption(): SelectOption {
        return {
            id: this.entity ?? "",
            label: this.entity ?? "",
        }
    }
}
