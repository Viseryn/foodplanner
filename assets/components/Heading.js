/**********************************
 * ./assets/components/Heading.js *
 **********************************/

import React from 'react';

/**
 * Heading
 * 
 * A component that renders a huge heading.
 * 
 * @component
 * @property {*} children 
 * 
 * @example
 * <Heading>This is a title</Heading>
 */
export default function Heading(props) {
    return (
        <div className="text-3xl font-semibold text-blue-600 dark:text-gray-100 mb-10">
            {props.children}
        </div>
    );
}

/**
 * SubHeading
 * 
 * A component that renders a large heading.
 * 
 * @component
 * @property {*} children 
 * 
 * @example
 * <SubHeading>This is a title</SubHeading>
 */
export function SubHeading(props) {
    return (
        <div className="text-lg font-semibold text-blue-600 dark:text-gray-100 mb-10">
            {props.children}
        </div>
    );
}
