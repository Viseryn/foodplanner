/*******************************************************
 * ./assets/pages/Planner/components/DayCardMobile.tsx *
 *******************************************************/

import React from 'react'
import { Link } from 'react-router-dom'

import Card from '@/components/ui/Card'
import Heading from '@/components/ui/Heading'
import Spacer from '@/components/ui/Spacer'
import DayModel from '@/types/DayModel'
import MealModel from '@/types/MealModel'
import MealTile from './MealTile'

/**
 * A components that renders a card for a Day object for the mobile view.
 * 
 * @param props
 * @param props.day A DayModel object.
 * @param props.deleteMeal A function that deletes a MealModel object from a DayModel object.
 */
export default function DayCardMobile({ day, deleteMeal }: {
    day: DayModel
    deleteMeal: (meal: MealModel) => void
}): JSX.Element {
    return <Card key={day.id}>
        <Heading size="xl">{day.weekday}, {day.date}</Heading>

        <Spacer height="4" />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {day.meals.map(meal =>
                <MealTile key={meal.id} meal={meal} deleteMeal={deleteMeal} />
            )}

            <Link
                to={`/planner/add/${day.id}`}
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
}
