import { GlobalAppDataContext } from "@/context/GlobalAppDataContext"
import { findEntityByIri } from "@/hooks/findEntityByIri"
import { useNullishContext } from "@/hooks/useNullishContext"
import { Meal } from "@/types/api/Meal"
import { MealCategory } from "@/types/api/MealCategory"
import { Recipe } from "@/types/api/Recipe"
import { UserGroup } from "@/types/api/UserGroup"
import { GlobalAppData } from "@/types/GlobalAppData"
import { ManagedResourceCollection } from "@/types/ManagedResourceCollection"
import { Maybe } from "@/types/Maybe"
import { apiClient } from "@/util/apiClient"
import { ApiRequest } from "@/util/ApiRequest"
import { ReactElement } from "react"
import { Link } from "react-router-dom"
import swal from "sweetalert"

/**
 * A components that renders an appropriate rectangular (or smaller square) tile for a meal in 
 * the Planner view.
 * 
 * @param props
 * @param props.meal
 * @param props.isSmall Optional: Whether the tile should be displayed as a smaller square instead as rectangle.
 */
export default function MealTile({ meal, isSmall }: {
    meal: Meal
    isSmall?: boolean
}): ReactElement {
    const { meals, recipes, userGroups, mealCategories }: Pick<GlobalAppData, "meals" | "recipes" | "userGroups" | "mealCategories"> = useNullishContext(GlobalAppDataContext)

    const recipe: Maybe<Recipe> = findEntityByIri(meal.recipe, recipes)
    const userGroup: Maybe<UserGroup> = findEntityByIri(meal.userGroup, userGroups)
    const mealCategory: Maybe<MealCategory> = findEntityByIri(meal.mealCategory, mealCategories)

    if (!recipe || !userGroup || !mealCategory) {
        return <></>
    }

    // Styling classes for the tile
    const widthStyle: string = isSmall ? 'w-40' : 'w-full'
    const titleStyle: string = isSmall ? 'text-base' : 'text-xl'
    const textStyle: string = isSmall ? 'text-sm' : 'text-base'

    // Render MealTile
    return (
        <div className={`h-40 ${widthStyle} group transition duration-300`}>
            <div className="relative">
                <img
                    className={`h-40 ${widthStyle} object-cover brightness-[.7] rounded-lg group-first-of-type:rounded-t-3xl group-last-of-type:rounded-b-3xl`}
                    src={recipe.image?.filename != null
                        ? apiClient.defaults.baseURL + recipe.image?.directory + 'THUMBNAIL__' + recipe.image?.filename
                        : '/img/default.jpg'
                    }
                    alt={recipe.title}
                />

                <Link
                    to={'/recipe/' + recipe.id}
                    className={`absolute ${widthStyle} bottom-4 px-4 text-white font-semibold`}
                >
                    <div className={`${titleStyle} mr-4`}>{recipe.title}</div>
                    <div className={`${textStyle} flex items-center mt-2`}>
                        <span className="material-symbols-rounded mr-2">{userGroup.icon}</span>
                        <span>{userGroup.name}</span>
                    </div>
                    <div className={`${textStyle} flex items-center mt-2`}>
                        <span className="material-symbols-rounded mr-2">{mealCategory.icon}</span>
                        <span>{mealCategory.name}</span>
                    </div>
                </Link>

                <span
                    onClick={() => deleteMeal(meal, meals)}
                    className="cursor-pointer transition duration-300 group-hover:block material-symbols-rounded text-white absolute top-2 right-2
                    hover:bg-gray-600/40 p-1 rounded-full"
                >
                    close
                </span>
            </div>
        </div>
    )
}

const deleteMeal = (meal: Meal, meals: ManagedResourceCollection<Meal>): void => {
    swal({
        dangerMode: true,
        icon: "error",
        title: "Mahlzeit wirklich löschen?",
        buttons: ["Abbrechen", "Löschen"],
    }).then(confirm => {
        if (!confirm) {
            return
        }

        void ApiRequest.delete(meal["@id"]).ifSuccessful(() => meals.load()).execute()
    })
}
