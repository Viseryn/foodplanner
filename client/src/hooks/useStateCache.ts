import { useStore } from "zustand/react"
import { createStore, StoreApi } from "zustand/vanilla"

type StateCache = {
    /** Whether the `CheckedItemList` in the shopping list is collapsed. */
    shoppingListCheckedItemListCollapsed: boolean

    /** Whether the ingredient list in a recipe is collapsed. */
    recipeIngredientsCollapsed: boolean

    /** Whether the instruction list in a recipe is collapsed. */
    recipeInstructionsCollapsed: boolean

    /** Whether the system settings in the settings page are collapsed. */
    systemSettingsCollapsed: boolean

    /** Whether only favorite recipes should be shown in the recipe list. */
    onlyShowFavoriteRecipes: boolean

    /** Whether only meals for the user's own user groups should be shown in the planner. */
    onlyShowOwnMeals: boolean

    /** The vertical scroll positions of pages. */
    scrollPositions: Record<string, number>

    /** Toggles a boolean property of the `StateCache` object. */
    toggle: (cachedState: BooleanProperty<StateCache>) => void
}

type BooleanProperty<T> = {
    [K in keyof T]: T[K] extends boolean ? K : never
}[keyof T]

/**
 * A React Zustand store that contains application wide state that is cached.
 *
 * @example const toggleFavorites = useCallback((): void => stateCacheStore.getState().toggle("onlyShowFavoriteRecipes"), [])
 */
export const stateCacheStore: StoreApi<StateCache> = createStore<StateCache>((set, get) => ({
    shoppingListCheckedItemListCollapsed: false,

    recipeIngredientsCollapsed: false,

    recipeInstructionsCollapsed: false,

    systemSettingsCollapsed: true,

    onlyShowFavoriteRecipes: false,

    onlyShowOwnMeals: false,

    scrollPositions: {},

    toggle: (stateCacheKey: BooleanProperty<StateCache>): void => {
        const currentValue: boolean = get()[stateCacheKey]
        set({ [stateCacheKey]: !currentValue })
    },
}))

/**
 * Returns a React Zustand store that contains application wide state that is cached.
 *
 * @example const checkedItemListCollapsed: boolean = useStateCache(state => state.shoppingListCheckedItemListCollapsed)
 */
export const useStateCache = <T>(selector: (state: StateCache) => T): T => useStore(stateCacheStore, selector)
