/**************************************
 * ./assets/pages/Planner/Planner.tsx *
 **************************************/

import axios, { AxiosResponse } from 'axios'
import React, { useEffect, useState } from 'react'
import swal from 'sweetalert'

import Card from '@/components/ui/Card'
import Carousel from '@/components/ui/Carousel/Carousel'
import Spacer from '@/components/ui/Spacer'
import useMediaQuery from '@/hooks/useMediaQuery'
import DayModel from '@/types/DayModel'
import IngredientModel from '@/types/IngredientModel'
import MealModel from '@/types/MealModel'
import DayCardDesktop from './components/DayCardDesktop'
import DayCardMobile from './components/DayCardMobile'
import DaySkeletonDesktop from './components/DaySkeletonDesktop'
import DaySkeletonMobile from './components/DaySkeletonMobile'
import getLastIngredientPosition from '@/util/ingredients/getLastIngredientPosition'
import useTimeout from '@/hooks/useTimeout'

/**
 * A component that renders the Weekly Planner. Shows a list of ten Day entities which each have a 
 * variable amount of Meal entities. At the bottom of each day, there is a button for adding a meal 
 * to that specific day. There is also a SidebarActionButton that puts all ingredients of all meals 
 * into the ShoppingList.
 * 
 * @component
 */
export default function Planner({ days, shoppingList, setSidebar, setTopbar }: {
    days: EntityState<Array<DayModel>>
    shoppingList: EntityState<Array<IngredientModel>>
    setSidebar: SetSidebarAction
    setTopbar: SetTopbarAction
}): JSX.Element {
    // Counts how often the SAB was pressed. Will update the SAB on change.
    const [countSabClicks, setCountSabClicks] = useState<number>(0)

    // Whether the SidebarActionButton should display "Done!" on click.
    const [showSabDone, setShowSabDone] = useState<boolean>(false)

    // Timeout for Done-info
    const { clearTimeout: clearDoneTimeout, startTimeout: startDoneTimeout } = useTimeout(() => {
        setShowSabDone(false)
        setCountSabClicks(0)
    }, 5000)

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
            buttons: ["Abbrechen", "Löschen"],
        }).then(confirm => {
            if (!confirm) {
                return
            }
            
            axios.delete('/api/meals/' + meal.id).then(() => {
                days.load() 
            })
        })
    }

    /**
     * Adds the ingredients of all meals to the shopping list via the ShoppingList Add API.
     */
    const handleAddShoppingList = async (): Promise<void> => {
        if (days.isLoading || shoppingList.isLoading) {
            return
        }

        clearDoneTimeout()

        const lastPosition = getLastIngredientPosition(shoppingList.data)
        const ingredientsToAdd: IngredientModel[] = days.data?.flatMap(day =>
            day.meals.flatMap(meal => meal.recipe.ingredients)
        )?.map((ingredient, index): IngredientModel => ({
            ...ingredient,
            position: lastPosition + index + 1,
            checked: false,
        }))

        if (ingredientsToAdd?.length) {
            const response: AxiosResponse<IngredientModel[]>
                = await axios.post('/api/storages/shoppinglist/ingredients', ingredientsToAdd)
            shoppingList.setData([...shoppingList.data, ...response.data])
        }
        
        // Trigger update for the SAB
        setShowSabDone(true)
        setCountSabClicks(count => count + 1)
        startDoneTimeout()
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
                await axios.patch('/api/days')
            } catch (error) {
                console.log(error)
            }
        }

        updateDays()
    }, [])

    useEffect(() => {
        if (days.isLoading || days.data.length === 0) {
            return
        }

        const isPastDay = (day: DayModel): boolean => {
            const today: Date = new Date()
            today.setHours(0, 0, 0, 0)
            return day.timestamp * 1000 < today.getTime() // day.timestamp is in seconds, getTime() in milliseconds
        }

        const daysCopy: DayModel[] = [...days.data]
        while (isPastDay(daysCopy.at(0)!)) {
            daysCopy.shift()
        }
        days.setData(daysCopy)
    }, [days.isLoading])
    
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
