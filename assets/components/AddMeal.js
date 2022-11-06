/**********************************
 * ./assets/components/AddMeal.js *
 **********************************/

import React, { Component } from 'react';
import axios from 'axios';
import { Navigate, useParams } from 'react-router-dom';

import Heading from './Heading';
import { InputLabel, SelectRow, SelectWidget } from './Forms';
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
            <div className="px-6 pb-24 pt-6 md:pb-6 md:my-6 md:mr-6 w-full min-h-screen md:w-fit md:min-h-fit bg-white dark:bg-[#29353f] md:rounded-3xl -md:max-w-[900px]">
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
                    className="max-w-[400px] -md:max-w-[900px]"
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
 * TODO: Dark Mode
 */
function UserGroupRadio() {
    return (
        <div className="flex flex-wrap justify-between gap-2">
            <div className="grow">
                <input 
                    id="userGroup_benedikt" 
                    type="radio" 
                    name="meal[userGroup]" 
                    defaultValue="3" 
                    className="peer hidden" 
                />
                <label 
                    htmlFor="userGroup_benedikt" 
                    className="file-label cursor-pointer overflow-ellipsis rounded-full h-10 px-3 font-semibold text-sm transition duration-300 flex items-center active:scale-95 text-blue-600 bg-gray-100 hover:bg-blue-100 active:bg-blue-300 active:text-blue-800 peer-checked:bg-blue-200"
                >
                    <span className="material-symbols-rounded">face</span>
                    <span className="label-content mr-1 ml-3">Benedikt</span>
                </label>
            </div>
            <div className="grow">
                <input 
                    id="userGroup_kevin" 
                    type="radio" 
                    name="meal[userGroup]" 
                    defaultValue="2" 
                    className="peer hidden" 
                />
                <label 
                    htmlFor="userGroup_kevin" 
                    className="file-label cursor-pointer overflow-ellipsis rounded-full h-10 px-3 font-semibold text-sm transition duration-300 flex items-center active:scale-95 text-blue-600 bg-gray-100 hover:bg-blue-100 active:bg-blue-300 active:text-blue-800 peer-checked:bg-blue-200"
                >
                    <span className="material-symbols-rounded">face_6</span>
                    <span className="label-content mr-1 ml-3">Kevin</span>
                </label>
            </div>
            <div className="grow">
                <input 
                    id="userGroup_all" 
                    type="radio" 
                    name="meal[userGroup]" 
                    defaultValue="1" 
                    className="peer hidden"
                    defaultChecked="checked" 
                />
                <label 
                    htmlFor="userGroup_all" 
                    className="file-label cursor-pointer overflow-ellipsis rounded-full h-10 px-3 font-semibold text-sm transition duration-300 flex items-center active:scale-95 text-blue-600 bg-gray-100 hover:bg-blue-100 active:bg-blue-300 active:text-blue-800 peer-checked:bg-blue-200"
                >
                    <span className="material-symbols-rounded">groups</span>
                    <span className="label-content mr-1 ml-3">Alle</span>
                </label>
            </div>
        </div>
    );
}


/**
 * MealCategoryRadio
 * 
 * Renders a horizontal list of radio buttons with the different meal categories.
 * 
 * TODO: Currently this is static. Make this dependent on the actual meal categories in the database.
 * TODO: Dark Mode
 */
function MealCategoryRadio() {
    return (
        <div className="flex flex-wrap justify-between gap-2">
            <div className="grow">
                <input 
                    id="mealCategory_breakfast" 
                    type="radio" 
                    name="meal[mealCategory]" 
                    defaultValue="1" 
                    className="peer hidden" 
                />
                <label 
                    htmlFor="mealCategory_breakfast" 
                    className="file-label cursor-pointer overflow-ellipsis rounded-full h-10 px-3 font-semibold text-sm transition duration-300 flex items-center active:scale-95 text-blue-600 bg-gray-100 hover:bg-blue-100 active:bg-blue-300 active:text-blue-800 peer-checked:bg-blue-200"
                >
                    <span className="material-symbols-rounded">bakery_dining</span>
                    <span className="label-content mr-1 ml-3">Morgens</span>
                </label>
            </div>
            <div className="grow">
                <input 
                    id="mealCategory_lunch" 
                    type="radio" 
                    name="meal[mealCategory]" 
                    defaultValue="2" 
                    className="peer hidden" 
                    defaultChecked="checked" 
                />
                <label 
                    htmlFor="mealCategory_lunch" 
                    className="file-label cursor-pointer overflow-ellipsis rounded-full h-10 px-3 font-semibold text-sm transition duration-300 flex items-center active:scale-95 text-blue-600 bg-gray-100 hover:bg-blue-100 active:bg-blue-300 active:text-blue-800 peer-checked:bg-blue-200"
                >
                    <span className="material-symbols-rounded">fastfood</span>
                    <span className="label-content mr-1 ml-3">Mittags</span>
                </label>
            </div>
            <div className="grow">
                <input 
                    id="mealCategory_dinner" 
                    type="radio" 
                    name="meal[mealCategory]" 
                    defaultValue="3" 
                    className="peer hidden" 
                />
                <label 
                    htmlFor="mealCategory_dinner" 
                    className="file-label cursor-pointer overflow-ellipsis rounded-full h-10 px-3 font-semibold text-sm transition duration-300 flex items-center active:scale-95 text-blue-600 bg-gray-100 hover:bg-blue-100 active:bg-blue-300 active:text-blue-800 peer-checked:bg-blue-200"
                >
                    <span className="material-symbols-rounded">ramen_dining</span>
                    <span className="label-content mr-1 ml-3">Abends</span>
                </label>
            </div>
        </div>
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