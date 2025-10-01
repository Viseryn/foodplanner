import { Label } from "@/components/form/Label"
import { LabelledFormWidget } from "@/components/form/LabelledFormWidget"
import { RadioWidget } from "@/components/form/RadioWidget"
import Button from "@/components/ui/Buttons/Button"
import { OuterCard } from "@/components/ui/Cards/OuterCard"
import Notification from "@/components/ui/Notification"
import Spacer from "@/components/ui/Spacer"
import { Spinner } from "@/components/ui/Spinner"
import { GlobalAppDataContext } from "@/context/GlobalAppDataContext"
import { SettingsContext } from "@/context/SettingsContext"
import { SidebarContext } from "@/context/SidebarContext"
import { TopbarContext } from "@/context/TopbarContext"
import { UserContext } from "@/context/UserContext"
import { useNullishContext } from "@/hooks/useNullishContext"
import { usePlannerDates } from "@/hooks/usePlannerDates"
import { stateCacheStore, useStateCache } from "@/hooks/useStateCache"
import { TranslationFunction, useTranslation } from "@/hooks/useTranslation"
import { StandardContentWrapper } from "@/layouts/StandardContentWrapper"
import { DayOptionLabel } from "@/pages/Planner/components/DayOptionLabel"
import { PlannerTranslations } from "@/pages/Planner/PlannerTranslations"
import { Iri } from "@/types/api/Iri"
import { Meal } from "@/types/api/Meal"
import { MealCategory } from "@/types/api/MealCategory"
import { Recipe } from "@/types/api/Recipe"
import { Settings } from "@/types/api/Settings"
import { User } from "@/types/api/User"
import { UserGroup } from "@/types/api/UserGroup"
import { DateKey } from "@/types/DateKey"
import { PageState } from "@/types/enums/PageState"
import { Form } from "@/types/forms/Form"
import { GlobalAppData } from "@/types/GlobalAppData"
import { ManagedResource } from "@/types/ManagedResource"
import { ManagedResourceCollection } from "@/types/ManagedResourceCollection"
import { DayOption } from "@/types/options/DayOption"
import { MealCategoryOption } from "@/types/options/MealCategoryOption"
import { RadioOption } from "@/types/options/RadioOption"
import { RecipeOption } from "@/types/options/RecipeOption"
import { UserGroupOption } from "@/types/options/UserGroupOption"
import { Sidebar } from "@/types/sidebar/Sidebar"
import { Topbar } from "@/types/topbar/Topbar"
import { apiClient } from "@/util/apiClient"
import { ApiRequest } from "@/util/ApiRequest"
import { getEntityOptions } from "@/util/forms/getEntityOptions"
import { getFormOptions } from "@/util/forms/getFormOptions"
import { setChecked } from "@/util/forms/setChecked"
import React, { ReactElement, useCallback, useEffect, useState } from "react"
import { Navigate, NavigateFunction, useNavigate, useParams, useSearchParams } from "react-router-dom"
import DayRadioSkeleton from "./components/DayRadioSkeleton"
import RadioSkeleton from "./components/RadioSkeleton"
import RecipeListSkeleton from "./components/RecipeListSkeleton"
import SearchWidget from "./components/SearchWidget"

type AddMealRouteParams = {
    id?: DateKey
}

type AddMealForm = Form & {
    date: DateKey
    mealCategory: Iri<MealCategory>
    userGroup: Iri<UserGroup>
    recipe: Iri<Recipe>
}

export function AddMeal(): ReactElement {
    const globalAppData: GlobalAppData = useNullishContext(GlobalAppDataContext)
    const { meals, recipes, mealCategories }: Pick<GlobalAppData, "meals" | "recipes" | "mealCategories"> = globalAppData
    const userGroups: ManagedResourceCollection<UserGroup> = globalAppData.visibleUserGroups
    const user: ManagedResource<User> = useNullishContext(UserContext)

    const { id }: AddMealRouteParams = useParams() // The id parameter of the route '/planner/add/:id' which corresponds to a Day entity
    const searchParams: URLSearchParams = useSearchParams()[0]
    const navigate: NavigateFunction = useNavigate()
    const t: TranslationFunction = useTranslation(PlannerTranslations)

    const sidebar: Sidebar = useNullishContext(SidebarContext)
    const topbar: Topbar = useNullishContext(TopbarContext)
    const settings: ManagedResource<Settings> = useNullishContext(SettingsContext)

    const dates: [DateKey, Meal[]][] = [...usePlannerDates().entries()]
    const onlyFavorites: boolean = useStateCache(state => state.onlyShowFavoriteRecipes)
    const toggleFavorites = useCallback((): void => {
        stateCacheStore.getState().toggle("onlyShowFavoriteRecipes")
    }, [])

    const userGroupOptions = getEntityOptions(userGroups, UserGroupOption)
    const mealCategoryOptions = getEntityOptions(mealCategories, MealCategoryOption)
    const dayOptions = dates.map(date => new DayOption(date))

    const [recipeQuery, setRecipeQuery] = useState<string>("")
    const [selectedRecipe, setSelectedRecipe] = useState<number>(0)
    const [state, setState] = useState<PageState>(PageState.WAITING)

    const [formData, setFormData] = useState<AddMealForm>({
        date: id ?? "0-0-0",
        mealCategory: "/api/",
        userGroup: "/api/",
        recipe: "/api/",
    })

    useEffect(() => {
        if (!settings.isLoading) {
            setFormData(formData => ({
                ...formData,
                mealCategory: settings.data.standardMealCategory ?? formData.mealCategory,
                userGroup: settings.data.standardUserGroup ?? formData.userGroup,
            }))
        }
    }, [settings])

    useEffect(() => {
        let isRecipeInResults: boolean = false

        if (recipes.isLoading) {
            return
        }

        recipes.data
               ?.filter(recipe => recipe.title.toLowerCase().includes(recipeQuery.toLowerCase()))
               ?.forEach(recipe => {
                   if (recipe.id == selectedRecipe) {
                       isRecipeInResults = true
                   }
               })

        if (!isRecipeInResults) {
            setSelectedRecipe(0)
        }
    }, [recipeQuery])

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
        event.preventDefault()

        if (selectedRecipe == 0) {
            setState(PageState.ERROR)
            return
        }

        setState(PageState.LOADING)

        void ApiRequest
            .post<Meal>("/api/meals", {
                "@type": "Meal",
                date: formData.date,
                recipe: formData.recipe,
                mealCategory: formData.mealCategory,
                userGroup: formData.userGroup,
            })
            .ifSuccessful(() => {
                meals.load()
                setState(PageState.SUCCESS)
            })
            .execute()
    }

    useEffect(() => {
        if (recipes.isLoading) {
            return
        }

        // Preselect recipe if recipe query param is given
        if (searchParams.get("recipe") !== null) {
            setSelectedRecipe(parseInt(searchParams.get("recipe")!))
            setRecipeQuery(
                "" + recipes.data.find(
                    recipe => recipe.id === parseInt(searchParams.get("recipe")!),
                )?.title,
            )
            setFormData(formData => ({
                ...formData,
                recipe: `/api/recipes/${searchParams.get("recipe")!}`,
            }))
        }
    }, [recipes])

    useEffect(() => {
        sidebar.configuration
               .activeItem("planner")
               .rebuild()
        topbar.configuration
              .title(t("topbar.title.add.meal"))
              .backButton({ isVisible: true, onClick: () => navigate(-1) })
              .mainViewWidth("md:max-w-[900px]")
              .rebuild()

        window.scrollTo(0, 0)
    }, [])

    return (
        <StandardContentWrapper>
            {state === PageState.LOADING &&
                <Spinner />
            }

            {state === PageState.SUCCESS &&
                <Navigate to="/planner" />
            }

            {[PageState.WAITING, PageState.ERROR].includes(state) &&
                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                        <div className="md:order-last">
                            <div>
                                <LabelledFormWidget
                                    id={"date"}
                                    label={t("label.date")}
                                    widget={meals.isLoading ? (
                                        <DayRadioSkeleton />
                                    ) : (
                                        <RadioWidget
                                            field={"date"}
                                            formData={formData}
                                            setFormData={setFormData}
                                            options={setChecked(getFormOptions(dayOptions), id)}
                                            required={true}
                                            gridStyling={`grid grid-cols-5 gap-1`}
                                            optionLabelMapper={option => DayOptionLabel({ option })}
                                        />
                                    )}
                                />

                                <Spacer height="6" />

                                <LabelledFormWidget
                                    id={"mealCategory"}
                                    label={t("label.mealcategory")}
                                    widget={mealCategories.isLoading || settings.isLoading ? (
                                        <RadioSkeleton />
                                    ) : (
                                        <RadioWidget
                                            field={"mealCategory"}
                                            formData={formData}
                                            setFormData={setFormData}
                                            options={setChecked(getFormOptions(mealCategoryOptions), settings.data.standardMealCategory)}
                                            required={true}
                                        />
                                    )}
                                />

                                <Spacer height="6" />

                                <LabelledFormWidget
                                    id={"userGroup"}
                                    label={t("label.usergroup")}
                                    widget={userGroups.isLoading || settings.isLoading ? (
                                        <RadioSkeleton />
                                    ) : (
                                        <RadioWidget
                                            field={"userGroup"}
                                            formData={formData}
                                            setFormData={setFormData}
                                            options={setChecked(getFormOptions(userGroupOptions), settings.data.standardUserGroup)}
                                            required={true}
                                        />
                                    )}
                                />
                            </div>

                            <div className="flex justify-end md:pt-4">
                                {!meals.isLoading && !mealCategories.isLoading && !recipes.isLoading && !userGroups.isLoading &&
                                    <Button
                                        type="submit"
                                        icon="save"
                                        label={t("button.save")}
                                        outlined={true}
                                        isFloating={true}
                                    />
                                }
                            </div>
                        </div>

                        <div>
                            <Label htmlFor="recipe">{t("label.recipe")}</Label>
                            {recipes.isLoading ? (
                                <RecipeListSkeleton />
                            ) : (
                                <div>
                                    <Spacer height={"1"} />

                                    <div className="flex items-center justify-between gap-1">
                                        <SearchWidget
                                            inputValue={recipeQuery}
                                            setInputValue={setRecipeQuery}
                                            placeholder={t("search.widget.placeholder")}
                                        />

                                        <Button
                                            icon="cards_star"
                                            role={onlyFavorites ? "primary" : "secondary"}
                                            roundedLeft={onlyFavorites}
                                            onClick={toggleFavorites}
                                            className={"h-12 w-12 flex justify-center rounded-full transition-all duration-300"}
                                        />
                                    </div>

                                    {state === PageState.ERROR &&
                                        <>
                                            <Spacer height="4" />

                                            <Notification
                                                title="Du musst ein Rezept auswählen!"
                                                color="red"
                                                icon="error"
                                            />
                                        </>
                                    }

                                    <Spacer height="4" />

                                    <RadioWidget
                                        field={"recipe"}
                                        formData={formData}
                                        setFormData={setFormData}
                                        options={setChecked(getFormOptions(getEntityOptions({
                                            ...recipes,
                                            data: recipes
                                                .data
                                                .filter(recipe => {
                                                    return !(onlyFavorites && !user.data?.recipeFavorites.includes(recipe["@id"]));
                                                })
                                                .filter(recipe => recipe.title.toLowerCase().includes(recipeQuery.toLowerCase())),
                                        }, RecipeOption)), `/api/recipes/${searchParams.get("recipe")}`)}
                                        required={true}
                                        gridStyling={`grid grid-cols-2 gap-1`}
                                        optionLabelMapper={(option: RadioOption) => {
                                            const optionRecipe: Recipe = recipes.data.filter(recipe => recipe["@id"] === option.value)[0]
                                            return (
                                                <label
                                                    htmlFor={option.id}
                                                    className={"p-2 flex flex-row items-center cursor-pointer rounded-lg peer-checked:rounded-3xl h-full" +
                                                        " active:scale-95 font-[500] w-full transition duration-300 text-primary-100" +
                                                        " dark:text-primary-dark-100 bg-secondary-200 dark:bg-secondary-dark-200 " +
                                                        " peer-checked:text-white dark:peer-checked:text-primary-dark-100 " +
                                                        " peer-checked:bg-primary-100 dark:peer-checked:bg-primary-dark-200"}
                                                    onClick={() => {
                                                        setSelectedRecipe(optionRecipe.id)
                                                        setState(PageState.WAITING) // Removes a warning
                                                    }}
                                                >
                                                    <img
                                                        className="rounded-full h-14 w-14 object-cover transition duration-300 border-secondary-100 border-2 "
                                                        src={optionRecipe.image ? (apiClient.defaults.baseURL + optionRecipe.image?.directory + "THUMBNAIL__" + optionRecipe.image?.filename) : "/img/default.jpg"}
                                                        alt={optionRecipe.title}
                                                    />
                                                    <div className="flex flex-1 justify-between items-center overflow-hidden">
                                                        <div className="pl-2 overflow-hidden text-ellipsis">
                                                            {option.label}
                                                        </div>
                                                        {user.data?.recipeFavorites.includes(option.value as Iri<Recipe>) && (
                                                            <span className="material-symbols-rounded text-base pl-1">star</span>
                                                        )}
                                                    </div>
                                                </label>
                                            )
                                        }}
                                    />

                                    {recipes.data.filter(recipe => recipe.title.toLowerCase().includes(recipeQuery.toLowerCase())).length == 0 &&
                                        <div className="col-span-2">
                                            <Notification title="Keine Rezepte gefunden." />
                                        </div>
                                    }
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="pb-[5.5rem] md:pb-0" />
                </form>
            }
        </StandardContentWrapper>
    )
}
