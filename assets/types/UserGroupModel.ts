import { UserModel } from './UserModel'

export type UserGroupModel = {
    id: number
    name: string
    icon: string
    users: Array<UserModel>
    readonly: boolean
    hidden: boolean
    position: number
}
