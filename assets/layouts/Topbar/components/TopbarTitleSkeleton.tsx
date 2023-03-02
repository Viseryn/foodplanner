/**************************************************************
 * ./assets/layouts/Topbar/components/TopbarTitleSkeleton.tsx *
 **************************************************************/

import React from 'react'

/**
 * Renders a skeleton for the title.
 * 
 * @component
 */
export default function TopbarTitleSkeleton(): JSX.Element {
    return <div className="animate-pulse w-[200px] md:w-[250px]">
        <div className="h-9 bg-notification-500 dark:bg-notification-700 rounded-full" />
    </div>
}
