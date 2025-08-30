import { getDayAtMidnight } from "@/pages/Planner/util/getDayAtMidnight"
import { getTodayAtMidnight } from "@/pages/Planner/util/getTodayAtMidnight"

export const isPastDay = (date: Date): boolean => getDayAtMidnight(new Date(date)) < getTodayAtMidnight()
