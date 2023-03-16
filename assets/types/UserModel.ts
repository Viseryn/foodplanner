/************************************
 * ./assets/types/UserModel.ts *
 ************************************/

import ModelWithOption from './ModelWithOption'
import SelectOption from './SelectOption'

/**
 * Type specifications for User objects returned by APIs
 */
type UserModel = ModelWithOption<SelectOption> & {
    /** The entity id of the User object. */
    id?: number

    /** The username of the User object. */
    username?: string

    /** The roles of the User object. */
    roles: Array<string>
}

export default UserModel
