import { Label } from "@/components/form/Label"
import { LabelledFormWidget } from "@/components/form/LabelledFormWidget"
import { RadioWidget } from "@/components/form/RadioWidget"
import Button from "@/components/ui/Buttons/Button"
import Spacer from "@/components/ui/Spacer"
import { Spinner } from "@/components/ui/Spinner"
import { SidebarContext } from "@/context/SidebarContext"
import { TopbarContext } from "@/context/TopbarContext"
import { UserContext } from "@/context/UserContext"
import { findEntityByIri } from "@/hooks/findEntityByIri"
import { useGlobalResources } from "@/hooks/useGlobalResources"
import { useNullishContext } from "@/hooks/useNullishContext"
import { usePlannerDates } from "@/hooks/usePlannerDates"
import { TranslationFunction, useTranslation } from "@/hooks/useTranslation"
import { StandardContentWrapper } from "@/layouts/StandardContentWrapper"
import { DayOptionLabel } from "@/pages/Planner/components/DayOptionLabel"
import { PlannerTranslations } from "@/pages/Planner/PlannerTranslations"
import { Iri } from "@/types/api/Iri"
import { Meal } from "@/types/api/Meal"
import { MealCategory } from "@/types/api/MealCategory"
import { Recipe } from "@/types/api/Recipe"
import { User } from "@/types/api/User"
import { UserGroup } from "@/types/api/UserGroup"
import { DateKey } from "@/types/DateKey"
import { ComponentLoadingState } from "@/types/enums/ComponentLoadingState"
import { Form } from "@/types/forms/Form"
import { ManagedResource } from "@/types/ManagedResource"
import { ManagedResourceCollection } from "@/types/ManagedResourceCollection"
import { Maybe } from "@/types/Maybe"
import { DayOption } from "@/types/options/DayOption"
import { MealCategoryOption } from "@/types/options/MealCategoryOption"
import { RadioOption } from "@/types/options/RadioOption"
import { RecipeOption } from "@/types/options/RecipeOption"
import { UserGroupOption } from "@/types/options/UserGroupOption"
import { Sidebar } from "@/types/sidebar/Sidebar"
import { Topbar } from "@/types/topbar/Topbar"
import { apiClient } from "@/util/apiClient"
import { ApiRequest } from "@/util/ApiRequest"
import { dateKeyOf } from "@/util/dateKeyOf"
import { getEntityOptions } from "@/util/forms/getEntityOptions"
import { getFormOptions } from "@/util/forms/getFormOptions"
import { setChecked } from "@/util/forms/setChecked"
import React, { ReactElement, useEffect, useState } from "react"
import { NavigateFunction, useNavigate, useParams } from "react-router-dom"

type EditMealRouteParams = {
    id?: string
}

type EditMealForm = Form & {
    date: DateKey
    mealCategory: Iri<MealCategory>
    userGroup: Iri<UserGroup>
    recipe: Iri<Recipe>
}

export const EditMealPage = (): ReactElement => {
    useSidebarTopbarConfiguration()

    const t: TranslationFunction = useTranslation(PlannerTranslations)
    const navigate: NavigateFunction = useNavigate()

    const user: ManagedResource<User> = useNullishContext(UserContext)
    const meals: ManagedResourceCollection<Meal> = useGlobalResources("meals")
    const userGroups: ManagedResourceCollection<UserGroup> = useGlobalResources("visibleUserGroups")
    const mealCategories: ManagedResourceCollection<MealCategory> = useGlobalResources("mealCategories")
    const recipes: ManagedResourceCollection<Recipe> = useGlobalResources("recipes")
    const dates: [DateKey, Meal[]][] = [...usePlannerDates().entries()]

    const { id }: EditMealRouteParams = useParams()
    const meal: Maybe<Meal> = findEntityByIri(`/api/meals/${id}`, meals)
    const recipeOptions: RecipeOption[] = getEntityOptions(recipes, RecipeOption)
    const userGroupOptions: UserGroupOption[] = getEntityOptions(userGroups, UserGroupOption)
    const mealCategoryOptions: MealCategoryOption[] = getEntityOptions(mealCategories, MealCategoryOption)
    const dayOptions: DayOption[] = dates.map(date => new DayOption(date))
    const [formData, setFormData] = useState<EditMealForm>({
        date: dateKeyOf(new Date(meal?.date ?? "")),
        mealCategory: meal?.mealCategory ?? "/api/",
        userGroup: meal?.userGroup ?? "/api/",
        recipe: meal?.recipe ?? "/api/",
    })

    const [pageState, setPageState] = useState<ComponentLoadingState>(ComponentLoadingState.LOADING)

    useEffect(() => {
        if (!meal || user.isLoading || meals.isLoading || userGroups.isLoading || mealCategories.isLoading || recipes.isLoading) {
            return
        }

        setPageState(ComponentLoadingState.WAITING)
    }, [meal, user.isLoading, meals.isLoading, userGroups.isLoading, mealCategories.isLoading, recipes.isLoading])

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
        event.preventDefault()

        setPageState(ComponentLoadingState.LOADING)

        await ApiRequest
            .patch<Meal>(`/api/meals/${id}`, { ...formData })
            .ifSuccessful(() => {
                meals.load()
                navigate("/planner")
            })
            .execute()
    }

    return (
        <StandardContentWrapper>
            {pageState === ComponentLoadingState.LOADING && (
                <Spinner />
            )}

            {pageState === ComponentLoadingState.WAITING && (
                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                        <div className="md:order-last">
                            <div>
                                <LabelledFormWidget
                                    id={"date"}
                                    label={t("label.date")}
                                    widget={
                                        <RadioWidget
                                            field={"date"}
                                            formData={formData}
                                            setFormData={setFormData}
                                            options={setChecked(getFormOptions(dayOptions), formData.date)}
                                            required={true}
                                            gridStyling={`grid grid-cols-5 gap-1`}
                                            optionLabelMapper={option => DayOptionLabel({ option })}
                                        />
                                    }
                                />

                                <Spacer height="6" />

                                <LabelledFormWidget
                                    id={"mealCategory"}
                                    label={t("label.mealcategory")}
                                    widget={
                                        <RadioWidget
                                            field={"mealCategory"}
                                            formData={formData}
                                            setFormData={setFormData}
                                            options={setChecked(getFormOptions(mealCategoryOptions), formData.mealCategory)}
                                            required={true}
                                        />
                                    }
                                />

                                <Spacer height="6" />

                                <LabelledFormWidget
                                    id={"userGroup"}
                                    label={t("label.usergroup")}
                                    widget={
                                        <RadioWidget
                                            field={"userGroup"}
                                            formData={formData}
                                            setFormData={setFormData}
                                            options={setChecked(getFormOptions(userGroupOptions), formData.userGroup)}
                                            required={true}
                                        />
                                    }
                                />
                            </div>

                            <div className="flex justify-end md:pt-4">
                                <Button
                                    type="submit"
                                    icon="save"
                                    label={t("button.save")}
                                    outlined={true}
                                    isFloating={true}
                                />
                            </div>
                        </div>

                        <div>
                            <Label htmlFor="recipe">{t("label.recipe")}</Label>
                            <RadioWidget
                                field={"recipe"}
                                formData={formData}
                                setFormData={setFormData}
                                options={setChecked(getFormOptions(recipeOptions), formData.recipe)}
                                required={true}
                                gridStyling={`grid grid-cols-2 gap-1`}
                                optionLabelMapper={(option: RadioOption) => {
                                    const optionRecipe: Recipe = recipes.data!.filter(recipe => recipe["@id"] === option.value)[0]
                                    return (
                                        <label
                                            htmlFor={option.id}
                                            className={"p-2 flex flex-row items-center cursor-pointer rounded-lg peer-checked:rounded-3xl h-full" +
                                                " active:scale-95 font-[500] w-full transition duration-300 text-primary-100" +
                                                " dark:text-primary-dark-100 bg-secondary-200 dark:bg-secondary-dark-200 " +
                                                " peer-checked:text-white dark:peer-checked:text-primary-dark-100 " +
                                                " peer-checked:bg-primary-100 dark:peer-checked:bg-primary-dark-200"}
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
                        </div>
                    </div>

                    <div className="pb-[5.5rem] md:pb-0" />
                </form>
            )}
        </StandardContentWrapper>
    )
}

const useSidebarTopbarConfiguration = (): void => {
    const t: TranslationFunction = useTranslation(PlannerTranslations)
    const sidebar: Sidebar = useNullishContext(SidebarContext)
    const topbar: Topbar = useNullishContext(TopbarContext)

    useEffect(() => {
        sidebar
            .configuration
            .activeItem("planner")
            .rebuild()

        topbar
            .configuration
            .title(t("topbar.title.edit.meal"))
            .backButton({ isVisible: true, path: "/planner" })
            .mainViewWidth("md:max-w-[900px]")
            .rebuild()

        window.scroll(0, 0)
    }, [])
}
