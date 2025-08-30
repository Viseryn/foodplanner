import Button from "@/components/ui/Buttons/Button"
import IconButton from "@/components/ui/Buttons/IconButton"
import Spacer from "@/components/ui/Spacer"
import { Spinner } from "@/components/ui/Spinner"
import { Detached } from "@/types/api/Detached"
import { Meal } from "@/types/api/Meal"
import { Settings } from "@/types/api/Settings"
import { UserGroup } from "@/types/api/UserGroup"
import { ComponentLoadingState } from "@/types/enums/ComponentLoadingState"
import { ManagedResource } from "@/types/ManagedResource"
import { ManagedResourceCollection } from "@/types/ManagedResourceCollection"
import { ApiRequest } from "@/util/ApiRequest"
import { ReactElement, useState } from "react"
import { useNavigate } from "react-router-dom"
import swal from "sweetalert"

type UserGroupsSettingsModuleProps = {
    userGroups: ManagedResourceCollection<UserGroup>
    visibleUserGroups: ManagedResourceCollection<UserGroup>
    meals: ManagedResourceCollection<Meal>
    settings: ManagedResource<Settings>
}

export const UserGroupsSettingsModule = (props: UserGroupsSettingsModuleProps): ReactElement => {
    const { userGroups, visibleUserGroups, meals, settings } = props
    const navigate = useNavigate()

    const [isLoading, setLoading] = useState<ComponentLoadingState>(ComponentLoadingState.WAITING)

    const handleChangeGroupVisibility = async (userGroup: UserGroup): Promise<void> => {
        setLoading(ComponentLoadingState.LOADING)

        await ApiRequest
            .patch<UserGroup>(userGroup["@id"], { hidden: !userGroup.hidden })
            .ifSuccessful(() => {
                userGroups.load()
                visibleUserGroups.load()
                setLoading(ComponentLoadingState.WAITING)
            })
            .execute()
    }

    const handleDeleteGroup = async (userGroup: UserGroup): Promise<void> => {
        const swalResponse = await swal({
            dangerMode: true,
            icon: 'error',
            title: 'Benutzergruppe wirklich löschen?',
            buttons: ["Abbrechen", "Löschen"],
        })

        if (swalResponse) {
            if (!confirm) {
                return
            }

            await ApiRequest
                .delete(userGroup["@id"])
                .ifSuccessful(() => {
                    userGroups.load()
                    visibleUserGroups.load()
                    meals.load()
                })
                .execute()
        }
    }

    const handleSetStandardGroup = async (userGroup: UserGroup): Promise<void> => {
        if (settings.isLoading) {
            return
        }

        const settingsPatch: Partial<Detached<Settings>> = { standardUserGroup: userGroup["@id"] }

        // Optimistic feedback
        settings.setData({ ...settings.data, ...settingsPatch })

        await ApiRequest
            .patch<Settings>(`/api/users/me/settings`, settingsPatch)
            .execute()
    }

    const handleEditGroup = (group: UserGroup): void => {
        navigate(`/settings/group/${group.id}/edit`)
    }

    return (
        <>
            <p className="text-sm">
                Hier kannst du Benutzergruppen verwalten. Jede Mahlzeit, die du einträgst, gehört zu einer
                Benutzergruppe. Es gibt automatisch angelegte Benutzergruppen für jeden Benutzer und eine
                "Alle"-Gruppe, die nicht bearbeitbar, aber ausblendbar sind. Du kannst aber auch weitere Benutzergruppen
                erstellen, bearbeiten und löschen. Außerdem kannst du hier eine Standardgruppe für neue Mahlzeiten
                einstellen.
            </p>

            <Spacer height="4" />

            {userGroups.isLoading || settings.isLoading || isLoading === ComponentLoadingState.LOADING ? (
                <Spinner />
            ) : (
                <>
                    <div className="space-y-2">
                        {userGroups.data.map(userGroup =>
                            <div key={userGroup.id} className="p-2 rounded-2xl transition duration-300 hover:bg-secondary-200/40 dark:hover:bg-secondary-dark-200/40">
                                <div className="flex items-center">
                                    <span className="material-symbols-rounded mr-4">{userGroup.icon}</span>
                                    {userGroup.name}
                                    &nbsp;
                                    {(userGroup.users.length > 1 || !userGroup.readonly) &&
                                        <>({userGroup.users.map(user => user.username).join(', ')})</>
                                    }
                                </div>
                                <Spacer height="2" />
                                <div className="flex justify-end gap-2">
                                    {!userGroup.readonly &&
                                        <IconButton
                                            outlined={true}
                                            onClick={() => handleDeleteGroup(userGroup)}
                                            disabled={settings.data.standardUserGroup === userGroup["@id"]}
                                        >
                                            delete
                                        </IconButton>
                                    }

                                    <IconButton
                                        outlined={true}
                                        onClick={() => handleChangeGroupVisibility(userGroup)}
                                        disabled={settings.data.standardUserGroup === userGroup["@id"]}
                                    >
                                        {userGroup.hidden ? "visibility_off" : "visibility"}
                                    </IconButton>

                                    <IconButton
                                        outlined={settings.data.standardUserGroup !== userGroup["@id"]}
                                        onClick={() => handleSetStandardGroup(userGroup)}
                                        disabled={userGroup.hidden}
                                    >
                                        favorite
                                    </IconButton>

                                    <IconButton
                                        outlined={true}
                                        onClick={() => handleEditGroup(userGroup)}
                                    >
                                        edit
                                    </IconButton>
                                </div>
                            </div>
                        )}
                    </div>

                    <Spacer height="4" />

                    <div className="flex justify-end">
                        <Button
                            role="secondary"
                            location="/settings/groups/add"
                            label="Neue Gruppe hinzufügen"
                            icon="add"
                            isSmall={true}
                        />
                    </div>
                </>
            )}
        </>
    )
}
