/**************************************
 * ./assets/pages/Planner/Planner.tsx *
 **************************************/

import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import swal from 'sweetalert'

import Button from '@/components/ui/Buttons/Button'
import Card from '@/components/ui/Card'
import Carousel from '@/components/ui/Carousel/Carousel'
import Heading from '@/components/ui/Heading'
import Spacer from '@/components/ui/Spacer'
import Spinner from '@/components/ui/Spinner'
import useMediaQuery from '@/hooks/useMediaQuery'
import DayModel from '@/types/DayModel'
import IngredientModel from '@/types/IngredientModel'
import MealModel from '@/types/MealModel'
import RecipeModel from '@/types/RecipeModel'
import getFullIngredientName from '@/util/getFullIngredientName'
import MealTile from './components/MealTile'

/**
 * A component that renders the Weekly Planner. Shows a list of ten Day entities which each have a 
 * variable amount of Meal entities. At the bottom of each day, there is a button for adding a meal 
 * to that specific day. There is also a SidebarActionButton that puts all ingredients of all meals 
 * into the ShoppingList.
 * 
 * @component
 */
export default function Planner({ days, recipes, shoppingList, setSidebar, setTopbar }: {
    days: EntityState<Array<DayModel>>
    recipes: EntityState<Array<RecipeModel>>
    shoppingList: EntityState<Array<IngredientModel>>
    setSidebar: SetSidebarAction
    setTopbar: SetTopbarAction
}): JSX.Element {
    // Counts how often the SAB was pressed. Will update the SAB on change.
    const [countSabClicks, setCountSabClicks] = useState<number>(0)

    // Whether the SidebarActionButton should display "Done!" on click.
    const [showSabDone, setShowSabDone] = useState<boolean>(false)

    // Current mediaQuery selector
    const medium = useMediaQuery()

    /**
     * When called, opens a SweetAlert. If it is confirmed, then the Meal Delete API is called and 
     * the days are updated. If cancelled, nothing happens.
     * 
     * @param meal A Meal object.
     */
    const deleteMeal = (meal: MealModel): void => {
        swal({
            dangerMode: true,
            icon: 'error',
            title: 'Mahlzeit wirklich löschen?',
            buttons: {
                cancel: { text: 'Abbrechen' },
                confirm: { text: 'Löschen' },
            },
        }).then(confirm => {
            if (!confirm) {
                return
            }
            
            axios.get('/api/meals/delete/' + meal.id).then(() => { 
                days.load() 
            })
        })
    }

    /**
     * Adds the ingredients of all meals to the shopping list via the ShoppingList Add API.
     */
    const handleAddShoppingList = (): void => {
        if (days.isLoading || shoppingList.isLoading) {
            return
        }

        // Collect all recipes
        let recipesTmp: Array<RecipeModel> = []

        days.data.forEach(day => {
            day.meals.forEach(meal => {
                // Since the meal only has basic information of the recipe, find the full recipe object in props.recipes.
                const recipeIds: Array<number> = recipes.data.map((recipe: RecipeModel) => recipe.id)
                const index: number = recipeIds.indexOf(meal.recipe.id)
                recipesTmp.push(recipes.data[index])
            })
        })

        // Collect all ingredients as strings
        let ingredients: Array<string> = []

        recipesTmp.forEach(recipe => {
            recipe.ingredients.forEach(ingredient => {
                ingredients.push(getFullIngredientName(ingredient))
            })
        });

        // Make API call
        (async () => {
            try {
                await axios.post('/api/shoppinglist/add', JSON.stringify(ingredients))
                shoppingList.load()
            } catch (error) {
                console.log(error)
            }
        })()
        
        // Trigger update for the SAB
        setShowSabDone(true)
        setCountSabClicks(count => count + 1)
    }

    // Calls the Update Days API, which removes all unnecessary Day object (past days and days further away than ten).
    useEffect(() => {
        if (days.isLoading) { 
            return
        }

        (async () => {
            try {
                await axios.get('/api/days/update')
            } catch (error) {
                console.log(error)
            }
        })()
    }, [days.isLoading])

    // Update sidebar action button when shopping list changes or when pressed.
    useEffect(() => {
        if (days.isLoading) {
            setSidebar('planner')
        }

        setSidebar('planner', {
            visible: true,
            icon: showSabDone ? 'done' : 'add_shopping_cart', 
            label: showSabDone 
                ? 'Erledigt!' + (countSabClicks > 1 ? ' (' + countSabClicks + ')' : '')
                : 'Zur Einkaufsliste',
            onClick: handleAddShoppingList,
        })
    }, [days.data, days.isLoading, shoppingList.isLoading, showSabDone, countSabClicks])

    // Load layout
    useEffect(() => {
        setTopbar({
            title: 'Wochenplan',
        })

        // Scroll to top
        window.scrollTo(0, 0)
    }, [])
    
    // Configure carousel
    const gap: number = 5

    // Map the number of columns to each media query selector
    const mediaColumnMap: Map<string, number> = new Map()
    mediaColumnMap.set('md', 3)
    mediaColumnMap.set('lg', 5)
    mediaColumnMap.set('xl', 5)

    // Calculate the width of a container for the carousel
    const calculateWidth = (visibleItems: number, gap: number): number => {
        // Each column is 160px, each gap is 4*gap wide, padding of 16 on both ends
        return visibleItems * 160 + (visibleItems - 1) * 4 * gap + 32
    }

    // Build styling classes for the width of the container for the carousel
    const mediumStyle: Map<string, { width: string }> = new Map()
    mediaColumnMap.forEach((columns, medium) => {
        mediumStyle.set(medium, { width: `${calculateWidth(columns ?? 0, gap)}px` })
    })

    // Render Planner component
    return <div className={`pb-24 md:pb-4 w-full`} style={mediumStyle.get(medium)}>
        <Spacer height="6" />

        {days.isLoading ? (
            <Spinner /> /** @todo Add skeletons */
        ) : (
            mediaColumnMap.has(medium)
            ? <Card>
                <Carousel visibleItems={mediaColumnMap.get(medium)} gap={gap} translation={160 + gap * 4}>
                    {days.data.map(day => 
                        <div key={day.id} className="flex flex-col gap-2 w-40">
                            <div className="flex justify-between items-center pb-2">
                                <Heading size="lg" style="pl-2">
                                    {day.weekday},<br />
                                    {day.date}
                                </Heading>

                                <Button
                                    location={`/planner/add/${day.id}`}
                                    icon="add"
                                    role="secondary"
                                />
                            </div>

                            {day.meals.map(meal =>
                                <MealTile key={meal.id} meal={meal} deleteMeal={deleteMeal} isSmall={true} />
                            )}
                        </div>
                    )}
                </Carousel>
            </Card>
            : <div className="pb-[5.5rem] mx-4 flex flex-col gap-4">
                {days.data.map(day =>
                    <Card key={day.id}>
                        <Heading size="xl">{day.weekday}, {day.date}</Heading>

                        <Spacer height="4" />

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {day.meals.map(meal =>
                                <MealTile key={meal.id} meal={meal} deleteMeal={deleteMeal} />
                            )}

                            <Link
                                to={'/planner/add/' + day.id}
                                className={
                                    (day.meals.length > 0 ? ('h-14' + (day.meals.length % 2 === 0 ? ' sm:col-span-2' : ' sm:h-40') ) : 'h-40') 
                                    + ' w-full rounded-2xl transition duration-300 text-primary-100 dark:text-primary-dark-100 bg-secondary-200 dark:bg-secondary-dark-200 hover:bg-secondary-300 dark:hover:bg-secondary-dark-300 font-semibold text-lg flex justify-center items-center flex-row md:flex-col gap-4'
                                }
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
}
