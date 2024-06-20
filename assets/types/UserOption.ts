import { ModelOption } from '@/types/ModelOption'
import { SelectOption } from '@/types/SelectOption'
import { UserModel } from '@/types/UserModel'

export class UserOption extends ModelOption<UserModel, SelectOption> {
    getOption(): SelectOption {
        return {
            id: this.entity.id?.toString() ?? '-1',
            label: this.entity.username ?? '',
        }
    }
}
