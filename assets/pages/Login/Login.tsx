/**********************************
 * ./assets/pages/Login/Login.tsx *
 **********************************/

import React, { useEffect, useState } from 'react'
import axios from 'axios'

import { InputRow } from '@/components/form/Input'
import Button from '@/components/ui/Buttons/Button'
import Card from '@/components/ui/Card'
import Notification from '@/components/ui/Notification'
import Spacer from '@/components/ui/Spacer'
import Spinner from '@/components/ui/Spinner'

/**
 * Login
 * 
 * A component that renders a login form for unauthenticated 
 * users or a success/error notification.
 * 
 * @component
 * @param {object} props
 * @param {function} props.setSidebar
 * @param {function} props.setTopbar
 * @param {function} props.setLoading
 * @param {object} props.user
 * @param {object} props.authentication
 */
export default function Login(props) {
    /**
     * The response from the Login API.
     * 
     * @type {[string, function]}
     */
    const [response, setResponse] = useState()

    /**
     * A loading boolean for the submit handler.
     * 
     * @type {[boolean, function]}
     */
    const [isLoading, setLoading] = useState(false)


    /**
     * handleSubmit
     * 
     * On submitting the form, calls the Login API.
     * Responds with an error on failure.
     * 
     * @param {*} event
     */
    const handleSubmit = (event) => {
        const formData = new FormData(event.target)
        event.preventDefault()

        setResponse()
        setLoading(true)

        axios
            .post('/api/login', formData)
            .then(response => {
                setResponse(response.data)
                setLoading(false)
                props.user.setLoading(true)
                props.setLoading(true)
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
            title: 'Login',
        })
    }, [])

    /**
     * Render Login
     */
    return (
        <div className="pb-24 md:pb-4 md:w-[450px]">
            <Spacer height="6" />
            
            {(props.user.isLoading || isLoading) &&
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

            {props.user.data?.username !== undefined && !props.user.isLoading && !isLoading &&
                <div className="mx-4 md:mx-0">
                    <Notification color="green" title="Erfolgreich eingeloggt!">
                        Willkommen, {props.user.data?.username}.
                    </Notification>

                    {!props.authentication.isAuthenticated &&
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
                            elevated={true}
                            style="flex justify-center"
                        />
                    </div>
                </div>
            }

            {props.user.data?.username === undefined && !props.user.isLoading && !isLoading &&
                <div className="mx-4 md:mx-0">
                    <form onSubmit={handleSubmit}>
                        <Card>
                            <InputRow 
                                id="username"
                                label="Dein Benutzername"
                                inputProps={{
                                    required: 'required', 
                                    name: '_username',
                                }}
                            />
                            <InputRow 
                                id="password"
                                label="Dein Passwort"
                                inputProps={{
                                    required: 'required', 
                                    type: 'password',
                                    name: '_password',
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
    )
}
