/************************************
 * ./assets/components/ui/Spacer.js *
 ************************************/

import React from 'react';

/**
 * Spacer
 * 
 * A component that renders a spacer.
 * 
 * @component
 * @property {String} height Height of the spacer in multiples of 4px.
 * 
 * @example
 * <Spacer height="10" />
 */
export default function Spacer({ height = '', ...props }) {
    return (
        <div className={'h-' + height}></div>
    );
}
