import { GlobalAppDataContext } from "@/context/GlobalAppDataContext"
import { SidebarContext } from "@/context/SidebarContext"
import { TopbarContext } from "@/context/TopbarContext"
import { findEntityByIri } from "@/hooks/findEntityByIri"
import { useNullishContext } from "@/hooks/useNullishContext"
import { usePlannerDates } from "@/hooks/usePlannerDates"
import { useScrollCache } from "@/hooks/useScrollCache"
import { stateCacheStore, useStateCache } from "@/hooks/useStateCache"
import useTimeout from "@/hooks/useTimeout"
import { TranslationFunction, useTranslation } from "@/hooks/useTranslation"
import { StandardContentWrapper } from "@/layouts/StandardContentWrapper"
import { PlannerTranslations } from "@/pages/Planner/PlannerTranslations"
import { Detached } from "@/types/api/Detached"
import { Ingredient } from "@/types/api/Ingredient"
import { Meal } from "@/types/api/Meal"
import { Recipe } from "@/types/api/Recipe"
import { SHOPPINGLIST_IRI } from "@/types/constants/SHOPPINGLIST_IRI"
import { DateKey } from "@/types/DateKey"
import { GlobalAppData } from "@/types/GlobalAppData"
import { Sidebar } from "@/types/sidebar/Sidebar"
import { StorageIngredient } from "@/types/StorageIngredient"
import { Topbar } from "@/types/topbar/Topbar"
import { ApiRequest } from "@/util/ApiRequest"
import { delay } from "@/util/delay"
import { getHighestPosition } from "@/util/ingredients/getHighestPosition"
import { ReactElement, useCallback, useEffect, useState } from "react"
import { DayCard } from "./components/DayCard"
import DaySkeletonMobile from "./components/DaySkeletonMobile"

export const Planner = (): ReactElement => {
    const sidebar: Sidebar = useNullishContext(SidebarContext)
    const topbar: Topbar = useNullishContext(TopbarContext)
    const t: TranslationFunction = useTranslation(PlannerTranslations)
    const { meals, recipes, shoppingList }: Pick<GlobalAppData, "meals" | "recipes" | "shoppingList"> = useNullishContext(GlobalAppDataContext)
    const dates: Map<DateKey, Meal[]> = usePlannerDates()

    useScrollCache("planner")

    const onlyShowOwnMeals: boolean = useStateCache(state => state.onlyShowOwnMeals)
    const toggleOnlyShowOwnMeals = useCallback((): void => {
        stateCacheStore.getState().toggle("onlyShowOwnMeals")
    }, [])

    // Counts how often the SAB was pressed. Will update the SAB on change.
    const [countSabClicks, setCountSabClicks] = useState<number>(0)

    // Whether the SidebarActionButton should display "Done!" on click.
    const [showSabDone, setShowSabDone] = useState<boolean>(false)

    // Timeout for Done-info
    const { clearTimeout: clearDoneTimeout, startTimeout: startDoneTimeout } = useTimeout(() => {
        setShowSabDone(false)
        setCountSabClicks(0)
    }, 5000)

    const handleAddShoppingList = async (): Promise<void> => {
        if (meals.isLoading || shoppingList.isLoading) {
            return
        }

        clearDoneTimeout()

        const highestPosition = getHighestPosition(shoppingList.data)

        const getIngredientsFromMeal = (meal: Meal): Ingredient[] => {
            return findEntityByIri<Recipe>(meal.recipe, recipes)?.ingredients ?? []
        }

        const ingredientsToAdd: Detached<StorageIngredient>[] = Array
            .from<Meal[]>(dates.values())
            .flatMap((meals: Meal[]) => meals.flatMap(getIngredientsFromMeal))
            .map((ingredient: Ingredient, index: number) => ({
                "@type": "Ingredient",
                name: ingredient.name,
                quantityUnit: ingredient.quantityUnit,
                quantityValue: ingredient.quantityValue,
                position: highestPosition + index + 1,
                storage: SHOPPINGLIST_IRI,
                checked: false,
            }))

        const ingredientsForShoppingList: StorageIngredient[] = []

        const postRequests: Promise<boolean>[] = ingredientsToAdd?.map((ingredient: Detached<StorageIngredient>) =>
            ApiRequest
                .post<StorageIngredient>("/api/ingredients", ingredient)
                .ifSuccessful(responseData => {
                    ingredientsForShoppingList.push(responseData)
                })
                .execute(),
        )

        await Promise.all(postRequests)
        shoppingList.setData([...ingredientsForShoppingList, ...shoppingList.data])

        // Trigger update for the SAB
        setShowSabDone(true)
        setCountSabClicks(count => count + 1)
        startDoneTimeout()
    }

    // Update sidebar action button when shopping list changes or when pressed.
    useEffect(() => {
        if (meals.isLoading) {
            sidebar.configuration
                   .activeItem("planner")
                   .rebuild()
        }

        sidebar.configuration
               .activeItem("planner")
               .actionButton({
                   isVisible: true,
                   icon: showSabDone ? "done" : "add_shopping_cart",
                   label: showSabDone
                       ? t("sab.label.done") + (countSabClicks > 1 ? ` (${countSabClicks})` : "")
                       : t("sab.label"),
                   onClick: handleAddShoppingList,
               })
               .rebuild()
    }, [meals.data, meals.isLoading, shoppingList.isLoading, showSabDone, countSabClicks])


    useEffect(() => {
        topbar
            .configuration
            .title(t("topbar.title"))
            .dropdownMenuItems([
                {
                    icon: onlyShowOwnMeals ? "group_search" : "person_search",
                    label: onlyShowOwnMeals ? t("dropdown.show.all.meals") : t("dropdown.show.own.meals"),
                    onClick: async () => {
                        await delay(300)
                        toggleOnlyShowOwnMeals()
                    },
                },
            ])
            .mainViewWidth("max-w-[900px]")
            .rebuild()
    }, [onlyShowOwnMeals])


    return (
        <StandardContentWrapper>
            {meals.isLoading ? (
                <div className="pb-[5.5rem] mx-4 flex flex-col gap-4">
                    <DaySkeletonMobile />
                    <DaySkeletonMobile />
                    <DaySkeletonMobile />
                </div>
            ) : (
                <div className="pb-[5.5rem] flex flex-col gap-0.5">
                    {[...dates.entries()].map((entry: [DateKey, Meal[]]) =>
                        <DayCard key={entry[0]} mapEntry={entry} />
                    )}
                </div>
            )}
        </StandardContentWrapper>
    )
}
