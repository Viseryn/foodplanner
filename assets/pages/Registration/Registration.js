/*********************************
 * ./assets/pages/Login/Login.js *
 *********************************/

import React, { useEffect, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import axios from 'axios';

import { InputRow } from '../../components/form/Input';
import Button from '../../components/ui/Buttons/Button';
import Heading from '../../components/ui/Heading';
import Notification from '../../components/ui/Notification';
import Spinner from '../../components/ui/Spinner';

/**
 * Registration
 * 
 * A component that renders a registration form.
 * 
 * @component
 * @property {function} setSidebarActiveItem
 * @property {function} setSidebarActionButton
 * @property {arr} user
 * @property {boolean} isLoadingUser
 */
export default function Registration(props) {
    /**
     * State variables
     */
    const [isLoadingSubmit, setLoadingSubmit] = useState(false);
    const [success, setSuccess] = useState(false);

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
     * On submitting the form, calls the Register API.
     * 
     * @param {*} event
     */
    const handleSubmit = (event) => {
        const formData = new FormData(event.target);
        event.preventDefault();

        setLoadingSubmit(true);

        axios
            .post('/api/register', formData)
            .then(() => {
                setSuccess(true);
            })
        ;
    };

    /**
     * Render
     */
    return (
        <div className="px-6 pb-24 pt-6 md:pb-6 md:my-6 md:mr-6 w-full min-h-screen md:min-h-fit bg-white dark:bg-[#29353f] md:rounded-3xl md:w-fit">
            <Heading>Registrierung</Heading>
            <div className="min-w-[400px]"></div>

            {isLoadingSubmit && success && 
                <Notification color="green" title="Registrierung erfolgreich!">
                    Du kannst dich nun <Link to="/login">einloggen</Link>.
                </Notification>
            }
            
            {(props.isLoadingUser || isLoadingSubmit) && !success &&
                <Spinner />
            }

            {props.user?.username !== undefined && !props.isLoadingUser && !isLoadingSubmit &&
                <Navigate to="/login" />
            }

            {props.user?.username === undefined && !props.isLoadingUser && !isLoadingSubmit &&
                <div className="sm:w-[400px]">
                    <form onSubmit={handleSubmit} autoComplete="off">
                        <InputRow 
                            id="registration_form_username"
                            label="Dein Benutzername"
                            inputProps={{
                                required: 'required', 
                            }}
                        />
                        <InputRow 
                            id="registration_form_plainPassword"
                            label="Dein Passwort"
                            inputProps={{
                                required: 'required', 
                                type: 'password',
                            }}
                        />
                        <div className="mb-6 flex items-center">
                            <input 
                                id="registration_form_agreeTerms"
                                name="registration_form[agreeTerms]"
                                type="checkbox" 
                                required="required"
                                className="w-4 h-4 text-blue-600 bg-gray-100 rounded-full border-gray-300 dark:bg-gray-700 dark:border-gray-600 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 peer mr-4"
                            />
                            <label htmlFor="registration_form_agreeTerms">Ich stimme den Allgemeinen Nutzungsbedingungen und den Datenschutzbestimmungen zu.</label>
                        </div>

                        <p className="my-6 text-justify text-gray-400">
                            Nach der Registrierung muss deinem Account manuell
                            der Admin-Status verliehen werden, ehe du FoodPlanner
                            nutzen kannst.
                        </p>

                        <div className="flex justify-end">
                            <Button
                                type="submit"
                                icon="login"
                                label="Registrieren"
                                elevated={true}
                            />
                        </div>
                    </form>
                </div>
            }
        </div>
    );
}
