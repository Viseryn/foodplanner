/*************************************
 * ./assets/pages/Planner/AddMeal.js *
 *************************************/

import React, { useEffect, useState } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import axios from 'axios';

import { InputLabel } from '../../components/form/Input';
import { RadioRow } from '../../components/form/Radio';
import { SelectWidget } from '../../components/form/Select';
import Button, { SubmitButton } from '../../components/ui/Buttons';
import Heading from '../../components/ui/Heading';
import Spinner from '../../components/ui/Spinner';

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
 * @property {function} setRecipes
 * @property {boolean} isLoadingRecipes
 * @property {function} setLoadingRecipes
 * @property {arr} days 
 * @property {boolean} isLoadingDays
 * @property {function} setLoadingDays
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
            .post('/api/meal/add', formData)
            .then(() => {
                setSubmitted(true); 
                props.setLoadingDays(true);
            })
        ;
    };

    /**
     * Load sidebar and data
     */
    useEffect(() => {
        props.setSidebarActiveItem('planner');
        props.setSidebarActionButton({
            visible: true, 
            icon: 'redo', 
            path: '/planner', 
            label: 'Zurück',
        });
    }, []);

    /**
     * Render
     */
    return (
        <div className="px-6 pb-24 pt-6 md:pb-6 md:my-6 md:mr-6 w-full min-h-screen md:min-h-fit bg-white dark:bg-[#29353f] md:rounded-3xl md:w-[450px]">
            {isSubmitted && <Navigate to={'/planner'} />}

            <Heading>Mahlzeit hinzufügen</Heading>

            {isLoadingSubmit ? (
                <Spinner />
            ) : (
                <form className="max-w-[450px]" onSubmit={handleSubmit}>
                    <div className="mb-6">
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
                    </div>

                    <RadioRow 
                        id="meal_userGroup" 
                        label="Für wen ist die Mahlzeit?"
                        options={[
                            {
                                id: 'userGroup_benedikt',
                                value: 3,
                                icon: 'face',
                                label: 'Benedikt',
                            },
                            {
                                id: 'userGroup_kevin',
                                value: 2,
                                icon: 'face_6',
                                label: 'Kevin',
                            },
                            {
                                id: 'userGroup_all',
                                value: 1,
                                icon: 'groups',
                                label: 'Alle',
                                checked: 'checked',
                            },
                        ]} 
                    />

                    <RadioRow 
                        id="meal_mealCategory" 
                        label="Wann ist die Mahlzeit?"
                        options={[
                            {
                                id: 'mealCategory_breakfast',
                                value: 1,
                                icon: 'bakery_dining',
                                label: 'Morgens',
                            },
                            {
                                id: 'mealCategory_lunch',
                                value: 2,
                                icon: 'fastfood',
                                label: 'Mittags',
                                checked: 'checked',
                            },
                            {
                                id: 'mealCategory_dinner',
                                value: 3,
                                icon: 'ramen_dining',
                                label: 'Abends',
                            },
                        ]} 
                    />

                    <div className="mb-6">
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
                    </div>

                    <div className="flex justify-end gap-4">
                        <div className="hidden md:block">
                            <Button
                                to="/planner"
                                icon="redo"
                                label="Zurück"
                                style="transparent"
                            />
                        </div>
                        <SubmitButton 
                            icon="add" 
                            label="Speichern" 
                            elevated={true}
                        />
                    </div> 
                </form>
            )}
        </div>
    );
}