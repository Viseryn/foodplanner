import DayModel from "@/types/DayModel"
import { ModelOption } from "@/types/ModelOption"
import { RadioOption } from "@/types/RadioOption"

export class DayOption extends ModelOption<DayModel, RadioOption> {
    getOption(): RadioOption {
        return {
            id: `day_${this.entity.id}`,
            label: this.entity.date.slice(0, this.entity.date.lastIndexOf('.') + 1),
            icon: this.entity.weekday.slice(0, 2), // by abuse of notation, the icon is the weekday shortcut
            value: this.entity.id.toString(),
        }
    }
}
