import { getDayAtMidnight } from "@/pages/Planner/util/getDayAtMidnight"

export const getNextDayAtMidnight = (date: Date | string): Date => {
    const nextDay: Date = new Date(date)
    nextDay.setDate(nextDay.getDate() + 1)

    return getDayAtMidnight(nextDay)
}
