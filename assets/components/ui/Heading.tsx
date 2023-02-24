/**************************************
 * ./assets/components/ui/Heading.tsx *
 **************************************/

import React from 'react'

/**
 * Heading
 * 
 * A component that renders a huge heading.
 * 
 * @component
 * @param props
 * @param props.style Additional styling classes.
 * @param props.children The DOM children of the Heading component.
 * 
 * @example <Heading style="mb-6">This is a title</Heading>
 */
export default function Heading({ style = '', children }: {
    style?: string
    children: React.ReactNode
}): JSX.Element {
    return <div className={'text-3xl font-semibold text-primary-200 dark:text-secondary-dark-900 ' + style}>
        {children}
    </div>
}

/**
 * SubHeading
 * 
 * A component that renders a large heading.
 * 
 * @component
 * @param props
 * @param props.style Additional styling classes.
 * @param props.children The DOM children of the SubHeading component.
 * 
 * @example <SubHeading style="mb-6">This is a title</SubHeading>
 */
export function SubHeading({ style = '', children }: {
    style?: string
    children: React.ReactNode
}): JSX.Element {
    return <div className={'text-lg font-semibold text-primary-200 dark:text-secondary-dark-900 ' + style}>
        {children}
    </div>
}

/**
 * SecondHeading
 * 
 * A component that renders a very large heading.
 * 
 * @component
 * @param props
 * @param props.style Additional styling classes.
 * @param props.children The DOM children of the SecondHeading component.
 * 
 * @example <SecondHeading style="mb-6">This is a title</SecondHeading>
 */
export function SecondHeading({ style = '', children }: {
    style?: string
    children: React.ReactNode
}): JSX.Element {
    return <div className={'text-xl font-semibold text-primary-200 dark:text-secondary-dark-900 ' + style}>
        {children}
    </div>
}
