/***********************************************************
 * ./assets/pages/Recipes/components/RecipeListSkeleton.js *
 ***********************************************************/

import React from "react";

/**
 * RecipeListSkeleton
 * 
 * A component that renders a skeleton for the recipe list
 * when it is still loading. 
 * 
 * @todo Make this a (partly) reusable component.
 * 
 * @component
 * @property {boolean} isTwoColumn Whether two-column mode is active.
 */
 export default function RecipeListSkeleton(props) {
    return (
        <div className={
            'grid grid-cols-1 gap-2 animate-pulse ' 
            + (!props.isTwoColumns && 'sm:grid-cols-3 md:grid-cols-3')
        }>
            <div className="rounded-2xl h-36 w-full object-cover bg-gray-400 dark:bg-gray-700" />
            <div className="rounded-2xl h-36 w-full object-cover bg-gray-400/75 dark:bg-gray-800/75" />
            <div className="rounded-2xl h-36 w-full object-cover bg-gray-400/50 dark:bg-gray-700/50" />
            <div className="rounded-2xl h-36 w-full object-cover bg-gray-400/75 dark:bg-gray-800/75" />
            <div className="rounded-2xl h-36 w-full object-cover bg-gray-400 dark:bg-gray-700" />
            <div className="rounded-2xl h-36 w-full object-cover bg-gray-400 dark:bg-gray-700" />
            <div className="rounded-2xl h-36 w-full object-cover bg-gray-400/75 dark:bg-gray-800/75" />
            <div className="rounded-2xl h-36 w-full object-cover bg-gray-400/50 dark:bg-gray-700/50" />
            <div className="rounded-2xl h-36 w-full object-cover bg-gray-400/75 dark:bg-gray-800/75" />
            <div className="rounded-2xl h-36 w-full object-cover bg-gray-400 dark:bg-gray-700" />
            <div className="rounded-2xl h-36 w-full object-cover bg-gray-400 dark:bg-gray-700" />
            <div className="rounded-2xl h-36 w-full object-cover bg-gray-400/75 dark:bg-gray-800/75" />
            <div className="rounded-2xl h-36 w-full object-cover bg-gray-400/50 dark:bg-gray-700/50" />
            <div className="rounded-2xl h-36 w-full object-cover bg-gray-400/75 dark:bg-gray-800/75" />
            <div className="rounded-2xl h-36 w-full object-cover bg-gray-400 dark:bg-gray-700" />
        </div>
    );
}