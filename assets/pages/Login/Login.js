/*********************************
 * ./assets/pages/Login/Login.js *
 *********************************/

import React, { useEffect, useState } from 'react';
import axios from 'axios';

import { SubmitButton } from '../../components/Buttons';
import InputRow from '../../components/Forms';
import Heading from '../../components/Heading';
import Notification from '../../components/Notification';
import Spinner from '../../components/Spinner';

/**
 * Login
 * 
 * A component that renders a login form for unauthenticated 
 * users or a success/error notification.
 * 
 * @component
 * @property {function} setSidebarActiveItem
 * @property {function} setSidebarActionButton
 */
export default function Login(props) {
    /**
     * State variables
     */
    const [isLoading, setLoading] = useState(true);
    const [response, setResponse] = useState();
    const [user, setUser] = useState();

    /**
     * Load sidebar and user data
     */
    useEffect(() => {
        props.setSidebarActiveItem();
        props.setSidebarActionButton();

        getUser();
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
        setLoading(true);

        axios
            .post('/api/login', formData)
            .then(response => {
                setResponse(response.data);
                getUser();
            })
        ;
    };

    /**
     * getUser
     * 
     * Calls the User API, which responds with an 
     * array containing the username and user roles
     * (if authenticated), or an empty array elsewise.
     */
    const getUser = () => {
        axios
            .get('/api/user')
            .then(response => {
                setLoading(false);
                setUser(JSON.parse(response.data));
            })
        ;
    }

    /**
     * Render
     */
    return (
        <div className="px-6 pb-24 pt-6 md:pb-6 md:my-6 md:mr-6 w-full min-h-screen md:min-h-fit bg-white dark:bg-[#29353f] md:rounded-3xl md:w-fit">
            <Heading>Login</Heading>
            <div className="min-w-[400px]"></div>
            
            {isLoading &&
                <Spinner />
            }

            {response?.error &&
                <div className="mb-10">
                    <Notification color="red" title="Login fehlgeschlagen!">
                        Fehlercode: {response?.error}
                    </Notification>
                </div>
            }

            {user?.username !== undefined &&
                <Notification color="green" title="Erfolgreich eingeloggt!">
                    Willkommen, {user?.username}.
                </Notification>
            }

            {user?.username === undefined && !isLoading &&
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
                        <SubmitButton
                            icon="login"
                            label="Einloggen"
                        />
                    </div>
                </form>
            }
        </div>
    );
}
