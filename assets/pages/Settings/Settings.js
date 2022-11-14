/***************************************
 * ./assets/pages/Settings/Settings.js *
 ***************************************/

import React, { useEffect, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import axios from 'axios';

import Heading, { SubHeading } from '../../components/ui/Heading';
import Spinner from '../../components/ui/Spinner';
 
/**
 * Settings
 * 
 * @component
 * @property {function} setSidebarActiveItem
 * @property {function} setSidebarActionButton
 * @property {arr} user
 * @property {boolean} isLoadingUser
 * @property {function} setLoadingUser
 * 
 * @todo This is NOT a safe security gate. Do this in the backend controllers!!!
 */
export default function Settings(props) {
    const [userGroups, setUserGroups] = useState([]);
    const [isLoadingUserGroups, setLoadingUserGroups] = useState(true);
    const [mealCategories, setMealCategories] = useState([]);
    const [isLoadingMealCategories, setLoadingMealCategories] = useState(true);

    useEffect(() => {
        props.setSidebarActiveItem();
        props.setSidebarActionButton();
    }, []);

    useEffect(() => {
        if (!isLoadingUserGroups) return;

        axios
            .get('/api/usergroups')
            .then(response => {
                setUserGroups(JSON.parse(response.data));
                setLoadingUserGroups(false);
            })
        ;
    }, [isLoadingUserGroups]);

    useEffect(() => {
        if (!isLoadingMealCategories) return;

        axios
            .get('/api/mealcategories')
            .then(response => {
                setMealCategories(JSON.parse(response.data));
                setLoadingMealCategories(false);
            })
        ;
    }, [isLoadingMealCategories]);

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
        let groups = [...userGroups];

        groups.forEach((group, i) => {
            if (index === i) {
                group.isStandard = true;
            } else {
                group.isStandard = false;
            }
        });

        setUserGroups(groups);
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
        let categories = [...mealCategories];

        categories.forEach((category, i) => {
            if (index === i) {
                category.standard = true;
            } else {
                category.standard = false;
            }
        });

        setMealCategories(categories);
        axios.post('/api/mealcategories/update-standard', JSON.stringify(categories));
    };

    const handleDeleteGroup = () => {

    };

    /** 
     * Render
     * 
     * @todo UserGroup - which one is standard? Avatars?
     */
    return (
        <>
            {/* {props.user?.username === undefined && (!isLoadingUserGroups && !isLoadingMealCategories) &&
                <Navigate to="/login" />
            } */}

            <div className="px-6 pb-24 pt-6 md:pb-6 md:my-6 md:mr-6 w-full min-h-screen md:min-h-fit bg-white dark:bg-[#29353f] md:rounded-3xl md:w-[450px]">
                <Heading>Einstellungen</Heading>

                <SubHeading>Benutzergruppen verwalten</SubHeading>
                <p className="mb-4 text-sm text-gray-600 dark:text-gray-300">
                    Hier kannst du neue Benutzergruppen hinzufügen, bestehende Gruppen bearbeiten und eine Standardgruppe für neue Mahlzeiten festlegen.
                </p>

                {props.isLoadingUser ? (
                    <Spinner />
                ) : (
                    (isLoadingUserGroups ? (
                        <Spinner />
                    ) : (
                        <div className="space-y-2">
                            {userGroups.map((group, index) => 
                                <div key={group.id} className="rounded-full p-2 flex justify-between items-center transition duration-300 hover:bg-gray-100 dark:hover:bg-[#252f38]">
                                    <div className="pl-4 flex items-center">
                                        <span className="material-symbols-rounded mr-4">{group.icon}</span>
                                        {group.name} 
                                        {/* ({group.users.join(', ')}) */}
                                    </div>
                                    <div className="flex gap-2">
                                        <Link to={'/settings/groups/' + group.id}>
                                            <IconButton>drive_file_rename_outline</IconButton>
                                        </Link>

                                        <IconButton outlined="outlined">delete</IconButton>

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

                {props.isLoadingMealCategories ? (
                    <Spinner />
                ) : (
                    (isLoadingMealCategories ? (
                        <Spinner />
                    ) : (
                        <div className="space-y-2">
                            {mealCategories.map((category, index) => 
                                <div key={category.id} className="rounded-full p-2 flex justify-between items-center transition duration-300 hover:bg-gray-100 dark:hover:bg-[#252f38]">
                                    <div className="pl-4 flex items-center">
                                        <span className="material-symbols-rounded outlined mr-4">{category.icon}</span>
                                        {category.name}
                                    </div>
                                    <div className="flex gap-2">
                                        <IconButton outlined={category.standard ? '' : 'outlined'} onClick={() => handleSetStandardMealCategory(index)}>favorite</IconButton>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>
        </>
    );
}

function IconButton(props) {
    return (
        <span {...props} className={'material-symbols-rounded cursor-pointer transition duration-300 hover:bg-gray-200 dark:hover:bg-[#232325] p-2 rounded-full' + (props.outlined == 'outlined' ? ' outlined' : '')}>
            {props.children}
        </span>
    );
}