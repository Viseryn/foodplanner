/*********************************
 * ./assets/pages/Login/Login.js *
 *********************************/

import React, { useEffect, useState } from 'react'
import axios from 'axios'

import { InputRow } from '../../components/form/Input'
import Button       from '../../components/ui/Buttons/Button'
import Card         from '../../components/ui/Card'
import Notification from '../../components/ui/Notification'
import Spacer       from '../../components/ui/Spacer'
import Spinner      from '../../components/ui/Spinner'

/**
 * Login
 * 
 * A component that renders a login form for unauthenticated 
 * users or a success/error notification.
 * 
 * @component
 * @property {function} setSidebarActiveItem
 * @property {function} setSidebarActionButton
 * @property {arr} user
 * @property {boolean} isLoadingUser
 * @property {function} setLoadingUser
 */
export default function Login(props) {
    /**
     * State variables
     */
    const [response, setResponse] = useState()
    const [isLoadingSubmit, setLoadingSubmit] = useState(false)

    /**
     * Load layout
     */
    useEffect(() => {
        // Load sidebar
        props.setSidebarActiveItem()
        props.setSidebarActionButton()

        // Load topbar
        props.setTopbar({
            title: 'Login',
        })
    }, [])

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
        setLoadingSubmit(true)

        axios
            .post('/api/login', formData)
            .then(response => {
                setResponse(response.data)
                setLoadingSubmit(false)
                props.setLoadingUser(true)
            })
    }

    /**
     * Render
     */
    return (
        <div className="pb-24 md:pb-4 md:w-[450px]">
            <Spacer height="6" />
            
            {(props.isLoadingUser || isLoadingSubmit) &&
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

            {props.user?.username !== undefined && !props.isLoadingUser && !isLoadingSubmit &&
                <div className="mx-4 md:mx-0">
                    <Notification color="green" title="Erfolgreich eingeloggt!">
                        Willkommen, {props.user?.username}.
                    </Notification>

                    {!props.user?.roles?.includes('ROLE_ADMIN') &&
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

            {props.user?.username === undefined && !props.isLoadingUser && !isLoadingSubmit &&
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
