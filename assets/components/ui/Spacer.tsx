/*************************************
 * ./assets/components/ui/Spacer.tsx *
 *************************************/

import React from 'react'

/**
 * Spacer
 * 
 * A component that renders a vertical spacer.
 * 
 * @component
 * @param props
 * @param props.height Height of the spacer in multiples of 4px.
 * 
 * @example <Spacer height="10" />
 */
export default function Spacer({ height }: { height: string }): JSX.Element {
    return <div className={'h-' + height}></div>
}
