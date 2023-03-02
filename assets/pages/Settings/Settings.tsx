/****************************************
 * ./assets/pages/Settings/Settings.tsx *
 ****************************************/

import axios from 'axios'
import React, { useEffect } from 'react'
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
import UserGroupModel from '@/types/UserGroupModel'
 
/**
 * A component that renders some user-specific as well as global settings.
 * 
 * @component
 */
export default function Settings({ settings, userGroups, mealCategories, days, setSidebar, setTopbar }: {
    settings: EntityState<SettingsModel>
    userGroups: EntityState<Array<UserGroupModel>>
    mealCategories: EntityState<Array<MealCategoryModel>>
    days: EntityState<Array<DayModel>>
    setSidebar: SetSidebarAction
    setTopbar: SetTopbarAction
}): JSX.Element {
    /**
     * Changes the standard UserGroup to the one selected and updates the 
     * UserGroups in the database via the UserGroups Update Standard API.
     * 
     * @param index The index of the group that shall be the standard group.
     */
    const handleSetStandardGroup = (index: number): void => {
        let groups: Array<UserGroupModel> = [...userGroups.data]

        groups.forEach((group, i) => {
            group.standard = (index === i)
        })

        userGroups.setData(groups)
        axios.post('/api/usergroups/standard', JSON.stringify(groups))
    }

    /**
     * Changes the standard MealCategory to the one selected and updates the 
     * MealCategories in the database via the MealCategory Update Standard API.
     * 
     * @param index The index of the category that shall be the standard category.
     */
    const handleSetStandardMealCategory = (index: number): void => {
        let categories: Array<MealCategoryModel> = [...mealCategories.data]

        categories.forEach((category, i) => {
            category.standard = (index === i)
        })

        mealCategories.setData(categories)
        axios.post('/api/mealcategories/standard', JSON.stringify(categories))
    }

    /**
     * When called, opens a SweetAlert. If it is confirmed, then the UserGroup Delete API 
     * is called and the groups are updated. If cancelled, nothing happens.
     * 
     * @param index The index of the UserGroup that shall be deleted.
     */
    const handleDeleteGroup = (index: number): void => {
        // Get id
        const id: number = userGroups.data[index].id ?? -1

        // Show warning with confirm and cancel buttons
        swal({
            dangerMode: true,
            icon: 'error',
            title: 'Benutzergruppe wirklich löschen?',
            buttons: {
                cancel: { text: 'Abbrechen' },
                confirm: { text: 'Löschen' },
            },
        }).then(confirm => {
            // Cancel if not confirmed
            if (!confirm) {
                return
            }

            // Cancel if there is only one UserGroup left
            if (userGroups.data.length <= 1) {
                swal({
                    dangerMode: true,
                    icon: 'error',
                    title: 'Benutzergruppe konnte nicht gelöscht werden.',
                    text: 'Bitte erstelle zunächst eine andere Benutzergruppe, bevor du diese hier löschst.',
                    buttons: {
                        confirm: { text: 'Okay' },
                    },
                })

                return
            }

            // Cancel if the given group is standard
            if (userGroups.data[index].standard) {
                swal({
                    dangerMode: true,
                    icon: 'error',
                    title: 'Benutzergruppe konnte nicht gelöscht werden.',
                    text: 'Du kannst die Standardgruppe nicht löschen.',
                    buttons: {
                        confirm: { text: 'Okay' },
                    },
                })

                return
            }

            // Call UserGroup Delete API if alert was confirmed and 
            // the group is not the last one or the standard group.
            axios
                .get('/api/usergroups/delete/' + id)
                .then(() => {
                    userGroups.load()
                    days.load()
                })
        })
    }

    /**
     * Updates the showPantry property of the Settings object. After each update, the 
     * Update Pantry Settings API will  be called (as long as the Settings are not loading).
     */
    const handlePantrySettings = (): void => {
        settings.setData({ 
            ...settings.data,
            showPantry: !settings.data.showPantry,
        })
    }

    // When settings data changes, call Settings API.
    useEffect(() => {
        if (settings.isLoading) {
            return
        }

        axios.post('/api/settings/pantry', JSON.stringify(settings.data))
    }, [settings.data])

    // Load layout
    useEffect(() => {
        setSidebar()
        setTopbar({
            title: 'Einstellungen',
        })

        // Scroll to top
        window.scrollTo(0, 0)
    }, [])

    // Render Settings
    return (
        <div className="pb-24 md:pb-4 md:w-[450px]">
            <Spacer height="6" />

            <div className="mx-4 md:mx-0">
                <Heading size="xl" style="pl-2 mb-2">Vorratskammer anzeigen</Heading>
                <Card>
                    <p className="text-sm">
                        Hier kannst du auswählen, ob die Vorratskammer in der Navigationsleiste (links bzw. unten) angezeigt werden soll oder nicht. Damit verbundene Funktionen werden dann ebenfalls ein- oder ausgeblendet.
                    </p>

                    <Spacer height="4" />

                    <SwitchRow 
                        id="showPantry"
                        label={'Vorratskammer wird ' + (!settings.data.showPantry ? 'nicht ' : '') + 'angezeigt'}
                        checked={settings.data.showPantry}
                        {...{
                            onClick: handlePantrySettings
                        }}
                    />
                </Card>

                <Spacer height="10" />

                <Heading size="xl" style="pl-2 mb-2">Benutzergruppen verwalten</Heading>
                <Card>
                    <p className="text-sm">
                        Hier kannst du neue Benutzergruppen hinzufügen, bestehende Gruppen entfernen und eine Standardgruppe für neue Mahlzeiten festlegen.
                    </p>

                    <Spacer height="4" />

                    {userGroups.isLoading ? (
                        <Spinner />
                    ) : (
                        <>
                            <div className="space-y-2">
                                {userGroups.data.map((group, index) => 
                                    <div key={index} className="flex justify-between items-center">
                                        <div className="flex items-center">
                                            <span className="material-symbols-rounded mr-4">{group.icon}</span>
                                            {group.name} ({group.users.map(user => user.username).join(', ')})
                                        </div>
                                        <div className="flex gap-2">
                                            <IconButton 
                                                outlined={true} 
                                                onClick={() => handleDeleteGroup(index)}
                                            >
                                                delete
                                            </IconButton>

                                            <IconButton 
                                                outlined={!group.standard} 
                                                onClick={() => handleSetStandardGroup(index)}
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

                    {mealCategories.isLoading ? (
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
                                            outlined={!category.standard} 
                                            onClick={() => handleSetStandardMealCategory(index)}>
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
