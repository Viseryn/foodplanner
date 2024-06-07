import Spacer from "@/components/ui/Spacer"
import Spinner from "@/components/ui/Spinner"
import { useEntityState } from "@/hooks/useEntityState"
import { UserModel } from "@/types/UserModel"
import React, { ReactElement } from "react"

type UserListSettingsModuleProps = {
    authentication: Authentication
}

export const UserListSettingsModule = (props: UserListSettingsModuleProps): ReactElement => {
    const users: EntityState<UserModel[]> = useEntityState('/api/users', props.authentication)

    return (
        <>
            <p className="text-sm">Folgende Benutzer sind im System vorhanden:</p>

            <Spacer height="4" />

            {users.isLoading ? (
                <Spinner />
            ) : (
                <div className={"overflow-x-auto"}>
                    <table>
                        <thead>
                            <tr>
                                <th className={"px-4 py-2 text-left"}>#</th>
                                <th className={"px-4 py-2 text-left"}>Benutzername</th>
                                <th className={"px-4 py-2 text-left"}>Email-Adresse</th>
                                <th className={"px-4 py-2 text-left"}>Rollen</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.data.map(user =>
                                <tr key={user.id}>
                                    <td className={"px-4 py-2"}>{user.id}</td>
                                    <td className={"px-4 py-2"}>{user.username}</td>
                                    <td className={"px-4 py-2"}>{user.email ?? <em>keine angegeben</em>}</td>
                                    <td className={"px-4 py-2"}>{user.roles.join(", ")}</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </>
    )
}