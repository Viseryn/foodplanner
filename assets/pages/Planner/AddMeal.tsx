import { Label } from '@/components/form/Label'
import { LabelledFormWidget } from "@/components/form/LabelledFormWidget"
import { RadioWidget } from "@/components/form/RadioWidget"
import Button from '@/components/ui/Buttons/Button'
import Card from '@/components/ui/Card'
import Notification from '@/components/ui/Notification'
import Spacer from '@/components/ui/Spacer'
import Spinner from '@/components/ui/Spinner'
import { StandardContentWrapper } from '@/components/ui/StandardContentWrapper'
import { BasePageComponentProps } from "@/types/BasePageComponentProps"
import DayModel from '@/types/DayModel'
import { DayOption } from "@/types/options/DayOption"
import { PageState } from "@/types/enums/PageState"
import { Form } from "@/types/forms/Form"
import MealCategoryModel from '@/types/MealCategoryModel'
import { MealCategoryOption } from '@/types/options/MealCategoryOption'
import RecipeModel from '@/types/RecipeModel'
import { RecipeOption } from "@/types/options/RecipeOption"
import SettingsModel from '@/types/SettingsModel'
import { UserGroupModel } from '@/types/UserGroupModel'
import { UserGroupOption } from '@/types/options/UserGroupOption'
import { getEntityOptions } from '@/util/forms/getEntityOptions'
import { getFormOptions } from '@/util/forms/getFormOptions'
import { setChecked } from "@/util/forms/setChecked"
import { tryApiRequest } from "@/util/tryApiRequest"
import axios from 'axios'
import React, { ReactElement, useEffect, useState } from 'react'
import { Navigate, NavigateFunction, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import DayRadioSkeleton from './components/DayRadioSkeleton'
import RadioSkeleton from './components/RadioSkeleton'
import RecipeListSkeleton from './components/RecipeListSkeleton'
import SearchWidget from './components/SearchWidget'

type AddMealProps = BasePageComponentProps & {
    days: EntityState<Array<DayModel>>
    recipes: EntityState<Array<RecipeModel>>
    mealCategories: EntityState<Array<MealCategoryModel>>
    userGroups: EntityState<Array<UserGroupModel>>
    settings: EntityState<SettingsModel>
}

type AddMealRouteParams = {
    id?: string
}

type AddMealForm = Form & {
    day: string
    mealCategory: string
    userGroup: string
    recipe: string
}

export function AddMeal(props: AddMealProps): ReactElement {
    const {
        days,
        recipes,
        mealCategories,
        userGroups,
        settings,
        setSidebar,
        setTopbar,
    } = props

    const { id }: AddMealRouteParams = useParams() // The id parameter of the route '/planner/add/:id'
    const searchParams: URLSearchParams = useSearchParams()[0]
    const navigate: NavigateFunction = useNavigate()

    const userGroupOptions = getEntityOptions(userGroups, UserGroupOption)
    const mealCategoryOptions = getEntityOptions(mealCategories, MealCategoryOption)

    const [recipeQuery, setRecipeQuery] = useState<string>('')
    const [selectedRecipe, setSelectedRecipe] = useState<number>(0)
    const [state, setState] = useState<PageState>(PageState.WAITING)

    const [formData, setFormData] = useState<AddMealForm>({
        day: id ?? "",
        mealCategory: "",
        userGroup: "",
        recipe: "",
    })

    useEffect(() => {
        if (!settings.isLoading) {
            setFormData(formData => ({
                ...formData,
                mealCategory: settings.data.standardMealCategory?.id.toString() ?? "",
                userGroup: settings.data.standardUserGroup?.id.toString() ?? "",
            }))
        }
    }, [settings]);

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

        void tryApiRequest("POST", "/api/meals", async (apiUrl) => {
            const response = await axios.post(apiUrl, formData)
            days.load()
            setState(PageState.SUCCESS)
            return response
        })
    }

    useEffect(() => {
        if (recipes.isLoading) {
            return
        }

        // Preselect recipe if recipe query param is given
        if (searchParams.get('recipe') !== null) {
            setSelectedRecipe(parseInt(searchParams.get('recipe')!))
            setRecipeQuery(
                '' + recipes.data.find(
                    recipe => recipe.id === parseInt(searchParams.get('recipe')!),
                )?.title,
            )
            setFormData(formData => ({
                ...formData,
                recipe: searchParams.get('recipe')!,
            }))
        }
    }, [recipes]);

    useEffect(() => {
        setSidebar('planner')
        setTopbar({
            title: 'Neue Mahlzeit',
            showBackButton: true,
            onBackButtonClick: () => navigate(-1),
        })

        window.scrollTo(0, 0)
    }, [])

    return (
        <StandardContentWrapper className="md:max-w-[900px]">
            {state === PageState.LOADING &&
                <Spinner />
            }

            {state === PageState.SUCCESS &&
                <Navigate to="/planner" />
            }

            {[PageState.WAITING, PageState.ERROR].includes(state) &&
                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
                        <div className="md:order-last">
                            <Card>
                                <LabelledFormWidget
                                    id={"day"}
                                    label={"Für welchen Tag?"}
                                    widget={days.isLoading ? (
                                        <DayRadioSkeleton />
                                    ) : (
                                        <RadioWidget
                                            field={"day"}
                                            formData={formData}
                                            setFormData={setFormData}
                                            options={setChecked(getFormOptions(getEntityOptions(days, DayOption)), +id!)}
                                            required={true}
                                            gridStyling={`grid grid-cols-5 gap-2`}
                                            optionLabelMapper={option => (
                                                <label
                                                    htmlFor={option.id}
                                                    className="cursor-pointer rounded-xl h-12 transition duration-300 flex flex-col justify-center items-center active:scale-95 text-primary-100 dark:text-primary-dark-100 bg-secondary-100 dark:bg-secondary-dark-100 hover:bg-secondary-200 dark:hover:bg-secondary-dark-200 peer-checked:bg-secondary-200 dark:peer-checked:bg-secondary-dark-200 border border-secondary-200 dark:border-secondary-dark-200"
                                                >
                                                    <span className="text-sm font-semibold">{option.icon}</span>
                                                    <span className="text-xs">{option.label}</span>
                                                </label>
                                            )}
                                        />
                                    )}
                                />

                                <Spacer height="6" />

                                <LabelledFormWidget
                                    id={"mealCategory"}
                                    label={"Wann ist die Mahlzeit?"}
                                    widget={mealCategories.isLoading || settings.isLoading ? (
                                        <RadioSkeleton />
                                    ) : (
                                        <RadioWidget
                                            field={"mealCategory"}
                                            formData={formData}
                                            setFormData={setFormData}
                                            options={setChecked(getFormOptions(mealCategoryOptions), settings.data.standardMealCategory?.id)}
                                            required={true}
                                        />
                                    )}
                                />

                                <Spacer height="6" />

                                <LabelledFormWidget
                                    id={"userGroup"}
                                    label={"Für wen ist die Mahlzeit?"}
                                    widget={userGroups.isLoading || settings.isLoading ? (
                                        <RadioSkeleton />
                                    ) : (
                                        <RadioWidget
                                            field={"userGroup"}
                                            formData={formData}
                                            setFormData={setFormData}
                                            options={setChecked(getFormOptions(userGroupOptions), settings.data.standardUserGroup?.id)}
                                            required={true}
                                        />
                                    )}
                                />
                            </Card>

                            <div className="flex justify-end md:pt-4">
                                {!days.isLoading && !mealCategories.isLoading && !recipes.isLoading && !userGroups.isLoading &&
                                    <Button
                                        type="submit"
                                        icon="save"
                                        label="Speichern"
                                        outlined={true}
                                        isFloating={true}
                                    />
                                }
                            </div>
                        </div>

                        <Card>
                            <Label htmlFor="recipe">Welches Rezept?</Label>
                            {recipes.isLoading ? (
                                <RecipeListSkeleton />
                            ) : (
                                <div>
                                    <SearchWidget
                                        inputValue={recipeQuery}
                                        setInputValue={setRecipeQuery}
                                        placeholder="Suche nach Rezepten ..."
                                    />

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
                                            data: recipes.data.filter(recipe => recipe.title.toLowerCase().includes(recipeQuery.toLowerCase())),
                                        }, RecipeOption)), parseInt(searchParams.get('recipe')!))}
                                        required={true}
                                        gridStyling={`grid grid-cols-2 gap-2`}
                                        optionLabelMapper={option => {
                                            const optionRecipe: RecipeModel = recipes.data.filter(recipe => recipe.id === +(option.value!))[0]
                                            return (
                                                <label
                                                    htmlFor={option.id}
                                                    className="flex flex-row items-center cursor-pointer rounded-xl h-12 font-[500] w-full transition duration-300 active:scale-95 text-primary-100 dark:text-primary-dark-100 bg-secondary-100 dark:bg-secondary-dark-100 hover:bg-secondary-200 dark:hover:bg-secondary-dark-200 peer-checked:bg-secondary-200 dark:peer-checked:bg-secondary-dark-200 border border-secondary-200 dark:border-secondary-dark-200"
                                                    onClick={() => {
                                                        setSelectedRecipe(optionRecipe.id)
                                                        setState(PageState.WAITING)
                                                    }}
                                                >
                                                    <img
                                                        className="rounded-xl h-12 w-12 object-cover transition duration-300"
                                                        src={optionRecipe.image ? (optionRecipe.image?.directory + 'THUMBNAIL__' + optionRecipe.image?.filename) : '/img/default.jpg'}
                                                        alt={optionRecipe.title}
                                                    />
                                                    <div className="px-4 whitespace-nowrap overflow-hidden text-ellipsis">
                                                        {option.label}
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
                        </Card>
                    </div>

                    <div className="pb-[5.5rem] md:pb-0" />
                </form>
            }
        </StandardContentWrapper>
    )
}
