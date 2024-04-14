import Card from '@/components/ui/Card'
import Carousel from '@/components/ui/Carousel/Carousel'
import Spacer from '@/components/ui/Spacer'
import useMediaQuery from '@/hooks/useMediaQuery'
import useTimeout from '@/hooks/useTimeout'
import DayModel from '@/types/DayModel'
import IngredientModel from '@/types/IngredientModel'
import MealModel from '@/types/MealModel'
import { BasePageComponentProps } from "@/types/BasePageComponentProps"
import getLastIngredientPosition from '@/util/ingredients/getLastIngredientPosition'
import { tryApiRequest } from "@/util/tryApiRequest"
import axios, { AxiosResponse } from 'axios'
import React, { ReactElement, useEffect, useState } from 'react'
import swal from 'sweetalert'
import DayCardDesktop from './components/DayCardDesktop'
import DayCardMobile from './components/DayCardMobile'
import DaySkeletonDesktop from './components/DaySkeletonDesktop'
import DaySkeletonMobile from './components/DaySkeletonMobile'

type PlannerProps = BasePageComponentProps & {
    days: EntityState<Array<DayModel>>
    shoppingList: EntityState<Array<IngredientModel>>
}

export const Planner = ({ days, shoppingList, setSidebar, setTopbar }: PlannerProps): ReactElement => {
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

    const deleteMeal = (meal: MealModel): void => {
        swal({
            dangerMode: true,
            icon: "error",
            title: "Mahlzeit wirklich löschen?",
            buttons: ["Abbrechen", "Löschen"],
        }).then(confirm => {
            if (!confirm) {
                return
            }

            void tryApiRequest("DELETE", `/api/meals/${meal.id}`, async (apiUrl) => {
                const response: AxiosResponse = await axios.delete(apiUrl)
                days.load()
                return response
            })
        })
    }

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
            await tryApiRequest("POST", "/api/storages/shoppinglist/ingredients", async (apiUrl) => {
                const response: AxiosResponse<IngredientModel[]> = await axios.post(apiUrl, ingredientsToAdd)
                shoppingList.setData([...shoppingList.data, ...response.data])
                return response
            })
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

    useEffect(() => {
        setTopbar({
            title: 'Wochenplan',
        })

        window.scrollTo(0, 0)

        void tryApiRequest("PATCH", "/api/days", async (apiUrl) => {
            return await axios.patch(apiUrl)
        })
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
