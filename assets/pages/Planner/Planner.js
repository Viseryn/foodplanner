/*************************************
 * ./assets/pages/Planner/Planner.js *
 *************************************/

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

import Heading from '../../components/ui/Heading';
import Spinner from '../../components/ui/Spinner';
import IconButton from '../../components/ui/IconButton';
import Button from '../../components/ui/Buttons';

/**
 * Planner
 * 
 * A Component for showing a list of all Meals.
 * Collects the data from the Day List API
 * in the /src/Controller/DayController.php.
 * 
 * @component
 * @property {function} setSidebarActiveItem
 * @property {function} setSidebarActionButton
 * @property {arr} days 
 * @property {boolean} isLoadingDays
 * @property {function} setLoadingDays
 * @property {function} setLoadingShoppingList
 */
export default function Planner(props) {
    /**
     * State variables
     */
    const [buttonCounter, setButtonCounter] = useState(0);
    const [isShoppingListButtonVisible, setShoppingListButtonVisible] = useState(true);

    /**
     * deleteMeal
     * 
     * When called, opens a SweetAlert. If it is confirmed,
     * then the Meal Delete API is called and the days are 
     * updated. If cancelled, nothing happens.
     * 
     * @param {int} id 
     */
    const deleteMeal = (id) => {
        swal({
            dangerMode: true,
            icon: 'error',
            title: 'Mahlzeit wirklich löschen?',
            buttons: {
                cancel: 'Abbrechen',
                confirm: 'Löschen',
            },
        }).then(confirm => {
            if (confirm) {
                axios
                    .get('/api/meals/delete/' + id)
                    .then(() => props.setLoadingDays(true))
                ;
            }
        });
    }

    /**
     * handleAddShoppingList
     * 
     * Adds the ingredients of all meals 
     * to the shopping list via the 
     * ShoppingList Add API.
     */
    const handleAddShoppingList = () => {
        // Collect all recipes
        let recipes = [];

        props.days.forEach(day => {
            day.meals.forEach(meal => {
                recipes.push(meal.recipe);
            });
        });

        // Make API call
        axios
            .post('/api/shoppinglist/add', JSON.stringify(recipes))
            .then(() => props.setLoadingShoppingList(true))
        ;
        

        // Hide button for adding to shopping list
        setShoppingListButtonVisible(false);
        setButtonCounter(buttonCounter => {
            return buttonCounter + 1;
        });
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

    useEffect(() => {
        if (!props.isLoadingDays) {
            props.setSidebarActionButton({
                visible: true,
                icon: isShoppingListButtonVisible ? 'add_shopping_cart' : 'done', 
                label: isShoppingListButtonVisible 
                    ? 'Zur Einkaufsliste' 
                    : ('Erledigt!' + (buttonCounter > 1 
                        ? ' (' + buttonCounter + ')' 
                        : '')
                    ),
                onClickHandler: handleAddShoppingList,
            });
        }
    }, [props.days, isShoppingListButtonVisible, buttonCounter]);
    
    /**
     * Render
     */
    return (
        <div className="px-6 pb-24 pt-6 md:pb-6 md:my-6 md:mr-6 w-full min-h-screen md:min-h-fit bg-white dark:bg-[#29353f] md:rounded-3xl md:max-w-[900px]">
            <div className="flex justify-between items-start">
                <Heading>Wochenplan</Heading>

                <IconButton onClick={() => props.setLoadingDays(true)}>sync</IconButton>
            </div>

            {props.isLoadingDays ? (
                <Spinner />
            ) : (
                <>
                    {props.days.map(day =>
                        <React.Fragment key={day.id}>
                            <Link to={'/planner/add/' + day.id} className="text-lg font-semibold text-blue-600 dark:text-gray-100 mb-4 block">
                                {day.weekday}, {day.date}
                            </Link>

                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-10">
                                {day.meals.map(meal =>
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
                                                onClick={() => deleteMeal(meal.id)}
                                                className="cursor-pointer transition duration-300 group-hover:block material-symbols-rounded text-white absolute top-2 right-2
                                                hover:bg-gray-600/40 p-1 rounded-full"
                                            >
                                                close
                                            </span>
                                        </div>
                                    </div>
                                )}

                                {day.meals.length == 0 &&
                                    <span className="text-gray-400">
                                        <Link to={'/planner/add/' + day.id}>Noch nichts geplant!</Link>
                                    </span>
                                }
                            </div>
                        </React.Fragment>
                    )}

                    <div className="flex justify-end">
                        <Button 
                            to="/planner/add"
                            label="Neue Mahlzeit hinzufügen"
                            icon="add"
                            elevated="true"
                        />
                    </div>
                </>
            )}
        </div>
    );
}
