/*************************************
 * ./assets/components/ui/Spacer.tsx *
 *************************************/

import React from 'react'

/**
 * A component that renders a vertical spacer.
 * 
 * @component
 * @param props
 * @param props.height Height of the spacer in multiples of 4px = .25rem (equivalent to height 1).
 * 
 * @example <Spacer height="10" />
 */
export default function Spacer({ height }: { 
    height: string | number
}): JSX.Element {
    return <div className={`h-${height.toString()}`} />
}
