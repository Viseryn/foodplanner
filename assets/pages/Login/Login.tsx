/**********************************
 * ./assets/pages/Login/Login.tsx *
 **********************************/

import React, { useEffect, useState } from 'react'
import axios from 'axios'

import InputRow from '@/components/form/Input/InputRow'
import Button from '@/components/ui/Buttons/Button'
import Card from '@/components/ui/Card'
import Notification from '@/components/ui/Notification'
import Spacer from '@/components/ui/Spacer'
import Spinner from '@/components/ui/Spinner'

/**
 * Login
 * 
 * A component that renders a login form for unauthenticated users or a success/error notification.
 * 
 * @component
 * @param props
 * @param props.setLoading The setter for the state variable isLoading from the App component.
 */
export default function Login({ user, authentication, setLoading, setSidebar, setTopbar }: {
    user: FetchableEntity<User>
    authentication: Authentication
    setLoading: React.Dispatch<React.SetStateAction<boolean>>
    setSidebar: SetSidebarAction
    setTopbar: SetTopbarAction
}): JSX.Element {
    // The response from the Login API
    const [response, setResponse] = useState<any>()

    // A loading boolean for the submit handler
    const [isLoadingSubmit, setLoadingSubmit] = useState<boolean>(false)


    /**
     * On submitting the form, calls the Login API. Responds with an error on failure.
     * 
     * @param event A form submit event.
     */
    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        const formData = new FormData(event.currentTarget)

        setLoadingSubmit(true);

        (async () => {
            try {
                await axios.post('/api/login', formData)

                // Set response and stop loading the form submit
                setResponse(response.data)
                setLoadingSubmit(false)

                // Load user data
                user.load()

                // Fetch all data
                setLoading(true)
            } catch (error) {
                console.log(error)
            }
        })()
    }

    // Load layout
    useEffect(() => {
        setSidebar()
        setTopbar({
            title: 'Login',
        })
    }, [])

    // Render Login
    return <div className="pb-24 md:pb-4 md:w-[450px]">
        <Spacer height="6" />
        
        {(user.isLoading || isLoadingSubmit) &&
            <Spinner />
        }

        {response?.error &&
            <div className="mx-4 md:mx-0">
                <Notification color="red" title="Login fehlgeschlagen!">
                    Fehlercode: {response?.error}
                </Notification>
                <Spacer height="4" />
            </div>
        }

        {user.data.username !== undefined && !user.isLoading && !isLoadingSubmit &&
            <div className="mx-4 md:mx-0">
                <Notification color="green" title="Erfolgreich eingeloggt!">
                    Willkommen, {user.data.username}.
                </Notification>

                {!authentication.isAuthenticated &&
                    <>
                        <Spacer height="4" />
                        <Notification title="Nicht genügend Berechtigungen.">
                            Für den Zugriff auf alle Funktionen sind Admin-Berechtigungen nötig.
                        </Notification>
                    </>
                }

                <div className="mt-6 p-6">
                    <Button
                        location="/planner"
                        icon="date_range"
                        label="Zum Wochenplan"
                        isElevated={true}
                        style="flex justify-center"
                    />
                </div>
            </div>
        }

        {user.data.username === undefined && !user.isLoading && !isLoadingSubmit &&
            <div className="mx-4 md:mx-0">
                <form onSubmit={handleSubmit}>
                    <Card>
                        <InputRow 
                            id="username"
                            label="Dein Benutzername"
                            {...{
                                name: "_username",
                                required: true
                            }}
                        />
                        <InputRow 
                            id="password"
                            label="Dein Passwort"
                            type="password"
                            style=""
                            {...{
                                name: "_password",
                                required: true
                            }}
                        />
                    </Card>

                    <Spacer height="4" />

                    <div className="flex justify-end">
                        <Button
                            type="submit"
                            icon="login"
                            label="Einloggen"
                            role="secondary"
                        />
                    </div>
                </form>
            </div>
        }
    </div>
}
