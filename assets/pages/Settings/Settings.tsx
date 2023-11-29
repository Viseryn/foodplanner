import axios, { AxiosResponse } from 'axios'
import React, { ReactElement, useEffect } from 'react'
import swal from 'sweetalert'

import SwitchRow from '@/components/form/Switch/SwitchRow'
import Button from '@/components/ui/Buttons/Button'
import IconButton from '@/components/ui/Buttons/IconButton'
import Card from '@/components/ui/Card'
import Heading from '@/components/ui/Heading'
import Spacer from '@/components/ui/Spacer'
import Spinner from '@/components/ui/Spinner'
import DayModel from '@/types/DayModel'
import MealCategoryModel from '@/types/MealCategoryModel'
import SettingsModel from '@/types/SettingsModel'
import { UserGroupModel } from '@/types/UserGroupModel'
import InstallationStatusModel from '@/types/InstallationStatusModel'
import { tryApiRequest } from '@/util/tryApiRequest'

export function Settings({ settings, userGroups, mealCategories, days, setSidebar, setTopbar, installationStatus }: {
    settings: EntityState<SettingsModel>
    userGroups: EntityState<Array<UserGroupModel>>
    mealCategories: EntityState<Array<MealCategoryModel>>
    days: EntityState<Array<DayModel>>
    setSidebar: SetSidebarAction
    setTopbar: SetTopbarAction
    installationStatus: EntityState<InstallationStatusModel>
}): ReactElement {
    const handleChangeGroupVisibility = async (userGroup: UserGroupModel): Promise<void> => {
        const apiUrl: string = `/api/usergroups/${userGroup.id}`

        await tryApiRequest("PATCH", apiUrl, async (): Promise<AxiosResponse<any, any>> => {
            const response: AxiosResponse<any, any> = await axios.patch(apiUrl, { hidden: !userGroup.hidden })

            userGroups.load()
            days.load()

            return response
        })
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

    const handleSetStandardMealCategory = async (mealCategory: MealCategoryModel): Promise<void> => {
        const apiUrl: string = `/api/settings/${settings.data.id}`

        await tryApiRequest("PATCH", apiUrl, async (): Promise<AxiosResponse<SettingsModel>> => {
            const response: AxiosResponse<SettingsModel> = await axios.patch(apiUrl, {
                standardMealCategory: mealCategory
            })

            settings.setData(response.data)
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
                days.load()

                return response
            })
        }
    }

    const handlePantrySettings = async (): Promise<void> => {
        const apiUrl: string = `/api/settings/${settings.data.id}`

        await tryApiRequest("PATCH", apiUrl, async (): Promise<AxiosResponse<SettingsModel>> => {
            const response: AxiosResponse<SettingsModel> = await axios.patch(apiUrl, {
                showPantry: !settings.data.showPantry
            })

            settings.setData(response.data)
            return response
        })
    }

    useEffect(() => {
        setSidebar()
        setTopbar({
            title: 'Einstellungen',
        })

        window.scrollTo(0, 0)
    }, [])

    // Render Settings
    return (
        <div className="pb-24 md:pb-4 md:w-[450px]">
            <Spacer height="6" />

            <div className="mx-4 md:mx-0">
                <Heading size="xl" style="pl-2 mb-2">Über FoodPlanner</Heading>
                <Card>
                    {installationStatus.isLoading ? (
                        <Spinner />
                    ) : (
                        <>
                            <div className="flex items-center">
                                <div className="">
                                    <img src="/img/favicon.png" className="mx-auto"  alt="FoodPlanner Favicon" />
                                </div>
                                <div className="text-sm ml-4">
                                    <div className="font-semibold">FoodPlanner</div>
                                    <div className="text-xs">
                                        <a
                                            href={`https://github.com/Viseryn/foodplanner/releases/tag/${installationStatus.data.version}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            {installationStatus.data.version}
                                        </a>
                                    </div>
                                </div>
                            </div>
                            <div className="text-xs mt-4">
                                &copy; 2023 Kevin Sporbeck
                            </div>
                        </>
                    )}
                </Card>

                <Spacer height="10" />

                <Heading size="xl" style="pl-2 mb-2">Vorratskammer anzeigen</Heading>
                <Card>
                    <p className="text-sm">
                        Hier kannst du auswählen, ob die Vorratskammer in der Navigationsleiste (links bzw. unten) angezeigt werden soll oder nicht. Damit verbundene Funktionen werden dann ebenfalls ein- oder ausgeblendet.
                    </p>

                    <Spacer height="4" />

                    {settings.isLoading ? (
                        <Spinner />
                    ) : (
                        <SwitchRow
                            id="showPantry"
                            label={'Vorratskammer wird ' + (!settings.data.showPantry ? 'nicht ' : '') + 'angezeigt'}
                            checked={settings.data.showPantry}
                            {...{
                                onClick: handlePantrySettings
                            }}
                        />
                    )}
                </Card>

                <Spacer height="10" />

                <Heading size="xl" style="pl-2 mb-2">Benutzergruppen verwalten</Heading>
                <Card>
                    <p className="text-sm">
                        Hier kannst du neue Benutzergruppen hinzufügen, bestehende Gruppen entfernen und eine Standardgruppe für neue Mahlzeiten festlegen.
                    </p>

                    <Spacer height="4" />

                    {userGroups.isLoading || settings.isLoading ? (
                        <Spinner />
                    ) : (
                        <>
                            <div className="space-y-2">
                                {userGroups.data.map((group, index) => 
                                    <div key={index} className="flex justify-between items-center">
                                        <div className="flex items-center">
                                            <span className="material-symbols-rounded mr-4">{group.icon}</span>
                                            {group.name}
                                            &nbsp;
                                            {group.users.length > 1 &&
                                                <>({group.users.map(user => user.username).join(', ')})</>
                                            }
                                        </div>
                                        <div className="flex gap-2">
                                            <IconButton 
                                                outlined={true} 
                                                onClick={() => handleDeleteGroup(index)}
                                            >
                                                delete
                                            </IconButton>

                                            <IconButton
                                                outlined={settings.data.standardUserGroup?.id !== group.id}
                                                onClick={() => handleSetStandardGroup(group)}
                                            >
                                                favorite
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
                </Card>

                <Spacer height="10" />

                <Heading size="xl" style="pl-2 mb-2">Standardzeit für Mahlzeiten</Heading>
                <Card>
                    <p className="text-sm">
                        Hier kannst du auswählen, welche Tageszeit standardmäßig für neue Mahlzeiten ausgewählt ist.
                    </p>

                    <Spacer height="4" />

                    {mealCategories.isLoading || settings.isLoading ? (
                        <Spinner />
                    ) : (
                        <div className="space-y-2">
                            {mealCategories.data.map((category, index) => 
                                <div key={category.id} className="flex justify-between items-center">
                                    <div className="flex items-center">
                                        <span className="material-symbols-rounded outlined mr-4">{category.icon}</span>
                                        {category.name}
                                    </div>
                                        <IconButton 
                                            outlined={settings.data.standardMealCategory?.id !== category.id}
                                            onClick={() => handleSetStandardMealCategory(category)}>
                                            favorite
                                        </IconButton>
                                </div>
                            )}
                        </div>
                    )}
                </Card>
            </div>
        </div>
    )
}
