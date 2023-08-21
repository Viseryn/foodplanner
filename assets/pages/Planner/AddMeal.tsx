/**************************************
 * ./assets/pages/Planner/AddMeal.tsx *
 **************************************/

import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { NavigateFunction, useNavigate, useParams } from 'react-router-dom'

import Label from '@/components/form/Label'
import RadioWidget from '@/components/form/Radio/RadioWidget'
import nameFromId from '@/components/form/util/nameFromId'
import Button from '@/components/ui/Buttons/Button'
import Card from '@/components/ui/Card'
import Notification from '@/components/ui/Notification'
import Spacer from '@/components/ui/Spacer'
import DayModel from '@/types/DayModel'
import MealCategoryModel from '@/types/MealCategoryModel'
import RecipeModel from '@/types/RecipeModel'
import UserGroupModel from '@/types/UserGroupModel'
import getOptions from '@/util/getOptions'
import setChecked from '@/util/setChecked'
import DayRadioSkeleton from './components/DayRadioSkeleton'
import RadioSkeleton from './components/RadioSkeleton'
import RecipeListSkeleton from './components/RecipeListSkeleton'
import SearchWidget from './components/SearchWidget'
import getEntityOptions from '@/util/getEntityOptions'
import UserGroupOption from '@/types/UserGroupOption'
import MealCategoryOption from '@/types/MealCategoryOption'
import SettingsModel from '@/types/SettingsModel'

/**
 * A component that renders a form to add a new meal. 
 * Consists of a list of Days, UserGroups, Recipes and MealCategories.
 * 
 * @component
 */
export default function AddMeal({ days, recipes, mealCategories, userGroups, settings, setSidebar, setTopbar }: {
    days: EntityState<Array<DayModel>>
    recipes: EntityState<Array<RecipeModel>>
    mealCategories: EntityState<Array<MealCategoryModel>>
    userGroups: EntityState<Array<UserGroupModel>>
    settings: EntityState<SettingsModel>
    setSidebar: SetSidebarAction
    setTopbar: SetTopbarAction
}): JSX.Element {
    // Type for route parameters
    type AddMealRouteParams = {
        id?: string
    }

    // Options
    const userGroupOptions = getEntityOptions(userGroups, UserGroupOption)
    const mealCategoryOptions = getEntityOptions(mealCategories, MealCategoryOption)

    // The id parameter of the route '/planner/add/:id'
    const { id }: AddMealRouteParams = useParams()

    // A function that can change the location. Needed for the redirect after submit.
    const navigate: NavigateFunction = useNavigate()

    // The input value of the recipe search field
    const [recipeQuery, setRecipeQuery] = useState<string>('')

    // The ID of the currently selected recipe
    const [selectedRecipe, setSelectedRecipe] = useState<number>(0)

    // Whether a warning should be shown
    const [showWarning, setShowWarning] = useState<boolean>(false)

    // Everytime the query changes, check if the currently selected recipe is still in the seach 
    // result and if not, deselect it
    useEffect(() => {
        let isRecipeInResults: boolean = false

        if (recipes.isLoading) {
            return
        }

        recipes.data
            ?.filter(recipe => recipe.title.toLowerCase().includes(recipeQuery.toLowerCase()))
            ?.forEach(recipe => {
                if (recipe.id == selectedRecipe) {
                    isRecipeInResults = true
                }
            })
        
        if (!isRecipeInResults) {
            setSelectedRecipe(0)
        }
    }, [recipeQuery])

    /**
     * Submits the form data to the Meal Add API.
     * 
     * @param event A submit form event.
     */
    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        const formData = new FormData(event.currentTarget)

        // If no recipe was collected, don't submit form
        if (selectedRecipe == 0) {
            setShowWarning(true)
            return
        }

        const apiCall = async (): Promise<void> => {
            try {
                // Send form data to Meal Add API
                await axios.post('/api/meals', formData)
                days.load()
                navigate('/planner')
            } catch (error) {
                console.log(error)
            }
        }

        apiCall()
    }

    // Load layout
    useEffect(() => {
        setSidebar('planner')
        setTopbar({
            title: 'Neue Mahlzeit',
            showBackButton: true,
            onBackButtonClick: () => navigate(-1),
        })

        // Scroll to top on rerender
        window.scrollTo(0, 0)
    }, [])

    // Render AddMeal
    return <div className="pb-24 md:pb-4 md:pr-4 md:max-w-[900px]">
        <Spacer height="6" />

        <div className="mx-4 md:mx-0">
            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
                    <div className="md:order-last">
                        <Card>
                            <Label htmlFor="meal_day">Für welchen Tag?</Label>
                            {days.isLoading ? (
                                <DayRadioSkeleton />
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
                                                className="cursor-pointer rounded-xl h-12 transition duration-300 flex flex-col justify-center items-center active:scale-95 text-primary-100 dark:text-primary-dark-100 bg-secondary-100 dark:bg-secondary-dark-100 peer-checked:bg-secondary-200 dark:peer-checked:bg-secondary-dark-200 border border-secondary-200 dark:border-secondary-dark-200"
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
                            {mealCategories.isLoading || settings.isLoading ? (
                                <RadioSkeleton />
                            ) : (
                                <RadioWidget
                                    id="meal_mealCategory"
                                    options={setChecked(getOptions(mealCategoryOptions), settings.data.standardMealCategory?.id)}
                                />
                            )}

                            <Spacer height="6" />

                            <Label htmlFor="meal_userGroup">Für wen ist die Mahlzeit?</Label>
                            {userGroups.isLoading || settings.isLoading ? (
                                <RadioSkeleton />
                            ) : (
                                <RadioWidget
                                    id="meal_userGroup"
                                    options={setChecked(getOptions(userGroupOptions), settings.data.standardUserGroup?.id)}
                                />
                            )}
                        </Card>

                        <div className="flex justify-end md:pt-4">
                            {!days.isLoading && !mealCategories.isLoading && !recipes.isLoading && !userGroups.isLoading && 
                                <Button
                                    type="submit"
                                    icon="save" 
                                    label="Speichern" 
                                    outlined={true}
                                    isFloating={true}
                                />
                            }
                        </div> 
                    </div>

                    <Card>
                        <Label htmlFor="meal_recipe">Welches Rezept?</Label>
                        {recipes.isLoading ? (
                            <RecipeListSkeleton />
                        ) : (
                            <div>
                                <SearchWidget
                                    inputValue={recipeQuery}
                                    setInputValue={setRecipeQuery}
                                    placeholder="Suche nach Rezepten ..."
                                />

                                {showWarning &&
                                    <>
                                        <Spacer height="4" />
                                    
                                        <Notification
                                            title="Du musst ein Rezept auswählen!"
                                            color="red"
                                            icon="error"
                                        />
                                    </>
                                }

                                <Spacer height="4" />

                                <div className="grid grid-cols-2 gap-2">
                                    {recipes.data
                                        .filter(recipe => recipe.title.toLowerCase().includes(recipeQuery.toLowerCase()))
                                        .map(recipe =>
                                            <div key={recipe.id}>
                                                <input
                                                    id={`recipe_${recipe.id}`}
                                                    name={nameFromId("meal_recipe")}
                                                    type="radio"
                                                    defaultValue={recipe.id}
                                                    className="peer hidden"
                                                />
                                                <label 
                                                    htmlFor={`recipe_${recipe.id}`}
                                                    className="flex flex-row items-center cursor-pointer rounded-md h-12 font-[500] w-full transition duration-300 active:scale-95 text-primary-100 dark:text-primary-dark-100 bg-secondary-100 dark:bg-secondary-dark-100 peer-checked:bg-secondary-200 dark:peer-checked:bg-secondary-dark-200 border border-secondary-200 dark:border-secondary-dark-200"
                                                    onClick={() => {
                                                        setSelectedRecipe(recipe.id)
                                                        setShowWarning(false)
                                                    }}
                                                >
                                                    <img 
                                                        className="rounded-md h-12 w-12 object-cover transition duration-300" 
                                                        src={recipe.image ? (recipe.image.directory + recipe.image.filename) : '/img/default.jpg'}
                                                        alt={recipe.title}
                                                    />
                                                    <div className="px-4 whitespace-nowrap overflow-hidden text-ellipsis">{recipe.title}</div>
                                                </label>
                                            </div>
                                        )
                                    }

                                    {recipes.data.filter(recipe => recipe.title.toLowerCase().includes(recipeQuery.toLowerCase())).length == 0 &&
                                        <div className="col-span-2">
                                            <Notification title="Keine Rezepte gefunden." />
                                        </div>
                                    }
                                </div>
                            </div>
                        )}
                    </Card>
                </div>

                <div className="pb-[5.5rem] md:pb-0" />
            </form>
        </div>
    </div>
}
