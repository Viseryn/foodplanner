/************************************
 * ./assets/types/UserGroupModel.ts *
 ************************************/

import ModelWithOption from './ModelWithOption'
import RadioOption from './RadioOption'
import UserModel from './UserModel'

/**
 * Type specifications for UserGroup objects returned by APIs
 */
type UserGroupModel = ModelWithOption<RadioOption> & {
    /** The entity id of the UserGroup object. */
    id: number

    /** The name of the UserGroup object. */
    name: string

    /** The icon of the UserGroup object. */
    icon: string

    /** Whether the UserGroup object is the standard option. */
    standard: boolean

    /** The User objects that belong to the UserGroup object. */
    users: Array<UserModel>
}

export default UserGroupModel
