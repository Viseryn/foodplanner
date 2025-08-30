import { defaultStyling } from "@/styles/defaultFormWidgetStyling"
import { Form } from "@/types/forms/Form"
import { FormWidgetProps } from "@/types/props/FormWidgetProps"

export const useFormWidgetStyling = <T extends Form>(props: FormWidgetProps<T>, defaultWidgetStyling?: string): string => {
    return "styleOverride" in props
        ? props.styleOverride
        : defaultWidgetStyling ?? defaultStyling + (props?.style ? ` ${props.style}` : "")
}
