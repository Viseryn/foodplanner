/************************************
 * ./assets/types/UserGroupModel.ts *
 ************************************/

import UserModel from './UserModel'

/**
 * Type specifications for UserGroup objects returned by APIs
 */
type UserGroupModel = {
    /** The entity id of the UserGroup object. */
    id: number

    /** The name of the UserGroup object. */
    name: string

    /** The icon of the UserGroup object. */
    icon: string

    /** The User objects that belong to the UserGroup object. */
    users: Array<UserModel>
}

export default UserGroupModel
