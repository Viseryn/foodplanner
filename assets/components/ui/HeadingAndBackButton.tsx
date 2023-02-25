/***************************************************
 * ./assets/components/ui/HeadingAndBackButton.tsx *
 ***************************************************/

import React from 'react'
import { Link } from 'react-router-dom'

import Heading from './Heading'
import IconButton from './Buttons/IconButton'

/**
 * HeadingAndBackButton
 * 
 * A component that renders a huge heading and a back button.
 * 
 * @component
 * @param props
 * @param props.location The location that the back button navigates to.
 * @param props.children The DOM children of the Card component.
 * 
 * @example <HeadingAndBackButton location="/planner">This is a title</Heading>
 */
export default function HeadingAndBackButton({ location = '#', children }: {
    location?: string
    children: React.ReactNode
}): JSX.Element {
    return <div className="flex justify-start items-center">
        <div className="flex justify-between">
            <Link to={location} className="mr-4 text-primary-200 dark:text-secondary-dark-900">
                <IconButton>
                    arrow_back
                </IconButton>
            </Link>
        </div>

        <Heading>{children}</Heading>
    </div>
}
