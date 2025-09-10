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
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react"
import { ReactElement } from "react"
import { Link } from "react-router-dom"
import swal from "sweetalert"

export const MealTile = ({ meal }: { meal: Meal }): ReactElement => {
    const { meals, recipes, userGroups, mealCategories, }: Pick<GlobalAppData, "meals" | "recipes" | "userGroups" | "mealCategories"> = useNullishContext(GlobalAppDataContext)

    const recipe: Maybe<Recipe> = findEntityByIri(meal.recipe, recipes)
    const userGroup: Maybe<UserGroup> = findEntityByIri(meal.userGroup, userGroups)
    const mealCategory: Maybe<MealCategory> = findEntityByIri(meal.mealCategory, mealCategories)

    if (!recipe || !userGroup || !mealCategory) {
        return (
            <></>
        )
    }

    return (
        <div className={`h-40 w-full group transition duration-300`}>
            <div className="relative">
                <img
                    className={"h-40 w-full object-cover brightness-[.7] rounded-lg group-first-of-type:rounded-t-3xl group-last-of-type:rounded-b-3xl sm:!rounded-lg"}
                    src={recipe.image?.filename != null
                        ? apiClient.defaults.baseURL + recipe.image?.directory + "THUMBNAIL__" + recipe.image?.filename
                        : "/img/default.jpg"
                    }
                    alt={recipe.title}
                />

                <Link
                    to={"/recipe/" + recipe.id}
                    className={`absolute w-full top-4 px-4 flex flex-col justify-between h-full pb-8 text-white font-semibold`}
                >
                    <div className={`text-xl mr-10`}>{recipe.title}</div>

                    <div className={"flex gap-1"}>
                        <div className={`text-sm flex items-center bg-white bg-opacity-30 rounded-l-3xl rounded-r-lg px-2`}>
                            <span className="material-symbols-rounded text-base mr-2">{mealCategory.icon}</span>
                            <span>{mealCategory.name}</span>
                        </div>

                        <div className={`text-sm flex items-center bg-white bg-opacity-30 rounded-l-lg rounded-r-3xl px-2`}>
                            <span className="material-symbols-rounded text-base mr-2">{userGroup.icon}</span>
                            <span>{userGroup.name}</span>
                        </div>
                    </div>
                </Link>

                <Menu>
                    <MenuButton className="focus:outline-none cursor-pointer transition duration-300 material-symbols-rounded text-white absolute top-3.5 right-2 p-1 rounded-full">
                        <span className={`material-symbols-rounded text-balance`}>more_vert</span>
                    </MenuButton>

                    <MenuItems
                        transition
                        anchor="bottom end"
                        className="z-[500] bg-white dark:bg-secondary-dark-100 origin-top-right mt-2 shadow-2xl rounded-2xl p-2 space-y-2 transition duration-300 ease-out focus:outline-none"
                    >
                        <MenuItem key={meal.id}>
                            <div onClick={() => deleteMeal(meal, meals)} className="flex items-center gap-4 h-10 p-2 rounded-xl hover:bg-secondary-200/40 dark:hover:bg-secondary-dark-200/40 cursor-pointer transition duration-300">
                                <span className={"material-symbols-rounded text-balance"}>delete_sweep</span>
                                Mahlzeit löschen
                            </div>
                        </MenuItem>
                    </MenuItems>
                </Menu>
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
