/*************************************
 * ./assets/pages/Planner/AddMeal.js *
 *************************************/

import React, { useEffect, useState } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import axios from 'axios';

import { InputLabel } from '../../components/form/Input';
import { RadioWidget } from '../../components/form/Radio';
import { SelectWidget } from '../../components/form/Select';
import Button from '../../components/ui/Buttons/Button';
import HeadingAndBackButton from '../../components/ui/HeadingAndBackButton';
import Spinner from '../../components/ui/Spinner';
import Card from '../../components/ui/Card';
import Spacer from '../../components/ui/Spacer';

/**
 * AddMeal
 * 
 * A component for adding a Meal. 
 * Shows a form which can be submitted 
 * to the Meal Add API in the 
 * /src/Controller/MealController.php.
 * 
 * @component
 * @property {function} setSidebarActiveItem
 * @property {function} setSidebarActionButton
 * @property {arr} recipes 
 * @property {boolean} isLoadingRecipes
 * @property {arr} days 
 * @property {boolean} isLoadingDays
 * @property {function} setLoadingDays
 * 
 * @todo Skeleton colors
 */
export default function AddMeal(props) {
    /**
     * State variables
     */
    const { id } = useParams();
    const [isLoadingSubmit, setLoadingSubmit] = useState(false);
    const [isSubmitted, setSubmitted] = useState(false);

    /**
     * handleSubmit
     * 
     * Submits the form data to the Meal Add API.
     * 
     * @param {*} event
     */
    const handleSubmit = (event) => {
        const formData = new FormData(event.target);
        event.preventDefault();

        setLoadingSubmit(true);

        axios
            .post('/api/meals/add', formData)
            .then(() => {
                setSubmitted(true); 
                props.setLoadingDays(true);
            })
        ;
    };

    /**
     * Load sidebar
     */
    useEffect(() => {
        props.setSidebarActiveItem('planner');
        props.setSidebarActionButton();

        // Scroll to top
        window.scrollTo(0, 0);
    }, []);

    /**
     * Render
     */
    return (
        <div className="pb-[6.5rem] w-full md:w-[450px]">
            {isSubmitted && <Navigate to={'/planner'} />}

            <div className="p-4 md:px-0 md:pt-9 mb-6">
                <HeadingAndBackButton location="/planner">Mahlzeit hinzufügen</HeadingAndBackButton>
            </div>

            {isLoadingSubmit ? (
                <Spinner />
            ) : (
                <form className="md:max-w-[450px]" onSubmit={handleSubmit}>
                    <Card style="mb-4 md:mb-6 mx-4 md:mx-0">
                        <InputLabel id="meal_day" label="Für welchen Tag?" />
                        {props.isLoadingDays ? (
                            <div role="status" className="animate-pulse">
                                <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded-full w-2/3 mb-2"></div>
                                <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded-full w-3/4"></div>
                            </div>
                        ) : (
                            <SelectWidget
                                id="meal_day"
                                options={props.days}
                                defaultValue={id}
                            />
                        )}

                        <Spacer height="6" />

                        <InputLabel id="meal_userGroup" label="Wann ist die Mahlzeit?" />
                        {props.isLoadingUserGroups ? (
                            <div role="status" className="animate-pulse">
                                <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded-full w-2/3 mb-2"></div>
                                <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded-full w-3/4"></div>
                            </div>
                        ) : (
                            <RadioWidget
                                id="meal_mealCategory" 
                                options={props.mealCategories}
                                required={true}
                            />
                        )}
                    </Card>

                    <Card style="mb-4 md:mb-6 mx-4 md:mx-0">
                        <InputLabel htmlFor="meal_recipe" label="Welches Rezept?" />
                        {props.isLoadingRecipes ? (
                            <div role="status" className="max-w-sm animate-pulse">
                                <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded-full w-2/3 mb-2"></div>
                                <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded-full w-3/4"></div>
                            </div>
                        ) : (
                            <SelectWidget
                                id="meal_recipe"
                                options={props.recipes}
                                required="required"
                            />
                        )}

                        <Spacer height="6" />

                        <InputLabel id="meal_userGroup" label="Für wen ist die Mahlzeit?" />
                        {props.isLoadingUserGroups ? (
                            <div role="status" className="animate-pulse">
                                <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded-full w-2/3 mb-2"></div>
                                <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded-full w-3/4"></div>
                            </div>
                        ) : (
                            <RadioWidget
                                id="meal_userGroup" 
                                options={props.userGroups}
                                required={true}
                            />
                        )}
                    </Card>

                    <div className="flex justify-end mr-4 md:mr-0">
                        {!props.isLoadingDays && !props.isLoadingRecipes && !props.isLoadingUserGroups && !props.isLoadingMealCategories &&
                            <Button
                                type="submit"
                                icon="save" 
                                label="Speichern" 
                                outlined={true}
                            />
                        }
                    </div> 
                </form>
            )}
        </div>
    );
}
