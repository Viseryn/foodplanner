/**************************************
 * ./assets/pages/Planner/Planner.tsx *
 **************************************/

import axios from 'axios'
import React, { useEffect, useState } from 'react'
import swal from 'sweetalert'

import Card from '@/components/ui/Card'
import Carousel from '@/components/ui/Carousel/Carousel'
import Spacer from '@/components/ui/Spacer'
import useMediaQuery from '@/hooks/useMediaQuery'
import DayModel from '@/types/DayModel'
import IngredientModel from '@/types/IngredientModel'
import MealModel from '@/types/MealModel'
import RecipeModel from '@/types/RecipeModel'
import getFullIngredientName from '@/util/getFullIngredientName'
import DayCardDesktop from './components/DayCardDesktop'
import DayCardMobile from './components/DayCardMobile'
import DaySkeletonDesktop from './components/DaySkeletonDesktop'
import DaySkeletonMobile from './components/DaySkeletonMobile'

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

        // Calls the Update Days API, which removes all unnecessary Day object (past days and days further away than ten)
        const updateDays = async () => {
            try {
                await axios.get('/api/days/update')
            } catch (error) {
                console.log(error)
            }
        }
        
        updateDays()
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

        {mediaColumnMap.has(medium) ? ( /* Desktop view (>= md) */
            days.isLoading ? (
                <DaySkeletonDesktop gap={gap} columns={mediaColumnMap.get(medium)!} />
            ) : (
                <Card>
                    <Carousel visibleItems={mediaColumnMap.get(medium)} gap={gap} translation={160 + gap * 4}>
                        {days.data.map(day => 
                            <DayCardDesktop key={day.id} day={day} deleteMeal={deleteMeal} />
                        )}
                    </Carousel>
                </Card>
            )
        ) : ( /* Mobile view (<= sm) */
            days.isLoading ? (
                <div className="pb-[5.5rem] mx-4 flex flex-col gap-4">
                    <DaySkeletonMobile />
                    <DaySkeletonMobile />
                    <DaySkeletonMobile />
                </div>
            ) : (
                <div className="pb-[5.5rem] mx-4 flex flex-col gap-4">
                    {days.data.map(day => 
                        <DayCardMobile key={day.id} day={day} deleteMeal={deleteMeal} />
                    )}
                </div>
            )
        )}
    </div>
}
