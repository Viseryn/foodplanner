import { getDayAtMidnight } from "@/pages/Planner/util/getDayAtMidnight"

export const getTodayAtMidnight = (): Date => getDayAtMidnight(new Date())
