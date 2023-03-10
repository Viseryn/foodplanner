/*******************************************************
 * ./assets/pages/Planner/components/DayCardDesktop.tsx *
 *******************************************************/

import React from 'react'

import Button from '@/components/ui/Buttons/Button'
import Heading from '@/components/ui/Heading'
import DayModel from '@/types/DayModel'
import MealModel from '@/types/MealModel'
import MealTile from './MealTile'

/**
 * A components that renders a card for a Day object for the desktop view.
 * 
 * @param props
 * @param props.day A DayModel object.
 * @param props.deleteMeal A function that deletes a MealModel object from a DayModel object.
 */
export default function DayCardDesktop({ day, deleteMeal }: {
    day: DayModel
    deleteMeal: (meal: MealModel) => void
}): JSX.Element {
    return <div className="flex flex-col gap-2 w-40">
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
}
