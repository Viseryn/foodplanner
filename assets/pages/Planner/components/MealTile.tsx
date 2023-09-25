/**************************************************
 * ./assets/pages/Planner/components/MealTile.tsx *
 **************************************************/

import React from 'react'
import { Link } from 'react-router-dom'

import MealModel from '@/types/MealModel'

/**
 * A components that renders an appropriate rectangular (or smaller square) tile for a meal in 
 * the Planner view.
 * 
 * @param props
 * @param props.meal A MealModel object.
 * @param props.deleteMeal A function that takes a MealModel as parameter and deletes it.
 * @param props.isSmall Optional: Whether the tile should be displayed as a smaller square instead as rectangle.
 */
export default function MealTile({ meal, deleteMeal, isSmall }: {
    meal: MealModel
    deleteMeal: (meal: MealModel) => void
    isSmall?: boolean
}): JSX.Element {
    // Styling classes for the tile
    const widthStyle: string = isSmall ? 'w-40' : 'w-full'
    const titleStyle: string = isSmall ? 'text-base' : 'text-xl'
    const textStyle: string = isSmall ? 'text-sm' : 'text-base'

    // Render MealTile
    return (
        <div className={`h-40 ${widthStyle} rounded-2xl transition duration-300`}>
            <div className="relative group">
                <img
                    className={`rounded-2xl h-40 ${widthStyle} object-cover brightness-[.7]`}
                    src={meal.recipe.image?.filename != null
                        ? meal.recipe.image?.directory + 'THUMBNAIL__' + meal.recipe.image?.filename
                        : '/img/default.jpg'
                    }
                    alt={meal.recipe.title}
                />

                <Link
                    to={'/recipe/' + meal.recipe.id}
                    className={`absolute ${widthStyle} bottom-4 px-4 text-white font-semibold`}
                >
                    <div className={`${titleStyle} mr-4`}>{meal.recipe.title}</div>
                    <div className={`${textStyle} flex items-center mt-2`}>
                        <span className="material-symbols-rounded mr-2">{meal.userGroup.icon}</span>
                        <span>{meal.userGroup.name}</span>
                    </div>
                    <div className={`${textStyle} flex items-center mt-2`}>
                        <span className="material-symbols-rounded mr-2">{meal.mealCategory.icon}</span>
                        <span>{meal.mealCategory.name}</span>
                    </div>
                </Link>

                <span
                    onClick={() => deleteMeal(meal)}
                    className="cursor-pointer transition duration-300 group-hover:block material-symbols-rounded text-white absolute top-2 right-2
                    hover:bg-gray-600/40 p-1 rounded-full"
                >
                    close
                </span>
            </div>
        </div>
    )
}
