/****************************************
 * ./assets/pages/Settings/AddGroup.tsx *
 ****************************************/

import React, { useEffect, useState }   from 'react'
import { useNavigate }                  from 'react-router-dom'
import axios                            from 'axios'

import { InputLabel, InputRow }         from '../../components/form/Input'
import Button                           from '../../components/ui/Buttons/Button'
import Card                             from '../../components/ui/Card'
import Spacer                           from '../../components/ui/Spacer'
import Spinner                          from '../../components/ui/Spinner'

import useFetch                         from '../../hooks/useFetch'

/**
 * AddGroup
 * 
 * A component that renders a form for adding new UserGroups.
 * 
 * @component
 * @param {object} props
 * @param {function} props.setSidebar
 * @param {function} props.setTopbar
 * @param {object} userGroups
 */
export default function AddGroup({ userGroups, ...props }) {
    /**
     * A list of all users.
     * 
     * @type {{
     *     data: object, 
     *     setData: function, 
     *     isLoading: boolean, 
     *     setLoading: function
     * }}
     */
    const users = useFetch('/api/user/list', props.authentication)

    /**
     * A function that can change the location.
     * Needed for the redirect after submit.
     * 
     * @type {NavigateFunction}
     */
    const navigate = useNavigate()

    /**
     * Whether the page is loading. Will be 
     * true while the form data is processed
     * by the API.
     * 
     * @type {[boolean, function]}
     */
    const [isLoading, setLoading] = useState(false)

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

        setLoading(true)

        axios
            .post('/api/usergroups/add', formData)
            .then(() => {
                // Refresh UserGroups
                userGroups.setLoading(true) 
                
                // Refresh Data Timestamp
                axios.get('/api/refresh-data-timestamp/set')

                // Navigate back to settings
                navigate('/settings')
            })
        
    }

    /**
     * Load layout
     */
    useEffect(() => {
        // Load sidebar
        props.setSidebar()

        // Load topbar
        props.setTopbar({
            title: 'Neue Benutzergruppe',
            showBackButton: true,
            backButtonPath: '/settings',
        })

        // Scroll to top
        window.scrollTo(0, 0)
    }, [])

    /** 
     * Render AddGroup
     */
    return (
        <div className="pb-24 md:pb-4 md:w-[450px]">
            <Spacer height="6" />

            {isLoading ? (
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
                                    {users.isLoading 
                                        ? <option>Benutzer werden geladen ...</option>
                                        : users.data?.map(user => <option key={user.id} value={user.value}>{user.username}</option>)
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
    )
}
