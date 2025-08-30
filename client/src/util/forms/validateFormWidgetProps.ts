import { Form } from "@/types/forms/Form"
import { FormWidgetProps } from "@/types/props/FormWidgetProps"

export const validateFormWidgetProps = <T extends Form>(props: FormWidgetProps<T>): void => {
    if (!(props.field in props.formData)) {
        console.log(props.formData)
        throw new Error(`Field ${(props.field)} does not exist in formData.`)
    }
}
