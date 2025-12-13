import { RadioOption } from "@/types/options/RadioOption"
import React, { ReactElement } from "react"

export const DayOptionLabel = ({ option }: { option: RadioOption }): ReactElement => (
    <label
        htmlFor={option.id}
        className={"cursor-pointer rounded-lg peer-checked:rounded-full h-12 transition duration-300 flex " +
            "flex-col active:scale-95 justify-center items-center text-primary-100 dark:text-primary-dark-100 " +
            "peer-checked:text-white dark:peer-checked:text-primary-dark-100 " +
            "bg-secondary-200 dark:bg-secondary-dark-200 " +
            "peer-checked:bg-primary-100 dark:peer-checked:bg-primary-dark-200"}
    >
        <span className="text-sm font-semibold">{option.icon}</span>
        <span className="text-xs">{option.label}</span>
    </label>
)
