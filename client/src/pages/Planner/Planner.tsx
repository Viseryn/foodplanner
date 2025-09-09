import { OuterCard } from "@/components/ui/Cards/OuterCard"
import Carousel from "@/components/ui/Carousel/Carousel"
import Spacer from "@/components/ui/Spacer"
import { GlobalAppDataContext } from "@/context/GlobalAppDataContext"
import { SidebarContext } from "@/context/SidebarContext"
import { TopbarContext } from "@/context/TopbarContext"
import { findEntityByIri } from "@/hooks/findEntityByIri"
import useMediaQuery from "@/hooks/useMediaQuery"
import { useNullishContext } from "@/hooks/useNullishContext"
import { usePlannerDates } from "@/hooks/usePlannerDates"
import { useScrollCache } from "@/hooks/useScrollCache"
import { stateCacheStore, useStateCache } from "@/hooks/useStateCache"
import useTimeout from "@/hooks/useTimeout"
import { delay } from "@/util/delay"
import { motion } from "motion/react"
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
import { getHighestPosition } from "@/util/ingredients/getHighestPosition"
import { ReactElement, useCallback, useEffect, useState } from "react"
import DayCardDesktop from "./components/DayCardDesktop"
import DayCardMobile from "./components/DayCardMobile"
import DaySkeletonDesktop from "./components/DaySkeletonDesktop"
import DaySkeletonMobile from "./components/DaySkeletonMobile"

export const Planner = (): ReactElement => {
    const sidebar: Sidebar = useNullishContext(SidebarContext)
    const topbar: Topbar = useNullishContext(TopbarContext)
    const { meals, recipes, shoppingList }: Pick<GlobalAppData, "meals" | "recipes" | "shoppingList"> = useNullishContext(GlobalAppDataContext)
    const dates: Map<DateKey, Meal[]> = usePlannerDates()

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

    // Current mediaQuery selector
    const medium = useMediaQuery()

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
                       ? "Erledigt!" + (countSabClicks > 1 ? ` (${countSabClicks})` : "")
                       : "Alles auf die Einkaufsliste",
                   onClick: handleAddShoppingList,
               })
               .rebuild()
    }, [meals.data, meals.isLoading, shoppingList.isLoading, showSabDone, countSabClicks])

    useScrollCache("planner")

    // Configure carousel
    const gap: number = 5

    // Map the number of columns to each media query selector
    const mediaColumnMap: Map<string, number> = new Map()
    mediaColumnMap.set("md", 3)
    mediaColumnMap.set("lg", 5)
    mediaColumnMap.set("xl", 5)

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

    useEffect(() => {
        topbar
            .configuration
            .title("Wochenplan")
            .dropdownMenuItems([
                {
                    icon: onlyShowOwnMeals ? "group_search" : "person_search",
                    label: onlyShowOwnMeals ? "Alle Mahlzeiten anzeigen" : "Nur meine Mahlzeiten anzeigen",
                    onClick: async () => {
                        await delay(300)
                        toggleOnlyShowOwnMeals()
                    },
                },
            ])
            .rebuild()
    }, [onlyShowOwnMeals])

    // Render Planner component
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{
                duration: 0.8,
                delay: 0.2,
                ease: [0, 0.71, 0.2, 1.01],
            }}
        >
            <div className={`pb-24 md:pb-4 w-full`} style={mediumStyle.get(medium)}>
                <Spacer height="6" />

                {mediaColumnMap.has(medium) ? ( /* Desktop view (>= md) */
                    meals.isLoading ? (
                        <DaySkeletonDesktop gap={gap} columns={mediaColumnMap.get(medium)!} />
                    ) : (
                        <OuterCard className={"!rounded-3xl"}>
                            <Carousel visibleItems={mediaColumnMap.get(medium)} gap={gap} translation={160 + gap * 4}>
                                {[...dates.entries()].map((entry: [DateKey, Meal[]]) =>
                                    <DayCardDesktop key={entry[0]} mapEntry={entry} />,
                                )}
                            </Carousel>
                        </OuterCard>
                    )
                ) : ( /* Mobile view (<= sm) */
                    meals.isLoading ? (
                        <div className="pb-[5.5rem] mx-4 flex flex-col gap-4">
                            <DaySkeletonMobile />
                            <DaySkeletonMobile />
                            <DaySkeletonMobile />
                        </div>
                    ) : (
                        <div className="pb-[5.5rem] mx-4 flex flex-col gap-1">
                            {[...dates.entries()].map((entry: [DateKey, Meal[]]) =>
                                <DayCardMobile key={entry[0]} mapEntry={entry} />,
                            )}
                        </div>
                    )
                )}
            </div>
        </motion.div>
    )
}
