/**********************************
 * ./assets/components/ui/Card.js *
 **********************************/

import React from 'react';

/**
 * Card
 * 
 * A component that renders a card.
 * 
 * @component
 * @property {String} style Additional styling classes.
 * @property {*} children 
 * 
 * @example
 * <Card style="mb-6">This is a title</Card>
 */
export default function Card({ style = '', ...props }) {
    return (
        <div className={
            'bg-secondary-100 dark:bg-secondary-dark-100 rounded-xl p-4 ' 
            + style
        }>
            {props.children}
        </div>
    );
}
