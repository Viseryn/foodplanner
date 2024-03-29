/*********************************************
 * ./assets/components/form/SelectWidget.tsx *
 *********************************************/

import React from 'react'

import SelectOption from '@/types/SelectOption'
import nameFromId from '../util/nameFromId'
import widgetStyle from '../util/widgetStyle'

/**
 * A component that renders a select input field.
 * 
 * @component
 * @param props
 * @param props.id The id of the select input field.
 * @param props.options An array of objects that represent the select options.
 * @param props.disabledOption Optional: The text of the disabled first option.
 */
export default function SelectWidget({ id, options, disabledOption, ...props }: {
    id: string
    options: Array<SelectOption>
    disabledOption?: string
}): JSX.Element {
    return <select
        id={id}
        name={nameFromId(id)}
        className={widgetStyle}
        {...props}
    >
        {disabledOption != undefined && <option disabled={true}>{disabledOption}</option>}
        {options?.map((option, index) => <option key={index} value={option.id}>{option.label}</option>)}
    </select>
}
