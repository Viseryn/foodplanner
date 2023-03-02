/*********************************************
 * ./assets/components/form/RadioWidget.tsx *
 *********************************************/

import React from 'react'

import RadioOption from '@/types/RadioOption'
import nameFromId from '../util/nameFromId'

/**
 * A component that renders a radio input field.
 * 
 * @component
 * @param props
 * @param props.id The id of the whole radio input field.
 * @param props.options An array of objects that represent the radio options.
 */
export default function RadioWidget({ id, options, ...props }: {
    id: string
    options: Array<RadioOption>
}): JSX.Element {
    return <div className="flex flex-wrap justify-between gap-2" {...props}>
        {options.map(option => 
            <div className="grow" key={option.id}>
                <input 
                    id={option.id}
                    name={nameFromId(id)} // The name of the "whole" radio field.
                    type="radio" 
                    className="peer hidden" 
                    defaultValue={option.value}
                    defaultChecked={option.checked}
                />
                <label 
                    htmlFor={option.id}
                    className="cursor-pointer overflow-ellipsis rounded-xl h-9 px-2 font-semibold text-sm transition duration-300 flex items-center active:scale-95 text-primary-100 dark:text-primary-dark-100 bg-secondary-100 dark:bg-secondary-dark-100 hover:bg-secondary-200 dark:hover:bg-secondary-dark-200 peer-checked:bg-secondary-200  dark:peer-checked:bg-secondary-dark-200 -dark:peer-checked:text-blue-800 border border-secondary-200 dark:border-secondary-dark-200"
                >
                    <span className="material-symbols-rounded">{option.icon}</span>
                    <span className="label-content mr-1 ml-3">{option.label}</span>
                </label>
            </div>
        )}
    </div>
}
