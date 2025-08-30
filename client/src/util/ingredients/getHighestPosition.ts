import { Sortable } from "@/types/Sortable"

/**
 * Returns the highest `position` of the given `Sortable` objects.
 * Always returns a non-negative number.
 * If all positions are negative, `0` is returned.
 */
export const getHighestPosition = (items: Sortable[]): number => {
    if (items.length === 0) {
        return 0
    }

    const max: number = Math.max(...items.map(item => item.position))

    return max >= 0 ? max : 0
}
