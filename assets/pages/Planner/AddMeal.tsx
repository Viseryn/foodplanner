/**************************************
 * ./assets/pages/Planner/AddMeal.tsx *
 **************************************/

import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { NavigateFunction, useNavigate, useParams } from 'react-router-dom'

import Label from '@/components/form/Label'
import RadioWidget from '@/components/form/Radio/RadioWidget'
import SelectWidget from '@/components/form/Select/SelectWidget'
import nameFromId from '@/components/form/util/nameFromId'
import Button from '@/components/ui/Buttons/Button'
import Card from '@/components/ui/Card'
import Spacer from '@/components/ui/Spacer'
import Spinner from '@/components/ui/Spinner'
import DayModel from '@/types/DayModel'
import MealCategoryModel from '@/types/MealCategoryModel'
import RecipeModel from '@/types/RecipeModel'
import UserGroupModel from '@/types/UserGroupModel'
import getOptions from '@/util/getOptions'

/**
 * A component that renders a form to add a new meal. 
 * Consists of a list of Days, UserGroups, Recipes and MealCategories.
 * 
 * @component
 * 
 * @todo Skeleton colors and sizes
 */
export default function AddMeal({ days, recipes, mealCategories, userGroups, setSidebar, setTopbar }: {
    days: EntityState<Array<DayModel>>
    recipes: EntityState<Array<RecipeModel>>
    mealCategories: EntityState<Array<MealCategoryModel>>
    userGroups: EntityState<Array<UserGroupModel>>
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
                days.load()
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
    return <div className="pb-24 md:pb-4 md:w-[450px]">
        <Spacer height="6" />

        {isLoading ? (
            <Spinner />
        ) : (
            <div className="mx-4 md:mx-0">
                <form onSubmit={handleSubmit}>
                    <Card>
                        <Label htmlFor="meal_day">Für welchen Tag?</Label>
                        {days.isLoading ? (
                            <div role="status" className="animate-pulse">
                                <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded-full w-2/3 mb-2"></div>
                                <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded-full w-3/4"></div>
                            </div>
                        ) : (
                            <div className="grid grid-cols-5 gap-2">
                                {days.data.map(day => 
                                    <div key={day.id}>
                                        <input
                                            id={`day_${day.id}`}
                                            name={nameFromId("meal_day")}
                                            type="radio"
                                            defaultValue={day.id}
                                            defaultChecked={id == day.id.toString()}
                                            className="peer hidden"
                                        />
                                        <label 
                                            htmlFor={`day_${day.id}`}
                                            className="cursor-pointer rounded-xl h-12 transition duration-300 flex flex-col justify-center items-center active:scale-95 text-primary-100 dark:text-primary-dark-100 bg-secondary-100 dark:bg-secondary-dark-100 hover:bg-secondary-200 dark:hover:bg-secondary-dark-200 peer-checked:bg-secondary-200  dark:peer-checked:bg-secondary-dark-200 border border-secondary-200 dark:border-secondary-dark-200"
                                        >
                                            <span className="text-sm font-semibold">{day.weekday.slice(0, 2)}</span>
                                            <span className="text-xs">{day.date.slice(0, day.date.lastIndexOf('.') + 1)}</span>
                                        </label>
                                    </div>
                                )}
                            </div>
                        )}

                        <Spacer height="6" />

                        <Label htmlFor="meal_mealCategory">Wann ist die Mahlzeit?</Label>
                        {mealCategories.isLoading ? (
                            <div role="status" className="animate-pulse">
                                <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded-full w-2/3 mb-2"></div>
                                <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded-full w-3/4"></div>
                            </div>
                        ) : (
                            <RadioWidget
                                id="meal_mealCategory"
                                options={getOptions(mealCategories.data)}
                            />
                        )}

                        <Spacer height="6" />

                        <Label htmlFor="meal_userGroup">Für wen ist die Mahlzeit?</Label>
                        {userGroups.isLoading ? (
                            <div role="status" className="animate-pulse">
                                <div className="h-4 bg-notification-500 dark:bg-notification-700 rounded-full w-2/3" />
                                <Spacer height="1" />
                                <div className="h-4 bg-notification-500 dark:bg-notification-700 rounded-full w-3/4" />
                            </div>
                        ) : (
                            <RadioWidget
                                id="meal_userGroup"
                                options={getOptions(userGroups.data)}
                            />
                        )}
                    </Card>

                    <Spacer height="4" />

                    <Card>
                        <Label htmlFor="meal_recipe">Welches Rezept?</Label>
                        {recipes.isLoading ? (
                            <div role="status" className="max-w-sm animate-pulse">
                                <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded-full w-2/3 mb-2"></div>
                                <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded-full w-3/4"></div>
                            </div>
                        ) : (
                            <SelectWidget
                                id="meal_recipe"
                                options={getOptions(recipes.data)}
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
                                isFloating={true}
                            />
                        }
                    </div> 
                </form>
            </div>
        )}
    </div>
}
