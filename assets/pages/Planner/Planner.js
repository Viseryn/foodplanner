/*************************************
 * ./assets/pages/Planner/Planner.js *
 *************************************/

import React, { useEffect, useState }   from 'react'
import { Link }                         from 'react-router-dom'
import axios                            from 'axios'

import Card                             from '../../components/ui/Card'
import Spacer                           from '../../components/ui/Spacer'
import Spinner                          from '../../components/ui/Spinner'

/**
 * Planner
 * 
 * A Component for showing a list of all Meals.
 * Collects the data from the Day List API
 * in the /src/Controller/DayController.php.
 * 
 * A component that renders the Weekly Planner.
 * Shows a list of ten Day entities which each
 * have a variable amount of Meal entities. At 
 * the bottom of each day, there is a button for 
 * adding a meal to that specific day. There is 
 * also a SidebarActionButton that puts all 
 * ingredients of all meals into the ShoppingList.
 * 
 * @component
 * @param {object} props
 * @param {function} props.setSidebar
 * @param {function} props.setTopbar
 * @param {object} props.days
 */
export default function Planner({ days, ...props }) {
    /**
     * Counts how often the SAB was pressed.
     * Will update the SAB on change.
     * 
     * @type {[number, function]}
     */
    const [countSabClicks, setCountSabClicks] = useState(0)

    /**
     * Whether the SidebarActionButton should
     * display "Done!" on click.
     * 
     * @type {[boolean, function]}
     */
    const [showSabDone, setShowSabDone] = useState(false)

    /**
     * deleteMeal
     * 
     * When called, opens a SweetAlert. If it is confirmed,
     * then the Meal Delete API is called and the days are 
     * updated. If cancelled, nothing happens.
     * 
     * @param {object} meal 
     */
    const deleteMeal = (meal) => {
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
                    .get('/api/meals/delete/' + meal.id)
                    .then(() => {
                        // Update days
                        days.setLoading(true)

                        // Refresh Data Timestamp
                        axios.get('/api/refresh-data-timestamp/set')
                    })
            }
        })
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
        let recipes = []

        days.data?.forEach(day => {
            day.meals.forEach(meal => {
                recipes.push(meal.recipe)
            })
        })

        // Make API call
        axios
            .post('/api/shoppinglist/add', JSON.stringify(recipes))
            .then(() => props.setLoadingShoppingList(true))
        

        // Hide button for adding to shopping list
        setShowSabDone(true)
        setCountSabClicks(count => {
            return count + 1
        })
    }

    /**
     * Update sidebar action button when 
     * shopping list changes or when pressed.
     */
    useEffect(() => {
        if (days.isLoading) {
            props.setSidebar('planner')
        }

        props.setSidebar('planner', {
            visible: true,
            icon: showSabDone ? 'done' : 'add_shopping_cart', 
            label: showSabDone 
                ? 'Erledigt!' + (countSabClicks > 1 && ' (' + countSabClicks + ')')
                : 'Zur Einkaufsliste',
            onClick: handleAddShoppingList,
        })
    }, [days.data, days.isLoading, showSabDone, countSabClicks])

    /**
     * Load layout
     */
    useEffect(() => {
        // Load topbar
        props.setTopbar({
            title: 'Wochenplan',
        })

        // Scroll to top
        window.scrollTo(0, 0)
    }, [])
    
    /**
     * Render Planner
     */
    return (
        <div className="pb-24 md:pb-4 w-full md:w-fit md:min-w-[450px] md:max-w-[900px]">
            <Spacer height="6" />

            {days.isLoading ? (
                <Spinner /> /** @todo Add skeletons */
            ) : (
                <div className="pb-[5.5rem] md:pb-0 mx-4 md:ml-0 flex flex-col gap-4">
                {/* The container might be bigger than the screen (md+), so leave extra margin to the right. */}
                    {days.data?.map(day =>
                        <Card key={day.id}>
                            <div className="text-xl font-semibold text-primary-200 dark:text-secondary-dark-900">
                                <span>{day.weekday}, {day.date}</span>
                            </div>

                            <Spacer height="4" />

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {day.meals.map(meal =>
                                    <div key={meal.id} className="h-40 w-full rounded-2xl transition duration-300">
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
                                                <div className="text-xl mr-4">{meal.recipe.title}</div>
                                                <div className="text-md flex items-center mt-2">
                                                    <span className="material-symbols-rounded mr-2">{meal.user_group_icon}</span>
                                                    <span>{meal.user_group}</span>
                                                </div>
                                                <div className="text-md flex items-center mt-2">
                                                    <span className="material-symbols-rounded mr-2">{meal.meal_category.icon}</span>
                                                    <span>{meal.meal_category.name}</span>
                                                </div>
                                            </Link>
                                            <span 
                                                onClick={() => deleteMeal(meal)}
                                                className="cursor-pointer transition duration-300 group-hover:block material-symbols-rounded text-white absolute top-2 right-2
                                                hover:bg-gray-600/40 p-1 rounded-full"
                                            >
                                                close
                                            </span>
                                        </div>
                                    </div>
                                )}

                                <Link 
                                    to={'/planner/add/' + day.id} 
                                    className={(day.meals.length > 0 ? 'h-14 md:h-40' : 'h-40') + ' w-full rounded-2xl transition duration-300 text-primary-100 dark:text-primary-dark-100 bg-secondary-200 dark:bg-secondary-dark-200 hover:bg-secondary-300 dark:hover:bg-secondary-dark-300 font-semibold text-lg flex justify-center items-center flex-row md:flex-col gap-4'}
                                >
                                    <span className="material-symbols-rounded">add</span>
                                    <span className="mx-6">Neue Mahlzeit</span>
                                </Link>
                            </div>
                        </Card>
                    )}
                </div>
            )}
        </div>
    )
}
