/************************************************************
 * ./assets/pages/Recipes/components/RecipeListSkeleton.tsx *
 ************************************************************/

import React from 'react'

/**
 * RecipeListSkeleton
 * 
 * A component that renders a skeleton for the recipe list when it is still loading. 
 * 
 * @component
 */
 export default function RecipeListSkeleton(): JSX.Element {
    return (
        <div className="grid grid-cols-1  animate-pulse sm:grid-cols-3 gap-2">
            <div className="rounded-xl h-36 w-full object-cover bg-notification-500 dark:bg-notification-700" />
            <div className="rounded-xl h-36 w-full object-cover bg-notification-500/75 dark:bg-notification-700/75" />
            <div className="rounded-xl h-36 w-full object-cover bg-notification-500/50 dark:bg-notification-700/50" />
            <div className="rounded-xl h-36 w-full object-cover bg-notification-500/75 dark:bg-notification-700/75" />
            <div className="rounded-xl h-36 w-full object-cover bg-notification-500 dark:bg-notification-700" />
            <div className="rounded-xl h-36 w-full object-cover bg-notification-500 dark:bg-notification-700" />
            <div className="rounded-xl h-36 w-full object-cover bg-notification-500/75 dark:bg-notification-700/75" />
            <div className="rounded-xl h-36 w-full object-cover bg-notification-500/50 dark:bg-notification-700/50" />
            <div className="rounded-xl h-36 w-full object-cover bg-notification-500/75 dark:bg-notification-700/75" />
            <div className="rounded-xl h-36 w-full object-cover bg-notification-500 dark:bg-notification-700" />
            <div className="rounded-xl h-36 w-full object-cover bg-notification-500 dark:bg-notification-700" />
            <div className="rounded-xl h-36 w-full object-cover bg-notification-500/75 dark:bg-notification-700/75" />
            <div className="rounded-xl h-36 w-full object-cover bg-notification-500/50 dark:bg-notification-700/50" />
            <div className="rounded-xl h-36 w-full object-cover bg-notification-500/75 dark:bg-notification-700/75" />
            <div className="rounded-xl h-36 w-full object-cover bg-notification-500 dark:bg-notification-700" />
        </div>
    )
}