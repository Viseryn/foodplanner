import { GlobalAppDataContext } from "@/context/GlobalAppDataContext"
import { findEntityByIri } from "@/hooks/findEntityByIri"
import { useNullishContext } from "@/hooks/useNullishContext"
import { TranslationFunction, useTranslation } from "@/hooks/useTranslation"
import { PlannerTranslations } from "@/pages/Planner/PlannerTranslations"
import { Meal } from "@/types/api/Meal"
import { MealCategory } from "@/types/api/MealCategory"
import { Recipe } from "@/types/api/Recipe"
import { UserGroup } from "@/types/api/UserGroup"
import { GlobalAppData } from "@/types/GlobalAppData"
import { ManagedResourceCollection } from "@/types/ManagedResourceCollection"
import { Maybe } from "@/types/Maybe"
import { apiClient } from "@/util/apiClient"
import { ApiRequest } from "@/util/ApiRequest"
import { StringBuilder } from "@/util/StringBuilder"
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react"
import React, { ReactElement } from "react"
import { Link, NavigateFunction, useNavigate } from "react-router-dom"
import swal from "sweetalert"

export const MealTile = ({ meal, lastMealHasSideDishes }: { meal: Meal, lastMealHasSideDishes: boolean }): ReactElement => {
    const t: TranslationFunction = useTranslation(PlannerTranslations)
    const navigate: NavigateFunction = useNavigate()
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
        <div className={"flex flex-col group/mealtile gap-0.5 w-full"}>
            <div className={`h-32 w-full transition duration-300`}>
                <div className="relative">
                    <img
                        className={StringBuilder.cn(
                            "h-32 w-full object-cover brightness-[.7] rounded-md group-first-of-type/mealtile:rounded-t-3xl",
                            [!lastMealHasSideDishes, "group-last-of-type/mealtile:rounded-b-3xl"],
                            "sm:!rounded-lg"
                        )}
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
                                <span>{t(`global.mealcategory.${mealCategory.name}`)}</span>
                            </div>

                            <div className={`text-sm flex items-center bg-white bg-opacity-30 rounded-l-lg rounded-r-3xl px-2`}>
                                <span className="material-symbols-rounded text-base mr-2">{userGroup.icon}</span>
                                <span>{userGroup.name === "Alle" ? t(`global.usergroup.${userGroup.name}`) : userGroup.name}</span>
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
                            <MenuItem key={meal.id + "edit"}>
                                <div onClick={() => { navigate(`/planner/edit/${meal.id}`) }} className="flex items-center gap-4 h-10 p-2 rounded-xl hover:bg-secondary-200/40 dark:hover:bg-secondary-dark-200/40 cursor-pointer transition duration-300">
                                    <span className={"material-symbols-rounded outlined text-balance"}>edit_square</span>
                                    {t("dropdown.edit.meal")}
                                </div>
                            </MenuItem>
                            <MenuItem key={meal.id + "delete"}>
                                <div onClick={() => deleteMeal(meal, meals)} className="flex items-center gap-4 h-10 p-2 rounded-xl hover:bg-secondary-200/40 dark:hover:bg-secondary-dark-200/40 cursor-pointer transition duration-300">
                                    <span className={"material-symbols-rounded outlined text-balance"}>delete_sweep</span>
                                    {t("dropdown.delete.meal")}
                                </div>
                            </MenuItem>
                        </MenuItems>
                    </Menu>
                </div>
            </div>

            {meal.sideDishes.length > 0 && (
                <div className={"w-full m-auto flex flex-wrap gap-0.5"}>
                    {meal.sideDishes.map(sideDish => {
                        const sideDishRecipe: Maybe<Recipe> = findEntityByIri(sideDish, recipes)

                        if (!sideDishRecipe) {
                            return <></>
                        }

                        return (
                            <div key={`sideDish_${meal.id}_${sideDish}`} className={"h-16 basis-[calc(50%-.075rem)] transition duration-300"}>
                                <div className="relative h-16">
                                    <img
                                        className={"h-16 w-full object-cover brightness-[.7] rounded-md sm:!rounded-lg"}
                                        src={sideDishRecipe.image?.filename != null
                                            ? apiClient.defaults.baseURL + sideDishRecipe.image?.directory + "THUMBNAIL__" + sideDishRecipe.image?.filename
                                            : "/img/default.jpg"
                                        }
                                        alt={sideDishRecipe.title}
                                    />

                                    <Link
                                        to={"/recipe/" + sideDishRecipe.id}
                                        className={`absolute h-full px-2 inset-0 flex justify-between text-white font-semibold text-sm overflow-hidden --whitespace-nowrap text-ellipsis`}
                                    >
                                        <span className={"max-w-full truncate self-center"}>
                                            + {sideDishRecipe.title}
                                        </span>
                                    </Link>
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}
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
