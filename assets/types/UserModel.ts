/************************************
 * ./assets/types/UserModel.ts *
 ************************************/

import EntityWithSelectOption from './EntityWithSelectOption'

/**
 * Type specifications for User objects returned by APIs
 */
type UserModel = EntityWithSelectOption & {
    /** The entity id of the User object. */
    id?: number

    /** The username of the User object. */
    username?: string

    /** The roles of the User object. */
    roles?: Array<string>
}

export default UserModel
