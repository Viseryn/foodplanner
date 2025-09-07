import Button from "@/components/ui/Buttons/Button"
import { OuterCard } from "@/components/ui/Cards/OuterCard"
import Heading from "@/components/ui/Heading"
import Spacer from "@/components/ui/Spacer"
import { getLocaleDateString } from "@/pages/Planner/util/getLocaleDateString"
import { getWeekday } from "@/pages/Planner/util/getWeekday"
import { Meal } from "@/types/api/Meal"
import { DateKey } from "@/types/DateKey"
import { StringBuilder } from "@/util/StringBuilder"
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

    return <OuterCard key={date.toLocaleDateString()} className={"!rounded-lg first:!rounded-t-3xl last:!rounded-b-3xl"}>
        <Heading size="lg" style={"place-self-center"}>{getWeekday(date)}, {getLocaleDateString(date)}</Heading>

        <Spacer height="4" />

        <div className="grid grid-cols-1 gap-1 place-items-center">
            {meals.map(meal =>
                <MealTile key={meal.id} meal={meal} />,
            )}

            <Button
                label={"Neue Mahlzeit"}
                icon={"add"}
                role={"secondary"}
                location={`/planner/add/${dateKey}`}
                className={
                    meals.length > 0
                        ? "mt-4"
                        : "h-[7.5rem] w-full !rounded-3xl justify-center"
                }
            />
        </div>
    </OuterCard>
}
