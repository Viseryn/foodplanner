import { Form } from "@/types/forms/Form"
import React from "react"

export const handleSelectedUsersChange = <T extends Form> (
    event: React.ChangeEvent<HTMLSelectElement>,
    setFormData: SetState<T>
): void => {
    setFormData(prev => ({
        ...prev,
        [event.target.name]: [...event.target.selectedOptions].map(option => option.value)
    }))
}
