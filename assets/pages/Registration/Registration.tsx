import axios from 'axios'
import React, { ReactElement, useEffect, useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import InputRow from '@/components/form/Input/InputRow'
import Button from '@/components/ui/Buttons/Button'
import Card from '@/components/ui/Card'
import Notification from '@/components/ui/Notification'
import Spacer from '@/components/ui/Spacer'
import Spinner from '@/components/ui/Spinner'
import { UserModel } from '@/types/UserModel'
import { StandardContentWrapper } from '@/components/ui/StandardContentWrapper'

type RegistrationProps = {
    user: EntityState<UserModel>
    setSidebar: SetSidebarAction
    setTopbar: SetTopbarAction
}

export const Registration = ({ user, setSidebar, setTopbar }: RegistrationProps): ReactElement => {
    const [isLoadingSubmit, setLoadingSubmit] = useState<boolean>(false)
    const [success, setSuccess] = useState<boolean>(false)

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
        event.preventDefault()
        const formData = new FormData(event.currentTarget)

        setLoadingSubmit(true);

        (async () => {
            try {
                await axios.post('/api/register', formData)
                setSuccess(true)
            } catch (error) {
                console.log(error)
            }
        })()
    }

    useEffect(() => {
        setSidebar()
        setTopbar({
            title: 'Registrierung',
        })
    }, [])

    return (
        <StandardContentWrapper className="md:w-[400px]">
            {isLoadingSubmit && success &&
                <Notification color="green" title="Registrierung erfolgreich!">
                    Du kannst dich nun <Link to="/login">einloggen</Link>.
                </Notification>
            }

            {(user.isLoading || isLoadingSubmit) && !success &&
                <Spinner />
            }

            {user.data.username !== null && !user.isLoading && !isLoadingSubmit &&
                <Navigate to="/login" />
            }

            {user.data.username === null && !user.isLoading && !isLoadingSubmit &&
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
                            Nach der Registrierung muss deinem Account manuell der Admin-Status verliehen werden, ehe du
                            FoodPlanner nutzen kannst.
                        </p>

                        <Spacer height="4" />

                        <div className="flex justify-end">
                            <Button
                                type="submit"
                                icon="login"
                                label="Registrieren"
                                role="secondary"
                            />
                        </div>
                    </Card>
                </form>
            }
        </StandardContentWrapper>
    )
}
