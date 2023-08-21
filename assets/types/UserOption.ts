/********************************
 * ./assets/types/UserOption.ts *
 ********************************/

import ModelOption from '@/types/ModelOption'
import UserModel from '@/types/UserModel'
import SelectOption from '@/types/SelectOption'

class UserOption extends ModelOption<UserModel, SelectOption> {
    getOption(): SelectOption {
        return {
            id: this.entity.id?.toString() ?? '-1',
            label: this.entity.username ?? '',
        }
    }
}

export default UserOption
