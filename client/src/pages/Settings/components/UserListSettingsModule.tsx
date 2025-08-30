import IconButton from "@/components/ui/Buttons/IconButton"
import Spacer from "@/components/ui/Spacer"
import { Spinner } from "@/components/ui/Spinner"
import { useApiResourceCollection } from "@/hooks/useApiResourceCollection"
import { User } from "@/types/api/User"
import { Authentication } from "@/types/Authentication"
import { ManagedResourceCollection } from "@/types/ManagedResourceCollection"
import { hasRoleUserAdministration } from "@/util/auth/hasRoleUserAdministration"
import { ReactElement } from "react"
import { NavigateFunction, useNavigate } from "react-router-dom"

type UserListSettingsModuleProps = {
    authentication: Authentication
}

export const UserListSettingsModule = (props: UserListSettingsModuleProps): ReactElement => {
    const navigate: NavigateFunction = useNavigate()

    // "active" and "email" are not returned by this endpoint, so they have to be omitted
    const users: ManagedResourceCollection<Omit<User, "active" | "email">> = useApiResourceCollection("/api/users", true)

    const handleEditUser = (user: Omit<User, "active" | "email">): void => {
        navigate(`/settings/user/${user.id}/edit`)
    }

    return (
        <>
            <p className="text-sm">Folgende Benutzer sind im System vorhanden:</p>

            <Spacer height="4" />

            {users.isLoading ? (
                <Spinner />
            ) : (
                <div className="w-full">
                    {users.data.map(user => (
                        <div key={user.id} className="p-2 rounded-2xl transition duration-300 hover:bg-secondary-200/40 dark:hover:bg-secondary-dark-200/40 flex justify-between items-center">
                            {/* TODO: Avatar goes here */}
                            {user.username}

                            {hasRoleUserAdministration(props.authentication) &&
                                <IconButton outlined={true} onClick={() => handleEditUser(user)}>
                                    edit
                                </IconButton>
                            }
                        </div>
                    ))}
                </div>
            )}
        </>
    )
}