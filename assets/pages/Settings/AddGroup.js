/***************************************
 * ./assets/pages/Settings/AddGroup.js *
 ***************************************/

import React, { useEffect, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import axios from 'axios';

import Heading, { SubHeading } from '../../components/ui/Heading';
import Spinner from '../../components/ui/Spinner';
import { InputLabel, InputRow } from '../../components/form/Input';
import Button from '../../components/ui/Buttons/Button';
import IconButton from '../../components/ui/Buttons/IconButton';
import HeadingAndBackButton from '../../components/ui/HeadingAndBackButton';

/**
 * AddGroup
 * 
 * @component
 * @property {function} setSidebarActiveItem
 * @property {function} setSidebarActionButton
 * @property {function} setLoadingUserGroups
 */
export default function AddGroup(props) {
    /**
     * State variables
     */
    const [users, setUsers] = useState([]);
    const [isLoadingUsers, setLoadingUsers] = useState(true);
    const [isLoadingSubmit, setLoadingSubmit] = useState(false);
    const [isSubmitted, setSubmitted] = useState(false);

    /**
     * Load User data into state when isLoadingUsers
     * is true, e.g. on first render.
     */
    useEffect(() => {
        if (!isLoadingUsers) return;

        axios
            .get('/api/user/list')
            .then(response => {
                setUsers(JSON.parse(response.data));
                setLoadingUsers(false);
            })
        ;
    }, [isLoadingUsers]);

    /**
     * handleSubmit
     * 
     * Submits the form data to the UserGroup Add API.
     * 
     * @param {*} event
     */
    const handleSubmit = (event) => {
        const formData = new FormData(event.target);
        event.preventDefault();

        setLoadingSubmit(true);

        axios
            .post('/api/usergroups/add', formData)
            .then(() => {
                setSubmitted(true); 
                props.setLoadingUserGroups(true); 
            })
        ;
    };

    /**
     * Load sidebar
     */
    useEffect(() => {
        props.setSidebarActiveItem();
        props.setSidebarActionButton();
    }, []);

    /** 
     * Render
     * 
     * @todo UserGroup - Avatars?
     */
    return (
        <>
            {isSubmitted && <Navigate to={'/settings'} />}

            <div className="px-6 pb-24 pt-6 md:pb-6 md:my-6 md:mr-6 w-full min-h-screen md:min-h-fit bg-white dark:bg-[#29353f] md:rounded-3xl md:w-[450px]">
                {isLoadingSubmit ? (
                    <Spinner />
                ) : (
                    <>
                        <HeadingAndBackButton location="/settings">Neue Benutzergruppe hinzufügen</HeadingAndBackButton>
                        
                        <p className="mb-6 text-sm text-gray-600 dark:text-gray-300">
                            Hier kannst du eine neue Benutzergruppen hinzufügen. Die Liste von 
                            Material Symbols findest du <a target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-400 transition duration-300" href="https://fonts.google.com/icons?icon.style=Rounded&icon.set=Material+Symbols">hier</a>.
                        </p>

                        <form name="user_group" onSubmit={handleSubmit}>
                            <InputRow
                                id="user_group_name"
                                label="Name der Benutzergruppe"
                                inputProps={{ 
                                    required: 'required', 
                                    maxLength: 64, 
                                    placeholder: 'Name der Benutzergruppe',
                                }}
                            />

                            <InputRow
                                id="user_group_icon"
                                label="Icon der Benutzergruppe (optional)"
                                inputProps={{ 
                                    required: 'required', 
                                    maxLength: 255, 
                                    placeholder: 'Material-Symbols-Bezeichnung, z.B. face_5',
                                }}
                            />

                            <div className="mb-6">
                                <InputLabel id="user_group_users" label="Welche Benutzer sollen zur Gruppe gehören?" />
                                <select 
                                    defaultValue={[]} 
                                    id="user_group_users" 
                                    name="user_group[users][]"
                                    className="dark:placeholder-gray-400 dark:bg-[#1D252C] border border-gray-300 dark:border-none 
                                        rounded-3xl px-6 shadow-sm dark:shadow-md w-full transition duration-300 focus:border-blue-600 overflow-hidden"
                                    multiple 
                                    required
                                >
                                    {users?.map(user => 
                                        <option key={user.id} value={user.value}>{user.username}</option>
                                    )}

                                    {isLoadingUsers &&
                                        <option>Benutzer werden geladen ...</option>
                                    }
                                </select>
                            </div>

                            <div className="flex justify-end">
                                <Button
                                    type="submit" 
                                    icon="group_add" 
                                    label="Hinzufügen" 
                                    elevated={true}
                                    floating={true}
                                />
                            </div>
                        </form>
                    </>
                )}
            </div>
        </>
    );
}
