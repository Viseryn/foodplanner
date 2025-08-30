import { Label } from "@/components/form/Label"
import { ReactElement } from "react"

type LabelledFormWidgetProps = {
    id: string
    label: string
    containerStyle?: string
    widget: ReactElement
}

export const LabelledFormWidget = (props: LabelledFormWidgetProps): ReactElement => {
    return (
        <div className={props.containerStyle ?? ""}>
            <Label htmlFor={props.id}>{props.label}</Label>
            {props.widget}
        </div>
    )
}
