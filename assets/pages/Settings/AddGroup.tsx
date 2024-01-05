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
import { UserGroupModel } from '@/types/UserGroupModel'
import { UserModel } from '@/types/UserModel'
import getOptions from '@/util/getOptions'
import getEntityOptions from '@/util/getEntityOptions'
import UserOption from '@/types/UserOption'
import { useEntityState } from '@/hooks/useEntityState'

/**
 * A component that renders a form for adding new UserGroups.
 * 
 * @component
 */
export default function AddGroup({ authentication, userGroups, setSidebar, setTopbar }: {
    authentication: Authentication
    userGroups: EntityState<Array<UserGroupModel>>
    setSidebar: SetSidebarAction
    setTopbar: SetTopbarAction
}) {
    // A list of all users
    const users: EntityState<UserModel[]> = useEntityState('/api/users', authentication)
    const userOptions = getEntityOptions(users, UserOption)

    // A function that can change the location. Needed for the redirect after submit.
    const navigate: NavigateFunction = useNavigate()

    // Whether the page is loading. Will be true while the form data is processed by the API.
    const [isLoading, setLoading] = useState<boolean>(false)

    /**
     * Submits the form data to the UserGroup Add API.
     * 
     * @param event A form submit event.
     */
    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        if (users.isLoading) {
            return
        }

        event.preventDefault()
        const formData = new FormData(event.currentTarget)
        
        setLoading(true)

        await axios.post('/api/usergroups', formData)

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

                            {users.isLoading 
                                ? <Spinner verticalMargin={10} />
                                : <SelectRow
                                    id="user_group_users"
                                    label="Welche Benutzer sollen zur Gruppe gehören?"
                                    options={getOptions(userOptions)}
                                    {...{
                                        name: "user_group[users][]",
                                        multiple: true,
                                        required: true,
                                        size: getOptions(userOptions).length,
                                        className: 'dark:placeholder-secondary-dark-900 dark:bg-secondary-dark-200 border border-gray-300 dark:border-none rounded-md px-6 w-full transition duration-300 focus:border-primary-100 overflow-hidden'
                                    }}
                                />
                            }
                        </Card>

                        <div className="flex justify-end md:mt-4 pb-[5.5rem] md:pb-0">
                            {!users.isLoading && <Button
                                type="submit" 
                                icon="save" 
                                label="Speichern" 
                                outlined={true}
                                isElevated={true}
                                isFloating={true}
                            />}
                        </div>
                    </form>
                </div>
            )}
        </div>
    )
}
