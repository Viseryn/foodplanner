/**************************************
 * ./assets/pages/Planner/AddMeal.tsx *
 **************************************/

import React, { useEffect, useState } from 'react'
import { NavigateFunction, useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'

import { InputLabel } from '@/components/form/Input'
import { RadioWidget } from '@/components/form/Radio'
import { SelectWidget } from '@/components/form/Select'
import Button from '@/components/ui/Buttons/Button'
import Card from '@/components/ui/Card'
import Spacer from '@/components/ui/Spacer'
import Spinner from '@/components/ui/Spinner'

/**
 * AddMeal
 * 
 * A component that renders a form to add a new meal. 
 * Consists of a list of Days, UserGroups, Recipes and MealCategories.
 * 
 * @component
 * 
 * @todo Skeleton colors and sizes
 */
export default function AddMeal({ days, mealCategories, recipes, userGroups, setSidebar, setTopbar }: {
    days: FetchableEntity<Array<Day>>
    mealCategories: FetchableEntity<Array<MealCategory>>
    recipes: FetchableEntity<Array<Recipe>>
    userGroups: FetchableEntity<Array<UserGroup>>
    setSidebar: SetSidebarAction
    setTopbar: SetTopbarAction
}): JSX.Element {
    // Type for route parameters
    type AddMealRouteParams = {
        id?: string
    }

    // The id parameter of the route '/planner/add/:id'
    const { id }: AddMealRouteParams = useParams()

    // A function that can change the location. Needed for the redirect after submit.
    const navigate: NavigateFunction = useNavigate()

    // Whether the page is loading. Will be true while the form data is processed by the API.
    const [isLoading, setLoading] = useState<boolean>(false)

    /**
     * Submits the form data to the Meal Add API.
     * 
     * @param event A submit form event.
     */
    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        const formData = new FormData(event.currentTarget)

        setLoading(true);

        (async () => {
            try {
                // Send form data to Meal Add API
                await axios.post('/api/meals/add', formData)
                days.setLoading(true)
                
                // Refresh Data Timestamp
                await axios.get('/api/refresh-data-timestamp/set')
            } catch (error) {
                console.log(error)
            }
        })()
    }

    // Navigate back to Planner component when Meal was saved
    useEffect(() => {
        if (isLoading && days.isLoading) {
            navigate('/planner')
        }
    }, [isLoading, days.isLoading])

    // Load layout
    useEffect(() => {
        setSidebar('planner')
        setTopbar({
            title: 'Neue Mahlzeit',
            showBackButton: true,
            backButtonPath: '/planner',
        })

        // Scroll to top on rerender
        window.scrollTo(0, 0)
    }, [])

    // Render AddMeal
    return (
        <div className="pb-24 md:pb-4 md:w-[450px]">
            <Spacer height="6" />

            {isLoading ? (
                <Spinner />
            ) : (
                <div className="mx-4 md:mx-0">
                    <form onSubmit={handleSubmit}>
                        <Card>
                            <InputLabel id="meal_day" label="Für welchen Tag?" />
                            {days.isLoading ? (
                                <div role="status" className="animate-pulse">
                                    <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded-full w-2/3 mb-2"></div>
                                    <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded-full w-3/4"></div>
                                </div>
                            ) : (
                                <SelectWidget
                                    id="meal_day"
                                    options={days.data}
                                    defaultValue={id}
                                />
                            )}

                            <Spacer height="6" />

                            <InputLabel id="meal_mealCategory" label="Wann ist die Mahlzeit?" />
                            {mealCategories.isLoading ? (
                                <div role="status" className="animate-pulse">
                                    <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded-full w-2/3 mb-2"></div>
                                    <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded-full w-3/4"></div>
                                </div>
                            ) : (
                                <RadioWidget
                                    id="meal_mealCategory" 
                                    options={mealCategories.data}
                                    required={true}
                                />
                            )}
                        </Card>

                        <Spacer height="4" />

                        <Card>
                            <InputLabel htmlFor="meal_recipe" label="Welches Rezept?" />
                            {recipes.isLoading ? (
                                <div role="status" className="max-w-sm animate-pulse">
                                    <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded-full w-2/3 mb-2"></div>
                                    <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded-full w-3/4"></div>
                                </div>
                            ) : (
                                <SelectWidget
                                    id="meal_recipe"
                                    options={recipes.data}
                                    required="required"
                                />
                            )}

                            <Spacer height="6" />

                            <InputLabel id="meal_userGroup" label="Für wen ist die Mahlzeit?" />
                            {userGroups.isLoading ? (
                                <div role="status" className="animate-pulse">
                                    <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded-full w-2/3 mb-2"></div>
                                    <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded-full w-3/4"></div>
                                </div>
                            ) : (
                                <RadioWidget
                                    id="meal_userGroup" 
                                    options={userGroups.data}
                                    required={true}
                                />
                            )}
                        </Card>

                        <div className="flex justify-end pb-[5.5rem] md:pb-0 md:pt-4">
                            {!days.isLoading 
                                && !mealCategories.isLoading 
                                && !recipes.isLoading 
                                && !userGroups.isLoading 
                                && <Button
                                    type="submit"
                                    icon="save" 
                                    label="Speichern" 
                                    outlined={true}
                                    floating={true}
                                />
                            }
                        </div> 
                    </form>
                </div>
            )}
        </div>
    )
}
