/**************************************************
 * ./assets/components/ui/HeadingAndBackButton.js *
 **************************************************/

import React from 'react';
import { Link } from 'react-router-dom';

import IconButton from './Buttons/IconButton';
import Heading from './Heading';

/**
 * HeadingAndBackButton
 * 
 * A component that renders a huge heading and a back button.
 * 
 * @component
 * @property {string} location The location that the back button navigates to.
 * @property {*} children 
 * 
 * @example
 * <HeadingAndBackButton>This is a title</Heading>
 */
export default function HeadingAndBackButton(props) {
    return (
        <div className="flex justify-start items-center">
            <div className="flex justify-between">
                <Link to={props.location} className="mr-4 text-primary-200 dark:text-secondary-dark-900">
                    <IconButton>
                        arrow_back
                    </IconButton>
                </Link>
            </div>

            <Heading>{props.children}</Heading>
        </div>
    );
}
