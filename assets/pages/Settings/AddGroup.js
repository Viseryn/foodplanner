/***************************************
 * ./assets/pages/Settings/AddGroup.js *
 ***************************************/

import React, { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import axios from 'axios'

import { InputLabel, InputRow } from '../../components/form/Input'
import Button                   from '../../components/ui/Buttons/Button'
import Card                     from '../../components/ui/Card'
import Spacer                   from '../../components/ui/Spacer'
import Spinner                  from '../../components/ui/Spinner'

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
    const [users, setUsers] = useState([])
    const [isLoadingUsers, setLoadingUsers] = useState(true)
    const [isLoadingSubmit, setLoadingSubmit] = useState(false)
    const [isSubmitted, setSubmitted] = useState(false)

    /**
     * Load User data into state when isLoadingUsers
     * is true, e.g. on first render.
     */
    useEffect(() => {
        if (!isLoadingUsers) return

        axios
            .get('/api/user/list')
            .then(response => {
                setUsers(JSON.parse(response.data))
                setLoadingUsers(false)
            })
        
    }, [isLoadingUsers])

    /**
     * handleSubmit
     * 
     * Submits the form data to the UserGroup Add API.
     * 
     * @param {*} event
     */
    const handleSubmit = (event) => {
        const formData = new FormData(event.target)
        event.preventDefault()

        setLoadingSubmit(true)

        axios
            .post('/api/usergroups/add', formData)
            .then(() => {
                setSubmitted(true) 
                props.setLoadingUserGroups(true) 
                
                // Refresh Data Timestamp
                axios.get('/api/refresh-data-timestamp/set')
            })
        
    }

    /**
     * Load layout
     */
    useEffect(() => {
        // Load sidebar
        props.setSidebarActiveItem()
        props.setSidebarActionButton()

        // Load Topbar
        props.setTopbar({
            title: 'Neue Benutzergruppe',
            showBackButton: true,
            backButtonPath: '/settings',
        })

        // Scroll to top
        window.scrollTo(0, 0)
    }, [])

    /** 
     * Render
     * 
     * @todo UserGroup - Avatars?
     */
    return (
        <>
            {isSubmitted && <Navigate to={'/settings'} />}

            <div className="pb-24 md:pb-4 md:w-[450px]">
                <Spacer height="6" />

                {isLoadingSubmit ? (
                    <Spinner />
                ) : (
                    <div className="mx-4 md:mx-0">
                        <form name="user_group" onSubmit={handleSubmit}>
                            <Card>
                                <p className="text-sm">
                                    Hier kannst du eine neue Benutzergruppen hinzufügen. Die Liste von 
                                    Material Symbols findest du <a target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-400 transition duration-300" href="https://fonts.google.com/icons?icon.style=Rounded&icon.set=Material+Symbols">hier</a>.
                                </p>

                                <Spacer height="6" />

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

                                <div>
                                    <InputLabel id="user_group_users" label="Welche Benutzer sollen zur Gruppe gehören?" />
                                    <select 
                                        defaultValue={[]} 
                                        id="user_group_users" 
                                        name="user_group[users][]"
                                        className="dark:placeholder-secondary-dark-900 dark:bg-secondary-dark-200 border border-gray-300 dark:border-none rounded-md px-6 w-full transition duration-300 focus:border-primary-100 overflow-hidden"
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
                            </Card>

                            <div className="flex justify-end md:mt-4 pb-[5.5rem] md:pb-0">
                                <Button
                                    type="submit" 
                                    icon="save" 
                                    label="Speichern" 
                                    outlined={true}
                                    elevated={true}
                                    floating={true}
                                />
                            </div>
                        </form>
                    </div>
                )}
            </div>
        </>
    )
}
