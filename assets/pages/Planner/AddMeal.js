/**********************************
 * ./assets/components/AddMeal.js *
 **********************************/

import React, { useEffect, useState } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import axios from 'axios';

import Heading from '../../components/Heading';
import { InputLabel, RadioRow, SelectWidget } from '../../components/Forms';
import Button, { SubmitButton } from '../../components/Buttons';
import Spinner from '../../components/Spinner';

/**
 * AddMeal
 * 
 * A component for adding a Meal. 
 * Shows a form which can be submitted 
 * to the Meal Add API in the 
 * /src/Controller/MealController.php.
 */
export default function AddMeal(props) {
    // State variables
    const { id } = useParams();
    const [isLoading, setLoading] = useState(true);
    const [isLoadingSubmit, setLoadingSubmit] = useState(false);
    const [isSubmitted, setSubmitted] = useState(false);
    const [recipes, setRecipes] = useState([]);
    const [days, setDays] = useState([]);

    /**
     * getData
     * 
     * Loads recipes and days data from the 
     * Recipe List API and Day List API.
     */
    const getData = () => {
        axios
            .get('/api/recipes')
            .then(recipes => {
                setRecipes(JSON.parse(recipes.data));
                
                axios
                    .get('/api/days')
                    .then(days => {
                        setDays(JSON.parse(days.data));
                        setLoading(false);
                    })
                ;
            })
        ;
    }

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
            .then(response => {
                setSubmitted(true);
                setLoading(false);
            })
        ;
    };

    /**
     * Load sidebar and data.
     */
    useEffect(() => {
        props.setSidebarActiveItem('planner');
        props.setSidebarActionButton({
            visible: true, 
            icon: 'redo', 
            path: '/planner', 
            label: 'Zurück',
        });

        getData();
    }, []);

    /**
     * Render
     */
    return (
        <div className="px-6 pb-24 pt-6 md:pb-6 md:my-6 md:mr-6 w-full min-h-screen md:min-h-fit bg-white dark:bg-[#29353f] md:rounded-3xl md:w-[450px]">
            {isSubmitted && <Navigate to={'/planner'} />}

            <Heading title='Mahlzeit hinzufügen' />

            {isLoadingSubmit ? (
                <Spinner />
            ) : (
                <form className="max-w-[450px]" onSubmit={handleSubmit}>
                    <div className="mb-6">
                        <InputLabel id="meal_day" label="Für welchen Tag?" />
                        {isLoading ? (
                            <div role="status" className="animate-pulse">
                                <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded-full w-2/3 mb-2"></div>
                                <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded-full w-3/4"></div>
                            </div>
                        ) : (
                            <SelectWidget
                                id="meal_day"
                                options={days}
                                defaultValue={id}
                            />
                        )}
                    </div>

                    <div className="mb-6">
                        <InputLabel htmlFor="meal_userGroup" label="Für wen ist die Mahlzeit?" />
                        <RadioRow name="meal[userGroup]" options={[
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
                        ]} />
                    </div>

                    <div className="mb-6">
                        <InputLabel htmlFor="meal_mealCategory" label="Wann ist die Mahlzeit?" />
                        <RadioRow name="meal[mealCategory]" options={[
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
                        ]} />
                    </div>

                    <div className="mb-6">
                        <InputLabel htmlFor="meal_recipe" label="Welches Rezept?" />
                        {isLoading ? (
                            <div role="status" className="max-w-sm animate-pulse">
                                <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded-full w-2/3 mb-2"></div>
                                <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded-full w-3/4"></div>
                            </div>
                        ) : (
                            <SelectWidget
                                id="meal_recipe"
                                options={recipes}
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
