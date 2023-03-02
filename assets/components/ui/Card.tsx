/***********************************
 * ./assets/components/ui/Card.tsx *
 ***********************************/

import React from 'react'

/**
 * A component that renders a card.
 * 
 * @component
 * @param props
 * @param props.style Optional: Additional styling classes.
 * @param props.children Optional: The DOM children of the Card component.
 * 
 * @example <Card style="mb-6">Lorem ipsum dolor sit amet.</Card>
 */
export default function Card({ style = '', children }: { 
    style?: string
    children?: React.ReactNode
}): JSX.Element {
    return <div className={'bg-secondary-100 dark:bg-secondary-dark-100 rounded-xl p-4 ' + style}>
        {children}
    </div>
}
