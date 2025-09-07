import Button from "@/components/ui/Buttons/Button"
import Heading from "@/components/ui/Heading"
import { getLocaleDateString } from "@/pages/Planner/util/getLocaleDateString"
import { getWeekday } from "@/pages/Planner/util/getWeekday"
import { Meal } from "@/types/api/Meal"
import { DateKey } from "@/types/DateKey"
import { ReactElement } from "react"
import MealTile from "./MealTile"

/**
 * A components that renders a card for a Day object for the desktop view.
 *
 * @param props
 * @param props.mapEntry An entry in the DateMealsMap.
 */
export default function DayCardDesktop({ mapEntry }: {
    mapEntry: [DateKey, Meal[]]
}): ReactElement {
    const [dateKey, meals] = mapEntry
    const date: Date = new Date(dateKey)

    return <div className="flex flex-col gap-1 w-40">
        <div className="flex justify-between items-center pb-2">
            <Heading size="lg" style="pl-2">
                {getWeekday(date)},<br />
                {getLocaleDateString(date)}
            </Heading>

            <Button
                location={`/planner/add/${dateKey}`}
                icon="add"
                role="secondary"
            />
        </div>

        {meals.map(meal =>
            <MealTile key={meal.id} meal={meal} isSmall={true} />
        )}
    </div>
}
