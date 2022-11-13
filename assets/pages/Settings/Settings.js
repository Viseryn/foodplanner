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

    useEffect(() => {
        props.setSidebarActiveItem();
        props.setSidebarActionButton();
    }, []);

    useEffect(() => {
        if (! isLoadingUserGroups) return;

        axios
            .get('/api/usergroups')
            .then(response => {
                setUserGroups(JSON.parse(response.data));
                setLoadingUserGroups(false);
            })
        ;
    }, [isLoadingUserGroups]);

    const handleSetStandard = (index) => {
        return;
    };

    /** 
     * Render
     * 
     * @todo UserGroup - which one is standard? Avatars?
     */
    return (
        <>
            <div className="px-6 pb-24 pt-6 md:pb-6 md:my-6 md:mr-6 w-full min-h-screen md:min-h-fit bg-white dark:bg-[#29353f] md:rounded-3xl md:w-[450px]">
                <Heading>Einstellungen</Heading>

                {props.isLoadingUser ? (
                    <Spinner />
                ) : (
                    <>
                        {props.user?.username !== undefined ? (
                            <>
                                <SubHeading className="mb-0">Gruppen verwalten</SubHeading>
                                
                                {isLoadingUserGroups ? (
                                    <Spinner />
                                ) : (
                                    <div className="space-y-2">
                                        {userGroups.map((group, index) => 
                                            <div key={group.id} className="rounded-full p-2 flex justify-between items-center transition duration-300 hover:bg-gray-100 dark:hover:bg-[#252f38]">
                                                <div className="pl-4">
                                                    {group.name} ({group.users})
                                                </div>
                                                <div className="flex gap-2">
                                                    <Link to={'/settings/groups/' + group.id}><IconButton>drive_file_rename_outline</IconButton></Link>
                                                    <IconButton onClick={() => handleSetStandard(index)}>{group.isStandard ? 'check_box' : 'check_box_outline_blank'}</IconButton>
                                                </div>
                                            </div>
                                        )}
                                        <Link 
                                            className="rounded-full p-2 pl-6 h-14 w-full flex items-center transition duration-300 hover:bg-gray-100 dark:hover:bg-[#252f38]" 
                                            to="/settings/groups/add"
                                        >
                                            <span>Neue Gruppe hinzufügen</span>
                                        </Link>
                                    </div>
                                )}
                            </>
                        ) : (
                            <Navigate to="/login" />
                        )}
                    </>
                )}
            </div>
        </>
    );
}

function IconButton(props) {
    return (
        <span {...props} className="material-symbols-rounded cursor-pointer transition duration-300 hover:bg-gray-200 dark:hover:bg-[#232325] p-2 rounded-full">
            {props.children}
        </span>
    );
}