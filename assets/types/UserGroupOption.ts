/*************************************
 * ./assets/types/UserGroupOption.ts *
 *************************************/

import ModelOption from '@/types/ModelOption'
import { UserGroupModel } from '@/types/UserGroupModel'
import RadioOption from '@/types/RadioOption'

class UserGroupOption extends ModelOption<UserGroupModel, RadioOption> {
    getOption(): RadioOption {
        return {
            id: 'userGroup_' + this.entity.name,
            label: this.entity.name,
            icon: this.entity.icon,
            checked: false,
            value: this.entity.id.toString(),
        }
    }
}

export default UserGroupOption
