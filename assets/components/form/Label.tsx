/**************************************
 * ./assets/components/form/Label.tsx *
 **************************************/

import React from 'react'

/**
 * A component that renders a form widget label.
 * 
 * @component
 * @param props
 * @param props.htmlFor The id of the form field the label belongs to.
 * @param props.children The DOM children of the label element.
 */
export default function Label({ htmlFor, children, ...props }: {
    htmlFor: string
    children: React.ReactNode
}): JSX.Element {
    return <label htmlFor={htmlFor} className="text-sm font-semibold block mb-2" {...props}>
        {children}
    </label>
}
