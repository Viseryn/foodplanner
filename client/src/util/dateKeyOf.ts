import { DateKey } from "@/types/DateKey"

/**
 * Given a Date, returns an ISO string of the format `YYYY-MM-DD`.
 */
export const dateKeyOf = (date: Date): DateKey => {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`
}
