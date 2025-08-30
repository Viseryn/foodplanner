/**
 * Given an array `list`, moves the item at `fromIndex` to `toIndex` and returns the new array.
 * Does not modify the original array.
 */
export const swap = <T>(list: T[], fromIndex: number, toIndex: number): T[] => {
    const resultList: T[] = Array.from(list)

    const [removedItem]: T[] = resultList.splice(fromIndex, 1)
    resultList.splice(toIndex, 0, removedItem)

    return resultList
}
