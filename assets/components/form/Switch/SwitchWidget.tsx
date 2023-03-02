/*********************************************
 * ./assets/components/form/SwitchWidget.tsx *
 *********************************************/

import React from 'react'

import nameFromId from '../util/nameFromId'

/**
 * A component that renders a switch button.
 * 
 * @component
 * @param props
 * @param props.id The id of the switch button.
 * @param props.checked Optional: Whether the switch is checked or not.
 */
export default function SwitchWidget({ id, checked, ...props }: {
    id: string
    checked?: boolean
}): JSX.Element {
    return <>
        <input 
            type="checkbox" 
            id={id} 
            name={nameFromId(id)} 
            className="sr-only peer"
            // value={checked}
            defaultChecked={checked}
            {...props}
        />
        <div 
            className="w-11 h-6 bg-[#e0e4d6] dark:bg-[#43483e] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all transition duration-300 dark:border-gray-600 peer-checked:bg-primary-100 dark:peer-checked:bg-primary-dark-200"
        />
    </>
}
