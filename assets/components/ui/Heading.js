/*************************************
 * ./assets/components/ui/Heading.js *
 *************************************/

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
        <div className="text-3xl font-semibold text-primary-200 dark:text-secondary-dark-900">
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
        <div className="text-lg font-semibold text-primary-200 dark:text-secondary-dark-900">
            {props.children}
        </div>
    );
}

/**
 * SecondHeading
 * 
 * A component that renders a very large heading.
 * 
 * @component
 * @property {*} children 
 * 
 * @example
 * <SecondHeading>This is a title</SecondHeading>
 */
export function SecondHeading(props) {
    return (
        <div className="text-xl font-semibold text-primary-200 dark:text-secondary-dark-900">
            {props.children}
        </div>
    );
}
