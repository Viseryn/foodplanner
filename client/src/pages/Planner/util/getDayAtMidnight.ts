export const getDayAtMidnight = (date: Date | string): Date => {
    const dateCopy: Date = new Date(date)
    dateCopy.setHours(0, 0, 0, 0)

    return dateCopy
}
