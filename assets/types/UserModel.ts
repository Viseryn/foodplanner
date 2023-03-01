/************************************
 * ./assets/types/UserModel.ts *
 ************************************/

import EntityWithOption from './EntityWithOption'
import SelectOption from './SelectOption'

/**
 * Type specifications for User objects returned by APIs
 */
type UserModel = EntityWithOption<SelectOption> & {
    /** The entity id of the User object. */
    id?: number

    /** The username of the User object. */
    username?: string

    /** The roles of the User object. */
    roles?: Array<string>
}

export default UserModel
