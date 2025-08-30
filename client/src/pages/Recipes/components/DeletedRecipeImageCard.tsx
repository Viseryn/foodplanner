import { Recipe } from "@/types/api/Recipe"
import { apiClient } from "@/util/apiClient"
import { ReactElement } from "react"

type DeletedRecipeImageCardProps = {
    recipe: Recipe
    onRestore: (recipe: Recipe) => void
}

export const DeletedRecipeImageCard = ({ recipe, onRestore }: DeletedRecipeImageCardProps): ReactElement => (
    <div className="h-36 w-full rounded-xl transition duration-300">
        <div className="relative group">
            <img
                className="rounded-xl h-36 w-full object-cover brightness-[.7]"
                src={recipe.image
                    ? apiClient.defaults.baseURL + recipe.image?.directory + "THUMBNAIL__" + recipe.image?.filename
                    : "/img/default.jpg"
                }
                alt={recipe.title}
            />
            <div className="absolute w-full bottom-4 px-6 text-white font-semibold text-xl">
                {recipe.title}
            </div>

            <span
                onClick={() => onRestore(recipe)}
                className="cursor-pointer transition duration-300 group-hover:block material-symbols-rounded text-white absolute top-2 right-2 hover:bg-gray-600/40 p-1 rounded-full"
            >
                restore_from_trash
            </span>
        </div>
    </div>
)
