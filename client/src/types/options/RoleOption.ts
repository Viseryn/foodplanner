import { Role } from "@/types/api/Role"
import { ModelOption } from "@/types/options/ModelOption"
import { SelectOption } from "@/types/options/SelectOption"

export class RoleOption extends ModelOption<Role, SelectOption> {
    getOption(): SelectOption {
        return {
            id: this.entity.value ?? "",
            label: this.entity.value ?? "",
        }
    }
}
