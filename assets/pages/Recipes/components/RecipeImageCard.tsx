import RecipeModel from '@/types/RecipeModel'
import { Link } from 'react-router-dom'
import React from 'react'

export function RecipeImageCard(props: { recipe: RecipeModel }) {
    return <div className="h-36 w-full rounded-xl transition duration-300">
        <div className="relative group cursor-pointer">
            <Link to={'/recipe/' + props.recipe.id}>
                <img
                    className="rounded-xl h-36 w-full object-cover brightness-[.7]"
                    src={props.recipe.image
                        ? props.recipe.image?.directory + 'THUMBNAIL__' + props.recipe.image?.filename
                        : '/img/default.jpg'
                    }
                    alt={props.recipe.title}
                />
                <div className="absolute w-full bottom-4 px-6 text-white font-semibold text-xl">
                    {props.recipe.title}
                </div>
            </Link>
        </div>
    </div>
}
