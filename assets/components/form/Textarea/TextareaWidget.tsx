/********************************************************
 * ./assets/components/form/Textarea/TextareaWidget.tsx *
 ********************************************************/

import React from 'react'
import nameFromId from '../util/nameFromId'

/**
 * TextareaWidget
 * 
 * A component that renders a textarea field.
 * 
 * @component
 * @param props
 * @param props.id The id of the textarea field.
 */
export default function TextareaWidget({ id, ...props }: {
    id: string
}): JSX.Element {
    return <textarea
        id={id}
        name={nameFromId(id)}
        className="dark:placeholder-secondary-dark-900 dark:bg-secondary-dark-200 block border border-gray-300 dark:border-none rounded-md px-4 py-2 w-full transition duration-300 focus:border-primary-100 resize-none"
        {...props}
    ></textarea>
}
