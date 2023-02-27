/****************************************
 * ./assets/pages/Settings/AddGroup.tsx *
 ****************************************/

import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { NavigateFunction, useNavigate } from 'react-router-dom'

import InputRow from '@/components/form/Input/InputRow'
import SelectRow from '@/components/form/Select/SelectRow'
import Button from '@/components/ui/Buttons/Button'
import Card from '@/components/ui/Card'
import Spacer from '@/components/ui/Spacer'
import Spinner from '@/components/ui/Spinner'
import useFetch from '@/hooks/useFetch'

/**
 * AddGroup
 * 
 * A component that renders a form for adding new UserGroups.
 * 
 * @component
 */
export default function AddGroup({ authentication, userGroups, setSidebar, setTopbar, ...props }: {
    authentication: Authentication
    userGroups: FetchableEntity<Array<UserGroup>>
    setSidebar: SetSidebarAction
    setTopbar: SetTopbarAction
}) {
    // A list of all users
    const users = useFetch<Array<User>>('/api/user/list', authentication)

    // A function that can change the location. Needed for the redirect after submit.
    const navigate: NavigateFunction = useNavigate()

    // Whether the page is loading. Will be true while the form data is processed by the API.
    const [isLoading, setLoading] = useState<boolean>(false)

    const userOptions: Array<{ id: string, title?: string }> = users.data.map(user => {
        return { id: user.id?.toString() ?? '', title: user.username }
    })

    /**
     * Submits the form data to the UserGroup Add API.
     * 
     * @param event A form submit event.
     * 
     * @todo Test this.
     */
    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        const formData = new FormData(event.currentTarget)
        
        setLoading(true)

        await axios.post('/api/usergroups/add', formData)
        await axios.get('/api/refresh-data-timestamp/set')

        userGroups.load()
        navigate('/settings')
    }

    // Load layout
    useEffect(() => {
        setSidebar()
        setTopbar({
            title: 'Neue Benutzergruppe',
            showBackButton: true,
            backButtonPath: '/settings',
        })

        // Scroll to top
        window.scrollTo(0, 0)
    }, [])

    // Render AddGroup
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
                                Hier kannst du eine neue Benutzergruppen hinzufügen. Die Liste von Material Symbols findest du <a target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-400 transition duration-300" href="https://fonts.google.com/icons?icon.style=Rounded&icon.set=Material+Symbols">hier</a>.
                            </p>

                            <Spacer height="6" />

                            <InputRow
                                id="user_group_name"
                                label="Name der Benutzergruppe"
                                {...{ 
                                    required: true, 
                                    maxLength: 64, 
                                    placeholder: 'Name der Benutzergruppe',
                                }}
                            />

                            <Spacer height="6" />

                            <InputRow
                                id="user_group_icon"
                                label="Icon der Benutzergruppe (optional)"
                                {...{ 
                                    required: true, 
                                    maxLength: 255, 
                                    placeholder: 'Material-Symbols-Bezeichnung, z.B. face_5',
                                }}
                            />
                            
                            <Spacer height="6" />

                            <SelectRow
                                id="user_group_users"
                                label="Welche Benutzer sollen zur Gruppe gehören?"
                                options={userOptions}
                                {...{
                                    name: "user_group[users][]"
                                }}
                            />
                        </Card>

                        <div className="flex justify-end md:mt-4 pb-[5.5rem] md:pb-0">
                            <Button
                                type="submit" 
                                icon="save" 
                                label="Speichern" 
                                outlined={true}
                                isElevated={true}
                                isFloating={true}
                            />
                        </div>
                    </form>
                </div>
            )}
        </div>
    )
}
