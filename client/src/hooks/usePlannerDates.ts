import { GlobalAppDataContext } from "@/context/GlobalAppDataContext"
import { UserContext } from "@/context/UserContext"
import { findEntityByIri } from "@/hooks/findEntityByIri"
import { useNullishContext } from "@/hooks/useNullishContext"
import { useStateCache } from "@/hooks/useStateCache"
import { Iri } from "@/types/api/Iri"
import { Meal } from "@/types/api/Meal"
import { MealCategory } from "@/types/api/MealCategory"
import { User } from "@/types/api/User"
import { UserGroup } from "@/types/api/UserGroup"
import { MAXIMUM_NUMBER_OF_DAYS_IN_PLANNER } from "@/types/constants/MAXIMUM_NUMBER_OF_DAYS_IN_PLANNER"
import { DateKey } from "@/types/DateKey"
import { GlobalAppData } from "@/types/GlobalAppData"
import { ManagedResource } from "@/types/ManagedResource"
import { Maybe } from "@/types/Maybe"
import { dateKeyOf } from "@/util/dateKeyOf"
import { toId } from "@/util/toId"

/**
 * Returns a map between DateKey and Meal[]. The keys are IsoStrings and range from today until `today + MAXIMUM_NUMBER_OF_DAYS_IN_PLANNER`.
 * The map values are all Meal objects of that date.
 *
 * @returns {Map<DateKey, Meal[]>}
 */
export const usePlannerDates = (): Map<DateKey, Meal[]> => {
    const { meals, userGroups, mealCategories }: Pick<GlobalAppData, "meals" | "userGroups" | "mealCategories"> = useNullishContext(GlobalAppDataContext)
    const user: ManagedResource<User> = useNullishContext(UserContext)

    const onlyShowOwnMeals: boolean = useStateCache(state => state.onlyShowOwnMeals)

    const dateMealMap: Map<DateKey, Meal[]> = getDefaultDateMealMap()

    if (meals.isLoading || userGroups.isLoading || mealCategories.isLoading || user.isLoading) {
        return dateMealMap
    }

    meals
        .data
        .filter((meal: Meal) => {
            const userGroup: Maybe<UserGroup> = findEntityByIri<UserGroup>(meal.userGroup, userGroups)

            if (!onlyShowOwnMeals || !userGroup) {
                return true
            }

            return userGroup.users.map(toId).includes(user.data.id)
        })
        .sort((a: Meal, b: Meal) => {
            const mealCategoryRank = (mealCategory: Iri<MealCategory>): number => {
                return findEntityByIri(mealCategory, mealCategories)?.id ?? 0
            }

            return mealCategoryRank(a.mealCategory) - mealCategoryRank(b.mealCategory)
        })
        .forEach((meal: Meal) => {
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
