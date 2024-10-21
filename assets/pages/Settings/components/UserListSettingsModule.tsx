import IconButton from "@/components/ui/Buttons/IconButton"
import Spacer from "@/components/ui/Spacer"
import Spinner from "@/components/ui/Spinner"
import { useEntityState } from "@/hooks/useEntityState"
import { UserModel } from "@/types/UserModel"
import React, { ReactElement } from "react"
import { NavigateFunction, useNavigate } from "react-router-dom"

type UserListSettingsModuleProps = {
    authentication: Authentication
}

export const UserListSettingsModule = (props: UserListSettingsModuleProps): ReactElement => {
    const navigate: NavigateFunction = useNavigate()
    const users: EntityState<UserModel[]> = useEntityState("/api/users", props.authentication)

    const handleEditUser = (user: UserModel): void => {
        navigate(`/settings/user/${user.id}/edit`)
    }

    const UserListRow = (user: UserModel): ReactElement => (
        <tr key={user.id} className="p-2 rounded-2xl transition duration-300 hover:bg-secondary-200/40 dark:hover:bg-secondary-dark-200/40">
            <td className={"px-4 py-2 rounded-l-2xl"}>{user.id}</td>
            <td className={"px-4 py-2"}>
                {user.username}<br />
                {user.email ?? <em>keine Email-Adresse</em>}<br />
                Rollen: {user.roles.join(", ")}
            </td>
            <td className={"px-4 py-2 rounded-r-2xl"}>
                <IconButton outlined={true} onClick={() => handleEditUser(user)}>
                    edit
                </IconButton>
            </td>
        </tr>
    )

    return (
        <>
            <p className="text-sm">Folgende Benutzer sind im System vorhanden:</p>

            <Spacer height="4" />

            {users.isLoading ? (
                <Spinner />
            ) : (
                <table className="w-full">
                    <thead>
                    <tr>
                        <th className={"px-4 py-2 text-left"}>#</th>
                        <th className={"px-4 py-2 text-left"}>Benutzer</th>
                        <th></th>
                    </tr>
                    </thead>
                    <tbody>
                        {users.data.map(user => UserListRow(user))}
                    </tbody>
                </table>
            )}
        </>
    )
}