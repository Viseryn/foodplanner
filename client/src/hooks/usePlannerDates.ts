import { GlobalAppDataContext } from "@/context/GlobalAppDataContext"
import { useNullishContext } from "@/hooks/useNullishContext"
import { Meal } from "@/types/api/Meal"
import { MAXIMUM_NUMBER_OF_DAYS_IN_PLANNER } from "@/types/constants/MAXIMUM_NUMBER_OF_DAYS_IN_PLANNER"
import { DateKey } from "@/types/DateKey"
import { GlobalAppData } from "@/types/GlobalAppData"
import { Maybe } from "@/types/Maybe"
import { dateKeyOf } from "@/util/dateKeyOf"

/**
 * Returns a map between DateKey and Meal[]. The keys are IsoStrings and range from today until `today + MAXIMUM_NUMBER_OF_DAYS_IN_PLANNER`.
 * The map values are all Meal objects of that date.
 *
 * @returns {Map<DateKey, Meal[]>}
 */
export const usePlannerDates = (): Map<DateKey, Meal[]> => {
    const { meals }: Pick<GlobalAppData, "meals"> = useNullishContext(GlobalAppDataContext)

    const dateMealMap: Map<DateKey, Meal[]> = getDefaultDateMealMap()

    if (meals.isLoading) {
        return dateMealMap
    }

    meals.data.forEach((meal: Meal) => {
        const mealDates: Maybe<Meal[]> = dateMealMap.get(dateKeyOf(new Date(meal.date)))

        if (mealDates) {
            mealDates.push(meal)
        }
    })

    return dateMealMap
}

const getRelevantDates = (): DateKey[] => {
    return [...Array(MAXIMUM_NUMBER_OF_DAYS_IN_PLANNER).keys()].map((index: number) => {
        const date = new Date()
        date.setHours(0, 0, 0, 0)
        date.setDate(date.getDate() + index)
        return dateKeyOf(date)
    })
}

const getDefaultDateMealMap = (): Map<DateKey, Meal[]> => {
    const dates: DateKey[] = getRelevantDates()
    return new Map(dates.map(date => [date, [] as Meal[]]))
}
