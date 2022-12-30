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
        <div className="px-6 pb-[6.5rem] pt-6 md:pb-6 md:my-6 md:mr-6 w-full min-h-screen md:min-h-fit bg-white dark:bg-[#29353f] md:rounded-3xl md:w-fit">
            <Heading>Login</Heading>
            <div className="min-w-[400px]"></div>
            
            {(props.isLoadingUser || isLoadingSubmit) &&
                <Spinner />
            }

            {response?.error &&
                <div className="mb-10">
                    <Notification color="red" title="Login fehlgeschlagen!">
                        Fehlercode: {response?.error}
                    </Notification>
                </div>
            }

            {props.user?.username !== undefined && !props.isLoadingUser && !isLoadingSubmit &&
                <>
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

                    <div className="flex justify-end mt-6">
                        <Button
                            location="/planner"
                            icon="date_range"
                            label="Zum Wochenplan"
                            elevated={true}
                        />
                    </div>
                </>
            }

            {props.user?.username === undefined && !props.isLoadingUser && !isLoadingSubmit &&
                <form onSubmit={handleSubmit} className="sm:w-[400px]">
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

                    <div className="flex justify-end">
                        <Button
                            type="submit"
                            icon="login"
                            label="Einloggen"
                            elevated={true}
                        />
                    </div>
                </form>
            }
        </div>
    );
}
