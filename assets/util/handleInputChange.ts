import { Form } from "@/types/forms/Form"
import React from "react"

export const handleInputChange = <T extends Form> (
    event: React.ChangeEvent<HTMLInputElement>,
    setFormData: SetState<T>
): void => {
    setFormData(prev => ({
        ...prev,
        [event.target.name]: event.target.value,
    }))
}
