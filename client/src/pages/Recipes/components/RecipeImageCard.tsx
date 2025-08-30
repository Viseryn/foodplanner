import { UserContext } from "@/context/UserContext"
import { useNullishContext } from "@/hooks/useNullishContext"
import { Recipe } from "@/types/api/Recipe"
import { apiClient } from "@/util/apiClient"
import { Link } from "react-router-dom"

export function RecipeImageCard(props: { recipe: Recipe }) {
    const isFavorite: boolean = useNullishContext(UserContext).data?.recipeFavorites.includes(props.recipe["@id"]) ?? false

    return (
        <div className="h-36 w-full rounded-lg transition duration-300">
            <div className="relative group cursor-pointer">
                <Link to={"/recipe/" + props.recipe.id}>
                    <img
                        className="rounded-lg h-36 w-full object-cover brightness-[.7]"
                        src={props.recipe.image
                            ? apiClient.defaults.baseURL + props.recipe.image?.directory + "THUMBNAIL__" + props.recipe.image?.filename
                            : "/img/default.jpg"
                        }
                        alt={props.recipe.title}
                    />
                    <div className="absolute w-full bottom-4 px-6 text-white font-semibold text-xl">
                        {props.recipe.title}
                    </div>
                </Link>

                {isFavorite && (
                    <span className="material-symbols-rounded text-white absolute top-2 right-2 p-1 rounded-full">
                        star
                    </span>
                )}
            </div>
        </div>
    )
}
