/**********************************
 * ./assets/components/Planner.js *
 **********************************/

import React, {Component} from 'react';
import axios from 'axios';
import { Link, Navigate, useParams } from 'react-router-dom';

import Heading from './Heading';
import Spinner from './Util';

/**
 * Planner
 * 
 * 
 */
export default class Planner extends Component {
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
            days: [], 
            loading: true, 
        };
    }

    /**
     * componentDidMount
     * 
     * Updates the sidebar on load and loads days.
     */
    componentDidMount() {
        this.props.updateSidebar('planner');
        this.props.updateSAB(true, 'add', '/planner/add');

        this.getDays();
    }

    /**
     * componentWillUnmount
     * 
     * Updates the sidebar on unload.
     */
    componentWillUnmount() {
        this.props.updateSidebar();
        this.props.updateSAB();
    }

    /**
     * getDays
     * 
     * Calls the Days List API and loads the
     * data into the state variable.
     */
    getDays() {
        axios.get('/api/days').then(
            days => {
                this.setState({ 
                    days: JSON.parse(days.data), 
                    loading: false
                })
            }
        );
    }
    
    /**
     * render
     */
    render() {
        return (
            <>
                <Heading title="Wochenplan" />

                {this.state.loading ? (
                    <Spinner />
                ) : (
                    <>
                        {this.state.days.map(day =>
                            <React.Fragment key={day.id}>
                                <Link to={'/planner/add/' + day.id} className="text-lg font-semibold text-blue-600 mb-4 block">
                                    {day.weekday}, {day.date}
                                </Link>

                                <Meals meals={day.meals} dayId={day.id} />
                            </React.Fragment>
                        )}
                    </>
                )}
            </>
        )
    }
}

/**
 * Meals
 * 
 * Renders a list of given Meals.
 * 
 * @param {[meals: arr, dayId: number, ...props: any[]]} props An array of props.
 * @returns JSX.Element
 */
function Meals({meals = [], dayId = 0, ...props}) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-10">
            {meals.map(meal =>
                <div key={meal.id} className="h-40 w-full shadow-md rounded-2xl border border-gray-200 transition duration-300 hover:scale-95 hover:shadow-lg hover:bg-gray-50">
                    {meal.recipe.image.filename != null
                        ? <Link to={'/recipe/' + meal.recipe.id}  className="relative">
                            <div className="absolute bottom-4 px-6 text-white font-semibold text-xl z-10">
                                {meal.meal_category.name} für {meal.user_group}: {meal.recipe.title}
                            </div>
                            <img 
                                className="rounded-2xl h-40 w-full object-cover brightness-75" 
                                src={meal.recipe.image.directory + meal.recipe.image.filename} 
                                alt={meal.recipe.title}
                            />
                        </Link>
                        : <Link 
                            to={'/recipe/' + meal.recipe.id} 
                            className="h-full w-full p-6 font-semibold text-xl z-10 flex items-end"
                        >
                            <div>{meal.meal_category.name} für {meal.user_group}: {meal.recipe.title}</div>
                        </Link>
                    }
                </div>
            )}

            {meals.length == 0 &&
                <span className="text-gray-400">
                    <Link to={'/planner/add/' + dayId}>Noch nichts geplant!</Link>
                </span>
            }
        </div>
    );
}