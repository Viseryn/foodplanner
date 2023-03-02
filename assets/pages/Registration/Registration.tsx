/************************************************
 * ./assets/pages/Registration/Registration.tsx *
 ************************************************/

import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Link, Navigate } from 'react-router-dom'

import InputRow from '@/components/form/Input/InputRow'
import Button from '@/components/ui/Buttons/Button'
import Card from '@/components/ui/Card'
import Notification from '@/components/ui/Notification'
import Spacer from '@/components/ui/Spacer'
import Spinner from '@/components/ui/Spinner'
import UserModel from '@/types/UserModel'

/**
 * A component that renders a registration form.
 * 
 * @component
 * 
 * @todo Make checkbox its own form widget component.
 */
export default function Registration({ user, setSidebar, setTopbar }: {
    user: EntityState<UserModel>
    setSidebar: SetSidebarAction
    setTopbar: SetTopbarAction
}): JSX.Element {
    // State variables
    const [isLoadingSubmit, setLoadingSubmit] = useState<boolean>(false)
    const [success, setSuccess] = useState<boolean>(false)

    /**
     * On submitting the form, calls the Register API.
     * 
     * @param event A submit form event.
     */
    const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
        event.preventDefault()
        const formData = new FormData(event.currentTarget)

        setLoadingSubmit(true);

        // Try API call
        (async () => {
            try {
                // Send form data to Registration API
                await axios.post('/api/register', formData)
                setSuccess(true)
            } catch (error) {
                console.log(error)
            }
        })()
    }

    // Load layout
    useEffect(() => {
        setSidebar()
        setTopbar({
            title: 'Registrierung',
        })
    }, [])

    // Render Registration
    return (
        <div className="pb-24 md:pb-4 md:w-[400px]">
            <Spacer height="6" />

            <div className="mx-4 md:mx-0">
                {isLoadingSubmit && success && 
                    <Notification color="green" title="Registrierung erfolgreich!">
                        Du kannst dich nun <Link to="/login">einloggen</Link>.
                    </Notification>
                }
                
                {(user.isLoading || isLoadingSubmit) && !success &&
                    <Spinner />
                }

                {user.data.username !== undefined && !user.isLoading && !isLoadingSubmit &&
                    <Navigate to="/login" />
                }

                {user.data.username === undefined && !user.isLoading && !isLoadingSubmit &&
                    <form onSubmit={handleSubmit} autoComplete="off">
                        <Card>
                            <InputRow
                                id="registration_form_username"
                                label="Dein Benutzername"
                                {...{
                                    'required': true,
                                }}
                            />

                            <Spacer height="6" />

                            <InputRow
                                id="registration_form_plainPassword"
                                label="Dein Password"
                                {...{
                                    'type': 'password',
                                    'required': true,
                                }}
                            />

                            <Spacer height="6" />

                            <div className="flex items-center">
                                <input 
                                    id="registration_form_agreeTerms"
                                    name="registration_form[agreeTerms]"
                                    type="checkbox" 
                                    required={true}
                                    className="w-4 h-4 mr-4 text-primary-100 bg-[#e0e4d6] rounded-sm border border-[#c3c8bb] dark:bg-[#43483e] dark:border-[#8d9286] focus:ring-primary-100 focus:ring-2 peer"
                                />
                                <label htmlFor="registration_form_agreeTerms">
                                    Ich stimme den Nutzungsbedingungen und den Datenschutzbestimmungen zu.
                                </label>
                            </div>

                            <hr className="my-6 border-t-secondary-200 dark:border-t-secondary-dark-200" />

                            <p className="text-justify">
                                Nach der Registrierung muss deinem Account manuell der Admin-Status verliehen werden, ehe du FoodPlanner nutzen kannst.
                            </p>
                        </Card>

                        <Spacer height="4" />

                        <div className="flex justify-end">
                            <Button
                                type="submit"
                                icon="login"
                                label="Registrieren"
                                role="secondary"
                            />
                        </div>
                    </form>
                }
            </div>
        </div>
    )
}
