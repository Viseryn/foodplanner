import { getLocaleDateString } from "@/pages/Planner/util/getLocaleDateString"
import { getWeekday } from "@/pages/Planner/util/getWeekday"
import { Meal } from "@/types/api/Meal"
import { DateKey } from "@/types/DateKey"
import { ModelOption } from "@/types/options/ModelOption"
import { RadioOption } from "@/types/options/RadioOption"

export class DayOption extends ModelOption<[DateKey, Meal[]], RadioOption> {
    getOption(): RadioOption {
        const dateKey: DateKey = this.entity[0]

        return {
            id: dateKey,
            label: getLocaleDateString(new Date(dateKey)).slice(0, getLocaleDateString(new Date(dateKey)).lastIndexOf('.') + 1),
            icon: getWeekday(new Date(dateKey)).slice(0, 2), // by abuse of notation, the icon is the weekday shortcut
            value: dateKey,
        }
    }
}
