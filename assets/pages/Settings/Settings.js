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

    const handleMakeStandard = (index) => {
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
                                    <table className="w-full">
                                        <tbody>
                                            {userGroups.map((group, index) =>
                                                <tr key={group.id} className="border-b dark:border-gray-800 transition duration-300 hover:bg-gray-100 dark:hover:bg-[#252f38]">
                                                    <td className={'p-4' + (index === 0 ? ' rounded-tl-2xl' : '')}>{group.name} ({group.users})</td>
                                                    <td className="p-4"><Link to={'/settings/group/' + group.id}>Bearbeiten</Link></td>
                                                    <td className={'p-4' + (index === 0 ? ' rounded-tr-2xl' : '')}><Link to="#" onClick={() => handleMakeStandard(index)}>Standard</Link></td>
                                                </tr>
                                            )}
                                            <tr className="dark:border-gray-800 transition duration-300 hover:bg-gray-100 dark:hover:bg-[#252f38]">
                                                <td colSpan="3" className="p-4 rounded-b-2xl"><Link to="/settings/groups/add">Neue Gruppe hinzufügen</Link></td>
                                            </tr>
                                        </tbody>
                                    </table>
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
