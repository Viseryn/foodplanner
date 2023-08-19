/************************************
 * ./assets/types/UserModel.ts *
 ************************************/

/**
 * Type specifications for User objects returned by APIs
 */
type UserModel = {
    /** The entity id of the User object. */
    id?: number

    /** The username of the User object. */
    username?: string

    /** The roles of the User object. */
    roles: Array<string>
}

export default UserModel
