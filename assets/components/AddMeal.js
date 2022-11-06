/**********************************
 * ./assets/components/AddMeal.js *
 **********************************/

import React, { Component } from 'react';
import axios from 'axios';
import { Navigate, useParams } from 'react-router-dom';

import Heading from './Heading';
import { InputLabel, RadioRow, SelectWidget } from './Forms';
import Button, { SubmitButton } from './Buttons';
import Spinner from './Util';

/**
 * AddMeal
 * 
 * A Component for adding a Meal. 
 * Shows a form with which can be submitted to 
 * the Meal Add API in the 
 * /src/Controller/MealController.php.
 */
export class AddMeal extends Component {
    /**
     * constructor
     * 
     * Sets initial state variables.
     * 
     * @param {*} props 
     */
    constructor(props) {
        super(props);
        this.state = {
            isSubmittedSuccessfully: false,
            loading: true,
            loadingSubmit: false,
            recipes: [],
            days: [],
            dayId: 0,
        };
    }

    /**
     * componentDidMount
     * 
     * Updates sidebar and loads data.
     */
    componentDidMount() {
        const { id } = this.props.params; // Get id from route parameters
        this.setState({
            dayId: id
        })

        this.props.setSidebarActiveItem('planner');
        this.props.setSidebarActionButton({
            visible: true, 
            icon: 'redo', 
            path: '/planner', 
            label: 'Zurück',
        });

        this.getData();
    }

    /**
     * getData
     * 
     * Calls the Recipe List API and Day List API
     * and loads the data into the state variable.
     */
    getData() {
        axios.get('/api/recipes').then(
            recipes => {
                this.setState({ 
                    recipes: JSON.parse(recipes.data), 
                })
                
                axios.get('/api/days').then(
                    days => {
                        this.setState({ 
                            days: JSON.parse(days.data), 
                            loading: false,
                        })
                    }
                );
            }
        );
    }

    /**
     * handleSubmit
     * 
     * Submits the form data to the Recipe Add API.
     * Sets the ID of the new recipe to the states
     * variables so that the Component can redirect 
     * there after submitting.
     * 
     * @param {*} event
     */
    handleSubmit = (event) => {
        const formData = new FormData(event.target);
        event.preventDefault();

        this.setState({
            loadingSubmit: true, 
        });

        axios.post('/api/meal/add', formData).then(
            response => {
                this.setState({
                    isSubmittedSuccessfully: true,
                    loading: false,
                }
            );
        });
    };
    
    /**
     * render
     */
    render() {
        return (
            <div className="px-6 pb-24 pt-6 md:pb-6 md:my-6 md:mr-6 w-full min-h-screen md:min-h-fit bg-white dark:bg-[#29353f] md:rounded-3xl md:w-[450px]">
                {/* If the form is submitted, redirect to the weekly planner */}
                {this.state.isSubmittedSuccessfully &&
                    <Navigate to={'/planner'} />
                }

                <Heading title='Mahlzeit hinzufügen' />
                {this.state.loadingSubmit ? (
                    <Spinner />
                ) : (
                    <>

                        <form 
                            className="max-w-[450px]"
                            onSubmit={this.handleSubmit}
                        >
                            <div className="mb-6">
                                <InputLabel id="meal_day" label="Für welchen Tag?" />
                                {this.state.loading ? (
                                    <div role="status" className="animate-pulse">
                                        <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded-full w-2/3 mb-2"></div>
                                        <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded-full w-3/4"></div>
                                    </div>
                                ) : (
                                    <SelectWidget
                                        id="meal_day"
                                        options={this.state.days}
                                        defaultValue={this.state.dayId}
                                    />
                                )}
                            </div>

                            <div className="mb-6">
                                <InputLabel htmlFor="meal_userGroup" label="Für wen ist die Mahlzeit?" />
                                <UserGroupRadio />
                            </div>

                            <div className="mb-6">
                                <InputLabel htmlFor="meal_mealCategory" label="Wann ist die Mahlzeit?" />
                                <MealCategoryRadio />
                            </div>

                            <div className="mb-6">
                                <InputLabel htmlFor="meal_recipe" label="Welches Rezept?" />
                                {this.state.loading ? (
                                    <div role="status" className="max-w-sm animate-pulse">
                                        <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded-full w-2/3 mb-2"></div>
                                        <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded-full w-3/4"></div>
                                    </div>
                                ) : (
                                    <SelectWidget
                                        id="meal_recipe"
                                        options={this.state.recipes}
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
                    </>
                )}
            </div>
        )
    }
}

/**
 * UserGroupRadio
 * 
 * Renders a horizontal list of radio buttons with the different user groups.
 * 
 * TODO: Currently this is static. Make this dependent on the actual user groups in the database.
 */
function UserGroupRadio() {
    return (
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
    );
}


/**
 * MealCategoryRadio
 * 
 * Renders a horizontal list of radio buttons with the different meal categories.
 * 
 * TODO: Currently this is static. Make this dependent on the actual meal categories in the database.
 */
function MealCategoryRadio() {
    return (
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
    );
}

/**
 * When the component <AddMeal /> is called, 
 * all params become usable as props.
 */
export default (props) => (
    <AddMeal
        {...props}
        params={useParams()}
    />
);