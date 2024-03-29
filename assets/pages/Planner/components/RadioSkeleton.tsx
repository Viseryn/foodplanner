/***********************************************************
 * ./assets/pages/Planner/components/RadioSkeleton.tsx *
 ***********************************************************/

import React from 'react'

import Spacer from '@/components/ui/Spacer'

/**
 * A components that renders a skeleton for the radio fields in AddMeal.
 */
export default function RadioSkeleton(): JSX.Element {
    return <div role="status" className="animate-pulse">
        <div className="h-4 bg-notification-500 dark:bg-notification-700 rounded-full w-2/3" />
        <Spacer height="1" />
        <div className="h-4 bg-notification-500 dark:bg-notification-700 rounded-full w-3/4" />
    </div>
}
