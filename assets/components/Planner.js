/**********************************
 * ./assets/components/Planner.js *
 **********************************/

import React, {Component} from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

import Heading from './Heading';
import Spinner from './Util';
import Button from './Buttons';

/**
 * Planner
 * 
 * A Component for showing a list of all Meals.
 * Collects the data from the Day List API
 * in the /src/Controller/DayController.php.
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
            showButton: true,
        };
    }

    /**
     * componentDidMount
     * 
     * Updates the sidebar on load and loads days.
     */
    componentDidMount() {
        this.props.setSidebarActiveItem('planner');
        this.props.setSidebarActionButton({
            visible: true, 
            icon: 'add', 
            path: '/planner/add', 
            label: 'Neue Mahlzeit',
        });

        this.updateDays();
    }

    /**
     * getDays
     * 
     * Calls the Days List API and loads the
     * data into the state variable.
     */
    getDays = () => {
        axios.get('/api/days').then(
            days => {
                this.setState({ 
                    days: JSON.parse(days.data), 
                    loading: false
                })
            }
        );
    };

    /**
     * updateDays
     * 
     * Calls the Update Days API, which removes all 
     * unnecessary Days (past days and days further away
     * than ten), and calls getDays() after.
     */
    updateDays = () => {
        axios.get('/api/day/update').then(this.getDays);
    };

    /**
     * handleAddShoppingList
     */
    handleAddShoppingList = () => {
        // Collect all recipes
        let recipes = [];

        this.state.days.forEach(day => {
            day.meals.forEach(meal => {
                recipes.push(meal.recipe);
            });
        });

        axios.post('/api/shoppinglist/add', JSON.stringify(recipes));

        this.setState({
            showButton: false
        });
    };
    
    /**
     * render
     */
    render() {
        return (
            <div className="px-6 pb-24 pt-6 md:pb-6 md:my-6 md:mr-6 w-full min-h-screen md:min-h-fit bg-white dark:bg-[#29353f] md:rounded-3xl md:max-w-[900px]">
                <Heading title="Wochenplan" />

                {this.state.loading ? (
                    <Spinner />
                ) : (
                    <>
                        {this.state.days.map(day =>
                            <React.Fragment key={day.id}>
                                <Link to={'/planner/add/' + day.id} className="text-lg font-semibold text-blue-600 dark:text-gray-100 mb-4 mt-10 block">
                                    {day.weekday}, {day.date}
                                </Link>

                                <Meals meals={day.meals} dayId={day.id} />
                            </React.Fragment>
                        )}

                        <div className="flex justify-end mt-10">
                            {this.state.showButton ? (
                                <Button 
                                    to="#"
                                    label="Alles zur Einkaufsliste hinzufügen"
                                    icon="add_shopping_cart"
                                    onClick={this.handleAddShoppingList}
                                />
                            ) : (
                                <Button 
                                    to="#"
                                    label="Erledigt!"
                                    icon="done"
                                />
                            )}
                        </div>
                    </>
                )}
            </div>
        )
    }
}

/**
 * Meals
 * 
 * Renders a list of given Meals.
 */
class Meals extends Component {
    constructor(props) {
        super(props);

        this.state = {
            meals: [],
            dayId: 0,
        }
    }

    componentDidMount() {
        this.setState({
            meals: this.props.meals,
            dayId: this.props.dayId,
        });
    }
    
    /**
     * deleteMeal
     * 
     * When called, opens a SweetAlert. If it is confirmed,
     * then the Meal Delete API is called and the Meal is 
     * removed from the state. If cancelled, nothing happens.
     * 
     * @param {int} id 
     */
    deleteMeal(id) {
        swal({
            dangerMode: true,
            icon: 'error',
            title: 'Für immer löschen?',
            text: 'Gelöschte Inhalte können nicht wiederhergestellt werden.',
            buttons: {
                cancel: 'Abbrechen',
                confirm: 'Löschen',
            },
        }).then((confirm) => {
            if (confirm) {
                axios.get('/api/meal/' + id + '/delete').then(() => {
                    // Remove meal from state
                    this.setState({
                        meals: this.state.meals.filter((meal) => {
                            return meal.id !== id;
                        })
                    });
                });
            }
        });
    }

    render() {
        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {this.state.meals.map(meal =>
                    <div key={meal.id} className="h-40 w-full rounded-2xl shadow-md hover:shadow-2xl transition duration-300">
                        <div className="relative group">
                            <img 
                                className="rounded-2xl h-40 w-full object-cover brightness-[.7]" 
                                src={meal.recipe.image.filename != null 
                                    ? meal.recipe.image?.directory + meal.recipe.image.filename
                                    : '/img/default.jpg'
                                } 
                                alt={meal.recipe.title}
                            />
                            <Link 
                                to={'/recipe/' + meal.recipe.id} 
                                className="absolute w-full bottom-4 px-6 text-white font-semibold"
                            >
                                <div className="text-xl">{meal.recipe.title}</div>
                                <div className="text-md">{meal.user_group}</div>
                                <div className="text-sm">{meal.meal_category.name}</div>
                            </Link>
                            <span 
                                onClick={() => this.deleteMeal(meal.id)}
                                className="cursor-pointer transition duration-300 group-hover:block material-symbols-rounded text-white absolute top-2 right-2
                                hover:bg-gray-600/40 p-1 rounded-full"
                            >
                                close
                            </span>
                        </div>
                    </div>
                )}

                {this.state.meals.length == 0 &&
                    <span className="text-gray-400">
                        <Link to={'/planner/add/' + this.state.dayId}>Noch nichts geplant!</Link>
                    </span>
                }
            </div>
        );
    }
}