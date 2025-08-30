import { OuterCard } from "@/components/ui/Cards/OuterCard"
import Heading from "@/components/ui/Heading"
import Spacer from "@/components/ui/Spacer"
import { getLocaleDateString } from "@/pages/Planner/util/getLocaleDateString"
import { getWeekday } from "@/pages/Planner/util/getWeekday"
import { Meal } from "@/types/api/Meal"
import { DateKey } from "@/types/DateKey"
import { ReactElement } from "react"
import { Link } from "react-router-dom"
import MealTile from "./MealTile"

/**
 * A components that renders a card for a Day object for the mobile view.
 * 
 * @param props
 * @param props.mapEntry An entry in the DateMealsMap.
 */
export default function DayCardMobile({ mapEntry }: {
    mapEntry: [DateKey, Meal[]]
}): ReactElement {
    const [dateKey, meals] = mapEntry
    const date: Date = new Date(dateKey)

    return <OuterCard key={date.toLocaleDateString()}>
        <Heading size="xl">{getWeekday(date)}, {getLocaleDateString(date)}</Heading>

        <Spacer height="4" />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {meals.map(meal =>
                <MealTile key={meal.id} meal={meal} />
            )}

            <Link
                to={`/planner/add/${dateKey}`}
                className={
                    (meals.length > 0 ? ('h-14' + (meals.length % 2 === 0 ? ' sm:col-span-2' : ' sm:h-40') ) : 'h-40')
                    + ' w-full rounded-2xl transition duration-300 text-primary-100 dark:text-primary-dark-100 bg-secondary-200 dark:bg-secondary-dark-200 hover:bg-secondary-300 dark:hover:bg-secondary-dark-300 font-semibold text-lg flex justify-center items-center flex-row md:flex-col gap-4'
                }
            >
                <span className="material-symbols-rounded">add</span>
                <span className="mx-6">Neue Mahlzeit</span>
            </Link>
        </div>
    </OuterCard>
}
