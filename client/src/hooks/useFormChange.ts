import { Form } from "@/types/forms/Form"
import { ChangeEvent } from "react"

type AllowedInputElement = HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement

type onChangeHandler<T extends AllowedInputElement> = (event: ChangeEvent<T>) => void

export const useFormChange = <T extends Form, S extends AllowedInputElement>(setFormData: SetState<T>): onChangeHandler<S> => {
    return (event: ChangeEvent<S>): void => {
        const targetValue: string | string[] = "selectedOptions" in event.target
            ? [...event.target.selectedOptions].map(option => option.value)
            : event.target.value

        setFormData(prev => ({
            ...prev,
            [event.target.name]: targetValue,
        }))
    }
}
