/*********************************
 * ./assets/pages/Login/Login.js *
 *********************************/

import React, { useEffect, useState } from 'react';
import axios from 'axios';

import { InputRow } from '../../components/form/Input';
import Button from '../../components/ui/Buttons/Button';
import Heading from '../../components/ui/Heading';
import Notification from '../../components/ui/Notification';
import Spinner from '../../components/ui/Spinner';
import Card from '../../components/ui/Card';
import Spacer from '../../components/ui/Spacer';

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
    const [response, setResponse] = useState();
    const [isLoadingSubmit, setLoadingSubmit] = useState(false);

    /**
     * Load sidebar and user data
     */
    useEffect(() => {
        props.setSidebarActiveItem();
        props.setSidebarActionButton();
    }, []);

    /**
     * handleSubmit
     * 
     * On submitting the form, calls the Login API.
     * Responds with an error on failure.
     * 
     * @param {*} event
     */
    const handleSubmit = (event) => {
        const formData = new FormData(event.target);
        event.preventDefault();

        setResponse();
        setLoadingSubmit(true);

        axios
            .post('/api/login', formData)
            .then(response => {
                setResponse(response.data);
                setLoadingSubmit(false);
                props.setLoadingUser(true);
            })
        ;
    };

    /**
     * Render
     */
    return (
        <div className="pb-[6.5rem] md:pb-6 w-full min-w-[400px]">
            <div className="px-6 md:px-4 pt-4 md:pt-9">
                <Heading>Login</Heading>
            </div>

            <Spacer height="10" />
            
            {(props.isLoadingUser || isLoadingSubmit) &&
                <div className="mb-6 md:w-[400px] px-4 md:pl-0">
                    <Spinner />
                </div>
            }

            {response?.error &&
                <div className="mb-6 md:w-[400px] px-4 md:pl-0">
                    <Notification color="red" title="Login fehlgeschlagen!">
                        Fehlercode: {response?.error}
                    </Notification>
                </div>
            }

            {props.user?.username !== undefined && !props.isLoadingUser && !isLoadingSubmit &&
                <div className="md:w-[400px] px-4 md:pl-0">
                    <Notification color="green" title="Erfolgreich eingeloggt!">
                        Willkommen, {props.user?.username}.
                    </Notification>

                    {!props.user?.roles?.includes('ROLE_ADMIN') &&
                        <div className="mt-6">
                            <Notification title="Nicht genügend Berechtigungen.">
                                Für den Zugriff auf alle Funktionen sind Admin-Berechtigungen nötig.
                            </Notification>
                        </div>
                    }

                    <div className="mt-6">
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
                <form onSubmit={handleSubmit} className="md:w-[400px] px-4 md:pl-0">
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

                    <Spacer height="6" />

                    <div className="flex justify-end">
                        <Button
                            type="submit"
                            icon="login"
                            label="Einloggen"
                        />
                    </div>
                </form>
            }
        </div>
    );
}
