import Button from "@/components/ui/Buttons/Button"
import { OuterCard } from "@/components/ui/Cards/OuterCard"
import Heading from "@/components/ui/Heading"
import Spacer from "@/components/ui/Spacer"
import { TranslationFunction, useTranslation } from "@/hooks/useTranslation"
import { MealTile } from "@/pages/Planner/components/MealTile"
import { PlannerTranslations } from "@/pages/Planner/PlannerTranslations"
import { getLocaleDateString } from "@/pages/Planner/util/getLocaleDateString"
import { getWeekday } from "@/pages/Planner/util/getWeekday"
import { Meal } from "@/types/api/Meal"
import { DateKey } from "@/types/DateKey"
import { ReactElement } from "react"

/**
 * @param props
 * @param props.mapEntry An entry in the DateMealsMap.
 */
export const DayCard = ({ mapEntry }: {
    mapEntry: [DateKey, Meal[]]
}): ReactElement => {
    const [dateKey, meals] = mapEntry
    const date: Date = new Date(dateKey)
    const t: TranslationFunction = useTranslation(PlannerTranslations)

    return (
        <OuterCard key={date.toLocaleDateString()} className={"!rounded-lg first:!rounded-t-3xl last:!rounded-b-3xl"}>
            <div className={"flex justify-center md:justify-start items-center h-8 relative"}>
                <Heading size="lg md:text-xl" style={"pl-1"}>{getWeekday(date)}, {getLocaleDateString(date)}</Heading>

                {meals.length > 0 && (
                    <Button
                        icon={"add"}
                        role={"secondary"}
                        className={"p-[0.25rem] absolute right-0"}
                        location={`/planner/add/${dateKey}`}
                    />
                )}
            </div>

            <Spacer height="4" />

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-1 place-items-center">
                {meals.map(meal =>
                    <MealTile key={meal.id} meal={meal} />,
                )}

                {meals.length === 0 && (
                    <Button
                        label={t("button.add.meal")}
                        icon={"add"}
                        role={"secondary"}
                        location={`/planner/add/${dateKey}`}
                        isSmall={true}
                        className={"h-32 w-full !rounded-3xl justify-center"}
                    />
                )}
            </div>
        </OuterCard>
    )
}
