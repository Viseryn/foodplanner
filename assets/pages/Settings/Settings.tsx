/****************************************
 * ./assets/pages/Settings/Settings.tsx *
 ****************************************/

import React, { useEffect } from 'react'
import axios                from 'axios'

import Switch               from '../../components/form/Switch'
import Button               from '../../components/ui/Buttons/Button'
import IconButton           from '../../components/ui/Buttons/IconButton'
import Card                 from '../../components/ui/Card'
import { SecondHeading }    from '../../components/ui/Heading'
import Spacer               from '../../components/ui/Spacer'
import Spinner              from '../../components/ui/Spinner'
 
/**
 * Settings
 * 
 * A component that renders some user-specific as 
 * well as global settings.
 * 
 * @component
 * @param {object} props
 * @param {function} props.setSidebar
 * @param {function} props.setTopbar
 * @param {object} props.settings
 * @param {object} props.userGroups
 * @param {object} props.mealCategories
 * @param {object} props.days
 */
export default function Settings({ settings, userGroups, mealCategories, ...props }) {
    /**
     * handleSetStandardGroup
     * 
     * Changes the standard UserGroup to the one selected 
     * and updates the UserGroups in the database via 
     * the UserGroups Update Standard API.
     * 
     * @param {number} index The index of the group that shall be the standard group.
     */
    const handleSetStandardGroup = (index) => {
        let groups = [...userGroups.data]

        groups?.forEach((group, i) => {
            if (index === i) {
                group.isStandard = true
                group.checked = 'checked'
            } else {
                group.isStandard = false
                group.checked = ''
            }
        })

        userGroups.setData(groups)
        axios.post('/api/usergroups/standard', JSON.stringify(groups))
                
        // Refresh Data Timestamp
        axios.get('/api/refresh-data-timestamp/set')
    }

    /**
     * handleSetStandardMealCategory
     * 
     * Changes the standard MealCategory to the one selected 
     * and updates the MealCategories in the database via 
     * the MealCategory Update Standard API.
     * 
     * @param {number} index The index of the category that shall be the standard category.
     */
    const handleSetStandardMealCategory = (index) => {
        let categories = [...mealCategories.data]

        categories?.forEach((category, i) => {
            if (index === i) {
                category.isStandard = true
                category.checked = 'checked'
            } else {
                category.isStandard = false
                category.checked = ''
            }
        })

        mealCategories.setData(categories)
        axios.post('/api/mealcategories/standard', JSON.stringify(categories))
                
        // Refresh Data Timestamp
        axios.get('/api/refresh-data-timestamp/set')
    }

    /**
     * handleDeleteGroup
     * 
     * When called, opens a SweetAlert. If it is confirmed,
     * then the UserGroup Delete API is called and the groups 
     * are updated. If cancelled, nothing happens.
     * 
     * @param {number} index The index of the UserGroup that should be deleted.
     */
    const handleDeleteGroup = (index) => {
        // Get id
        let id = 0

        userGroups.data?.forEach((group, i) => {
            if (index === i) {
                id = userGroups.data?.[i].value
            }
        })

        // Show warning with confirm and cancel buttons
        swal({
            dangerMode: true,
            icon: 'error',
            title: 'Benutzergruppe wirklich löschen?',
            buttons: {
                cancel: 'Abbrechen',
                confirm: 'Löschen',
            },
        }).then(confirm => {
            // Cancel if not confirmed
            if (!confirm) return

            // Cancel if there is only one UserGroup left
            if (userGroups.data?.length <= 1) {
                swal({
                    dangerMode: true,
                    icon: 'error',
                    title: 'Benutzergruppe konnte nicht gelöscht werden.',
                    text: 'Bitte erstelle zunächst eine andere Benutzergruppe, bevor du diese hier löschst.',
                    buttons: {
                        confirm: 'Okay',
                    },
                })

                return
            }

            // Cancel if the given group is standard
            if (userGroups.data?.[index].isStandard) {
                swal({
                    dangerMode: true,
                    icon: 'error',
                    title: 'Benutzergruppe konnte nicht gelöscht werden.',
                    text: 'Du kannst die Standardgruppe nicht löschen.',
                    buttons: {
                        confirm: 'Okay',
                    },
                })

                return
            }

            // Call UserGroup Delete API if alert was confirmed and 
            // the group is not the last one or the standard group.
            axios
                .get('/api/usergroups/delete/' + id)
                .then(() => {
                    userGroups.setLoading(true)
                    props.days.setLoading(true)
                
                    // Refresh Data Timestamp
                    axios.get('/api/refresh-data-timestamp/set')
                })
        })
    }

    /**
     * handlePantrySettings
     * 
     * Updates the showPantry property of the Settings object.
     * After each update, the Update Pantry Settings API will 
     * be called (as long as the Settings are not loading).
     */
    const handlePantrySettings = (e) => {
        settings.setData({ 
            ...settings.data,
            showPantry: !settings.data.showPantry,
        })
    }

    /**
     * When settings data changes, call Settings API.
     */
    useEffect(() => {
        if (settings.isLoading) {
            return
        }

        axios.post('/api/settings/pantry', JSON.stringify(settings.data))
    }, [settings.data])

    /**
     * Load layout
     */
    useEffect(() => {
        // Load sidebar
        props.setSidebar()

        // Load topbar
        props.setTopbar({
            title: 'Einstellungen',
        })

        // Scroll to top
        window.scrollTo(0, 0)
    }, [])

    /** 
     * Render Settings
     */
    return (
        <div className="pb-24 md:pb-4 md:w-[450px]">
            <Spacer height="6" />

            <div className="mx-4 md:mx-0">
                <SecondHeading style="pl-2 mb-2">Vorratskammer anzeigen</SecondHeading>
                <Card>
                    <p className="text-sm">
                        Hier kannst du auswählen, ob die Vorratskammer in der Navigationsleiste (links bzw. unten) angezeigt werden soll oder nicht. Damit verbundene
                        Funktionen werden dann ebenfalls ein- oder ausgeblendet.
                    </p>

                    <Spacer height="4" />

                    <label htmlFor="showPantry" className="inline-flex items-center relative cursor-pointer">
                        <input 
                            type="checkbox" 
                            id="showPantry" 
                            name="showPantry" 
                            className="sr-only peer" 
                            value={settings.data?.showPantry} 
                            checked={settings.data?.showPantry ? 'checked' : ''} 
                            onChange={handlePantrySettings} 
                        />
                        <Switch />

                        <span className="ml-3 text-sm font-semibold">
                            Vorratskammer wird {!settings.data?.showPantry && ' nicht '} angezeigt
                        </span>
                    </label>
                </Card>

                <Spacer height="10" />

                <SecondHeading style="pl-2 mb-2">Benutzergruppen verwalten</SecondHeading>
                <Card>
                    <p className="text-sm">
                        Hier kannst du neue Benutzergruppen hinzufügen, bestehende Gruppen entfernen und eine Standardgruppe für neue Mahlzeiten festlegen.
                    </p>

                    <Spacer height="4" />

                    {props.authentication.isLoading ? (
                        <Spinner />
                    ) : (
                        (userGroups.isLoading ? (
                            <Spinner />
                        ) : (
                            <>
                                <div className="space-y-2">
                                    {userGroups.data?.map((group, index) => 
                                        <div key={index} className="flex justify-between items-center">
                                            <div className="flex items-center">
                                                <span className="material-symbols-rounded mr-4">{group.icon}</span>
                                                {group.name} ({group.users.join(', ')})
                                            </div>
                                            <div className="flex gap-2">
                                                <IconButton outlined="outlined" onClick={() => handleDeleteGroup(index)}>delete</IconButton>
                                                <IconButton outlined={group.isStandard ? '' : 'outlined'} onClick={() => handleSetStandardGroup(index)}>favorite</IconButton>
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
                                        small={true}
                                    />
                                </div>
                            </>
                        ))
                    )}
                </Card>

                <Spacer height="10" />

                <SecondHeading style="pl-2 mb-2">Standardzeit für Mahlzeiten</SecondHeading>
                <Card>
                    <p className="text-sm">
                        Hier kannst du auswählen, welche Tageszeit standardmäßig für neue Mahlzeiten ausgewählt ist.
                    </p>

                    <Spacer height="4" />

                    {props.authentication.isLoading ? (
                        <Spinner />
                    ) : (
                        (mealCategories.isLoading ? (
                            <Spinner />
                        ) : (
                            <div className="space-y-2">
                                {mealCategories.data?.map((category, index) => 
                                    <div key={category.id} className="flex justify-between items-center">
                                        <div className="flex items-center">
                                            <span className="material-symbols-rounded outlined mr-4">{category.icon}</span>
                                            {category.name}
                                        </div>
                                            <IconButton outlined={category.isStandard ? '' : 'outlined'} onClick={() => handleSetStandardMealCategory(index)}>favorite</IconButton>
                                    </div>
                                )}
                            </div>
                        ))
                    )}
                </Card>
            </div>
        </div>
    )
}
