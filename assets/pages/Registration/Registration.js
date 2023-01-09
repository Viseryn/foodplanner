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
import Card from '../../components/ui/Card';
import Spacer from '../../components/ui/Spacer';

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
        <div className="pb-[6.5rem] md:pb-6 w-full md:w-[400px]">
            <div className="pt-4 md:pt-9 px-4">
                <Heading>Registrierung</Heading>
            </div>

            <Spacer height="10" />

            <div className="">
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
                    <form onSubmit={handleSubmit} autoComplete="off">
                        <Card style="mx-4 md:mx-0">
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
                                    className="w-4 h-4 mr-4 text-primary-100 bg-[#e0e4d6] rounded-sm border-2 border-[#c3c8bb] dark:bg-[#43483e] dark:border-[#8d9286] focus:ring-primary-100 focus:ring-2 peer"
                                />
                                <label htmlFor="registration_form_agreeTerms">Ich stimme den Nutzungsbedingungen und den Datenschutzbestimmungen zu.</label>
                            </div>

                            <hr className="border-t-secondary-200 dark:border-t-secondary-dark-200" />

                            <p className="mt-6 text-justify">
                                Nach der Registrierung muss deinem Account manuell
                                der Admin-Status verliehen werden, ehe du FoodPlanner
                                nutzen kannst.
                            </p>
                        </Card>

                        <Spacer height="6" />

                        <div className="flex justify-end mx-4 md:mx-0">
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
    );
}
