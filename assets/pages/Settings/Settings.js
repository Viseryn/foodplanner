/***************************************
 * ./assets/pages/Settings/Settings.js *
 ***************************************/

import React, { useEffect } from 'react';
import { Link, Navigate } from 'react-router-dom';
import axios from 'axios';

import Heading, { SubHeading } from '../../components/ui/Heading';
import Spinner from '../../components/ui/Spinner';
import IconButton from '../../components/ui/IconButton';
 
/**
 * Settings
 * 
 * @component
 * @property {function} setSidebarActiveItem
 * @property {function} setSidebarActionButton
 * @property {arr} user
 * @property {function} setUser
 * @property {boolean} isLoadingUser
 * @property {function} setLoadingUser
 * @property {arr} userGroups
 * @property {function} setUserGroups
 * @property {boolean} isLoadingUserGroups
 * @property {function} setLoadingUserGroups
 * @property {arr} mealCategories
 * @property {function} setMealCategories
 * @property {boolean} isLoadingMealCategories
 * @property {function} setLoadingMealCategories
 * @property {arr} days 
 * @property {boolean} isLoadingDays
 * @property {function} setLoadingDays
 */
export default function Settings(props) {
    /**
     * Load sidebar
     */
    useEffect(() => {
        props.setSidebarActiveItem();
        props.setSidebarActionButton();
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
        axios.post('/api/usergroups/update-standard', JSON.stringify(groups));
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
        axios.post('/api/mealcategories/update-standard', JSON.stringify(categories));
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
     * Render
     * 
     * @todo UserGroup - Avatars?
     */
    return (
        <div className="px-6 pb-24 pt-6 md:pb-6 md:my-6 md:mr-6 w-full min-h-screen md:min-h-fit bg-white dark:bg-[#29353f] md:rounded-3xl md:w-[450px]">
            <Heading>Einstellungen</Heading>

            <SubHeading>Benutzergruppen verwalten</SubHeading>
            <p className="mb-4 text-sm text-gray-600 dark:text-gray-300">
                Hier kannst du neue Benutzergruppen hinzufügen, bestehende Gruppen bearbeiten und eine Standardgruppe für neue Mahlzeiten festlegen.
            </p>

            {props.isLoadingUser ? (
                <Spinner />
            ) : (
                (props.isLoadingUserGroups ? (
                    <Spinner />
                ) : (
                    <div className="space-y-2">
                        {props.userGroups.map((group, index) => 
                            <div key={index} className="rounded-full p-2 flex justify-between items-center transition duration-300 hover:bg-gray-100 dark:hover:bg-[#252f38]">
                                <div className="pl-4 flex items-center">
                                    <span className="material-symbols-rounded mr-4">{group.icon}</span>
                                    {group.name} 
                                    {/* ({group.users.join(', ')}) */}
                                </div>
                                <div className="flex gap-2">
                                    <Link to={'/settings/groups/' + group.value}>
                                        <IconButton>drive_file_rename_outline</IconButton>
                                    </Link>
                                    <IconButton outlined="outlined" onClick={() => handleDeleteGroup(index)}>delete</IconButton>
                                    <IconButton outlined={group.isStandard ? '' : 'outlined'} onClick={() => handleSetStandardGroup(index)}>favorite</IconButton>
                                </div>
                            </div>
                        )}
                        <Link 
                            className="rounded-full p-2 pl-6 h-14 w-full flex items-center transition duration-300 hover:bg-gray-100 dark:hover:bg-[#252f38]" 
                            to="/settings/groups/add"
                        >
                            <span className="material-symbols-rounded mr-4">add</span>
                            <span>Neue Gruppe hinzufügen</span>
                        </Link>
                    </div>
                ))
            )}

            <div className="mb-10"></div>

            <SubHeading>Standardzeit für Mahlzeiten einstellen</SubHeading>
            <p className="mb-4 text-sm text-gray-600 dark:text-gray-300">
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
                            <div key={category.id} className="rounded-full p-2 flex justify-between items-center transition duration-300 hover:bg-gray-100 dark:hover:bg-[#252f38]">
                                <div className="pl-4 flex items-center">
                                    <span className="material-symbols-rounded outlined mr-4">{category.icon}</span>
                                    {category.name}
                                </div>
                                    <IconButton outlined={category.isStandard ? '' : 'outlined'} onClick={() => handleSetStandardMealCategory(index)}>favorite</IconButton>
                            </div>
                        )}
                    </div>
                ))
            )}
        </div>
    );
}
