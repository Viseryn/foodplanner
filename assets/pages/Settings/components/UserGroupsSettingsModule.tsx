import React, { ReactElement } from 'react'
import Spacer from '@/components/ui/Spacer'
import Spinner from '@/components/ui/Spinner'
import IconButton from '@/components/ui/Buttons/IconButton'
import Button from '@/components/ui/Buttons/Button'
import { UserGroupModel } from '@/types/UserGroupModel'
import SettingsModel from '@/types/SettingsModel'
import swal from 'sweetalert'
import { tryApiRequest } from '@/util/tryApiRequest'
import axios, { AxiosResponse } from 'axios'
import DayModel from '@/types/DayModel'

type UserGroupsSettingsModuleProps = {
    userGroups: EntityState<UserGroupModel[]>
    visibleUserGroups: EntityState<UserGroupModel[]>
    days: EntityState<DayModel[]>
    settings: EntityState<SettingsModel>
}

/**
 * @todo [Issue #222] Make UserGroups editable
 */
export const UserGroupsSettingsModule = (props: UserGroupsSettingsModuleProps): ReactElement => {
    const { userGroups, visibleUserGroups, days, settings } = props

    const handleChangeGroupVisibility = async (userGroup: UserGroupModel): Promise<void> => {
        const apiUrl: string = `/api/usergroups/${userGroup.id}`

        await tryApiRequest("PATCH", apiUrl, async (): Promise<AxiosResponse<any, any>> => {
            const response: AxiosResponse<any, any> = await axios.patch(apiUrl, { hidden: !userGroup.hidden })

            userGroups.load()
            visibleUserGroups.load()
            days.load()

            return response
        })
    }

    const handleDeleteGroup = async (index: number): Promise<void> => {
        const id: number = userGroups.data[index].id ?? -1

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

            const apiUrl: string = `/api/usergroups/${id}`

            await tryApiRequest("DELETE", apiUrl, async (): Promise<AxiosResponse<any>> => {
                const response = await axios.delete(apiUrl)

                userGroups.load()
                visibleUserGroups.load()
                days.load()

                return response
            })
        }
    }

    const handleSetStandardGroup = async (userGroup: UserGroupModel): Promise<void> => {
        const apiUrl: string = `/api/settings/${settings.data.id}`

        await tryApiRequest("PATCH", apiUrl, async (): Promise<AxiosResponse<SettingsModel>> => {
            const response: AxiosResponse<SettingsModel> = await axios.patch(apiUrl, {
                standardUserGroup: userGroup
            })

            settings.setData(response.data)
            return response
        })
    }

    const handleChangePosition = async (group: UserGroupModel, direction: -1 | 1): Promise<void> => {
        const copyOfGroups: UserGroupModel[] = [...userGroups.data]
        const indexOfGroup: number = copyOfGroups.indexOf(group)
        const groupCopy: UserGroupModel = {...copyOfGroups[indexOfGroup]}
        const oldPosition: number = copyOfGroups[indexOfGroup].position
        const newPosition: number = copyOfGroups[indexOfGroup + direction].position

        groupCopy.position = newPosition
        copyOfGroups[indexOfGroup].position = newPosition
        copyOfGroups[indexOfGroup + direction].position = oldPosition
        copyOfGroups[indexOfGroup] = copyOfGroups[indexOfGroup + direction]
        copyOfGroups[indexOfGroup + direction] = groupCopy

        userGroups.setData(copyOfGroups)

        const apiUrl1: string = `/api/usergroups/${copyOfGroups[indexOfGroup].id}`
        const apiUrl2: string = `/api/usergroups/${copyOfGroups[indexOfGroup + direction].id}`

        await tryApiRequest("PATCH", apiUrl1, async (): Promise<AxiosResponse<any, any>> => {
            return await axios.patch(apiUrl1, { position: copyOfGroups[indexOfGroup].position })
        })
        await tryApiRequest("PATCH", apiUrl2, async (): Promise<AxiosResponse<any, any>> => {
            return await axios.patch(apiUrl2, { position: copyOfGroups[indexOfGroup + direction].position })
        })
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

            {userGroups.isLoading || settings.isLoading ? (
                <Spinner />
            ) : (
                <>
                    <div className="space-y-2">
                        {userGroups.data.map((group, index) =>
                            <div key={group.id} className="p-2 rounded-2xl transition duration-300 hover:bg-secondary-200/40 dark:hover:bg-secondary-dark-200/40">
                                <div className="flex items-center">
                                    <span className="material-symbols-rounded mr-4">{group.icon}</span>
                                    {group.name}
                                    &nbsp;
                                    {(group.users.length > 1 || !group.readonly) &&
                                        <>({group.users.map(user => user.username).join(', ')})</>
                                    }
                                </div>
                                <Spacer height="2" />
                                <div className="flex justify-end gap-2">
                                    {!group.readonly &&
                                        <IconButton
                                            outlined={true}
                                            onClick={() => handleDeleteGroup(index)}
                                            disabled={settings.data.standardUserGroup?.id === group.id}
                                        >
                                            delete
                                        </IconButton>
                                    }

                                    <IconButton
                                        outlined={true}
                                        onClick={() => handleChangeGroupVisibility(group)}
                                        disabled={settings.data.standardUserGroup?.id === group.id}
                                    >
                                        {group.hidden ? "visibility_off" : "visibility"}
                                    </IconButton>

                                    <IconButton
                                        outlined={settings.data.standardUserGroup?.id !== group.id}
                                        onClick={() => handleSetStandardGroup(group)}
                                        disabled={group.hidden}
                                    >
                                        favorite
                                    </IconButton>

                                    <IconButton
                                        onClick={() => handleChangePosition(group, -1)}
                                        disabled={index === 0}
                                    >
                                        expand_less
                                    </IconButton>

                                    <IconButton
                                        onClick={() => handleChangePosition(group, 1)}
                                        disabled={index === userGroups.data?.length - 1}
                                    >
                                        expand_more
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
