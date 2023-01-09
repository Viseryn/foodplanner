/***************************************
 * ./assets/pages/Settings/Settings.js *
 ***************************************/

import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

import Heading, { SecondHeading } from '../../components/ui/Heading';
import Spinner from '../../components/ui/Spinner';
import IconButton from '../../components/ui/Buttons/IconButton';
import Spacer from '../../components/ui/Spacer';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Buttons/Button';
import Switch from '../../components/form/Switch';
 
/**
 * Settings
 * 
 * @component
 * @property {function} setSidebarActiveItem
 * @property {function} setSidebarActionButton
 * @property {boolean} isLoadingUser
 * @property {arr} userGroups
 * @property {function} setUserGroups
 * @property {boolean} isLoadingUserGroups
 * @property {function} setLoadingUserGroups
 * @property {arr} mealCategories
 * @property {function} setMealCategories
 * @property {boolean} isLoadingMealCategories
 * @property {function} setLoadingMealCategories
 * @property {function} setLoadingDays
 */
export default function Settings(props) {
    /**
     * Load sidebar
     */
    useEffect(() => {
        props.setSidebarActiveItem();
        props.setSidebarActionButton();

        // Scroll to top
        window.scrollTo(0, 0);
    }, []);

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
        let groups = [...props.userGroups];

        groups.forEach((group, i) => {
            if (index === i) {
                group.isStandard = true;
                group.checked = 'checked';
            } else {
                group.isStandard = false;
                group.checked = '';
            }
        });

        props.setUserGroups(groups);
        axios.post('/api/usergroups/standard', JSON.stringify(groups));
    };

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
        let categories = [...props.mealCategories];

        categories.forEach((category, i) => {
            if (index === i) {
                category.isStandard = true;
                category.checked = 'checked';
            } else {
                category.isStandard = false;
                category.checked = '';
            }
        });

        props.setMealCategories(categories);
        axios.post('/api/mealcategories/standard', JSON.stringify(categories));
    };

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
        let id = 0;

        props.userGroups.forEach((group, i) => {
            if (index === i) {
                id = props.userGroups[i].value;
            }
        });

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
            if (!confirm) return;

            // Cancel if there is only one UserGroup left
            if (props.userGroups.length <= 1) {
                swal({
                    dangerMode: true,
                    icon: 'error',
                    title: 'Benutzergruppe konnte nicht gelöscht werden.',
                    text: 'Bitte erstelle zunächst eine andere Benutzergruppe, bevor du diese hier löschst.',
                    buttons: {
                        confirm: 'Okay',
                    },
                });

                return;
            }

            // Cancel if the given group is standard
            if (props.userGroups[index].isStandard) {
                swal({
                    dangerMode: true,
                    icon: 'error',
                    title: 'Benutzergruppe konnte nicht gelöscht werden.',
                    text: 'Du kannst die Standardgruppe nicht löschen.',
                    buttons: {
                        confirm: 'Okay',
                    },
                });

                return;
            }

            // Call UserGroup Delete API if alert was confirmed and 
            // the group is not the last one or the standard group.
            axios
                .get('/api/usergroups/delete/' + id)
                .then(() => {
                    props.setLoadingUserGroups(true);
                    props.setLoadingDays(true);
                })
            ;
        });
    };

    /**
     * handlePantrySettings
     * 
     * Updates the showPantry property of the Settings object.
     * After each update, the Update Pantry Settings API will 
     * be called (as long as the Settings are not loading).
     */
    const handlePantrySettings = (e) => {
        props.setSettings({ 
            ...props.settings,
            showPantry: !props.settings.showPantry,
        });
    };

    useEffect(() => {
        if (props.isLoadingSettings) return;

        axios.post('/api/settings/pantry', JSON.stringify(props.settings));
    }, [props.settings]);

    /** 
     * Render
     * 
     * @todo UserGroup - Avatars?
     */
    return (
        <div className="pb-[6.5rem] px-4 md:pl-0 pt-4 md:pt-9 w-full md:w-[450px]">
            <div className="px-2 md:px-4">
                <Heading>Einstellungen</Heading>
            </div>

            <Spacer height="10" />

            <SecondHeading style="mx-2 md:mx-4 mb-4">Vorratskammer anzeigen</SecondHeading>
            <Card>
                <p className="mb-4 text-sm">
                    Hier kannst du auswählen, ob die Vorratskammer in der Navigationsleiste (links bzw. unten) angezeigt werden soll oder nicht. Damit verbundene
                    Funktionen werden dann ebenfalls ein- oder ausgeblendet.
                </p>

                <label htmlFor="showPantry" className="inline-flex items-center relative cursor-pointer">
                    <input type="checkbox" value={props.settings.showPantry} checked={props.settings.showPantry ? 'checked' : ''} id="showPantry" name="showPantry" className="sr-only peer" onChange={handlePantrySettings} />
                    <Switch />

                    <span className="ml-3 text-sm font-semibold">
                        Vorratskammer wird {!props.settings.showPantry && ' nicht '} angezeigt
                    </span>
                </label>
            </Card>

            <Spacer height="10" />

            <SecondHeading style="mx-2 md:mx-4 mb-4">Benutzergruppen verwalten</SecondHeading>
            <Card>
                <p className="mb-4 text-sm">
                    Hier kannst du neue Benutzergruppen hinzufügen, bestehende Gruppen entfernen und eine Standardgruppe für neue Mahlzeiten festlegen.
                </p>

                {props.isLoadingUser ? (
                    <Spinner />
                ) : (
                    (props.isLoadingUserGroups ? (
                        <Spinner />
                    ) : (
                        <>
                            <div className="space-y-2">
                                {props.userGroups.map((group, index) => 
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
                            
                            <Spacer height="6" />

                            <div className="flex justify-end">
                                <Button
                                    role="secondary"
                                    to="/settings/groups/add"
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

            <SecondHeading style="mx-2 md:mx-4 mb-4">Standardzeit für Mahlzeiten</SecondHeading>
            <Card>
                <p className="mb-4 text-sm">
                    Hier kannst du auswählen, welche Tageszeit standardmäßig für neue Mahlzeiten ausgewählt ist.
                </p>

                {props.isLoadingUser ? (
                    <Spinner />
                ) : (
                    (props.isLoadingMealCategories ? (
                        <Spinner />
                    ) : (
                        <div className="space-y-2">
                            {props.mealCategories.map((category, index) => 
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
    );
}
