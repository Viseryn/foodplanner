import { InputWidget } from "@/components/form/InputWidget"
import { LabelledFormWidget } from "@/components/form/LabelledFormWidget"
import { SliderWidget } from "@/components/form/SliderWidget"
import { SwitchWidget } from "@/components/form/SwitchWidget"
import { TextareaWidget } from "@/components/form/TextareaWidget"
import Button from "@/components/ui/Buttons/Button"
import { OuterCard } from "@/components/ui/Cards/OuterCard"
import Spacer from "@/components/ui/Spacer"
import { Spinner } from "@/components/ui/Spinner"
import { GlobalAppDataContext } from "@/context/GlobalAppDataContext"
import { SidebarContext } from "@/context/SidebarContext"
import { TopbarContext } from "@/context/TopbarContext"
import { useNullishContext } from "@/hooks/useNullishContext"
import { TranslationFunction, useTranslation } from "@/hooks/useTranslation"
import { StandardContentWrapper } from "@/layouts/StandardContentWrapper"
import { TwoColumnView } from "@/layouts/TwoColumnView"
import { ImageUploadWidget } from "@/pages/Recipes/components/ImageUploadWidget"
import { RecipeTranslations } from "@/pages/Recipes/RecipeTranslations"
import { createRecipe } from "@/pages/Recipes/util/createRecipe"
import { createRecipeImage } from "@/pages/Recipes/util/createRecipeImage"
import getIngredientsAsString from "@/pages/Recipes/util/getIngredientsAsString"
import getInstructionsAsString from "@/pages/Recipes/util/getInstructionsAsString"
import { Detached } from "@/types/api/Detached"
import { Image } from "@/types/api/Image"
import { Recipe } from "@/types/api/Recipe"
import { Base64Image } from "@/types/Base64Image"
import { PageState } from "@/types/enums/PageState"
import { SwitchValue } from "@/types/enums/SwitchValue"
import { RecipeForm } from "@/types/forms/RecipeForm"
import { GlobalAppData } from "@/types/GlobalAppData"
import { Maybe } from "@/types/Maybe"
import { Sidebar } from "@/types/sidebar/Sidebar"
import { Topbar } from "@/types/topbar/Topbar"
import { ApiRequest } from "@/util/ApiRequest"
import React, { ReactElement, useEffect, useState } from "react"
import { Navigate, NavigateFunction, useNavigate, useParams } from "react-router-dom"

export const EditRecipe = (): ReactElement => {
    const { id }: { id?: string } = useParams()
    const t: TranslationFunction = useTranslation(RecipeTranslations)
    const navigate: NavigateFunction = useNavigate()

    const sidebar: Sidebar = useNullishContext(SidebarContext)
    const topbar: Topbar = useNullishContext(TopbarContext)
    const { recipes, meals }: Partial<GlobalAppData> = useNullishContext(GlobalAppDataContext)

    const [file, setFile] = useState<File | null>(null)
    const [state, setState] = useState<PageState>(PageState.LOADING)
    const [responseId, setResponseId] = useState<number>(0)
    const [recipe, setRecipe] = useState<Recipe>({} as Recipe)
    const [recipeFormData, setRecipeFormData] = useState<RecipeForm>({
        title: "",
        portionSize: 1,
        ingredients: "",
        instructions: "",
        externalUrl: "",
        sideDish: SwitchValue.OFF,
    })
    const [imagePreviewUrl, setImagePreviewUrl] = useState<string>('')

    useEffect(() => {
        if (recipes.isLoading) {
            return
        }

        const queryResult: Recipe[] = recipes.data.filter(recipe => recipe.id.toString() == id)
        if (queryResult.length === 0) {
            navigate("/error/404")
        }

        const recipeResult: Recipe = queryResult[0]
        setRecipe(recipeResult)
        setRecipeFormData(prev => ({
            ...prev,
            title: recipeResult.title,
            portionSize: recipeResult.portionSize,
            ingredients: getIngredientsAsString(recipeResult.ingredients),
            instructions: getInstructionsAsString(recipeResult.instructions),
            externalUrl: recipeResult.externalUrl ?? "",
            sideDish: recipeResult.sideDish ? SwitchValue.ON : SwitchValue.OFF,
        }))
        setState(PageState.WAITING)
    }, [id, recipes.isLoading])

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
        event.preventDefault()
        setState(PageState.LOADING)

        const recipe: Detached<Recipe> = createRecipe(recipeFormData)

        const recipeResponse: Maybe<Recipe> = await ApiRequest.patch<Recipe>(`/api/recipes/${id}`, recipe).build().getResponse()

        if (recipeResponse) {
            const noNewImage: boolean = imagePreviewUrl.length === 0

            if (recipeResponse.image && noNewImage) {
                await ApiRequest.delete(`${recipeResponse["@id"]}/image`).execute()
            } else if (file) {
                const newRecipeImage: Base64Image = await createRecipeImage(file)
                await ApiRequest.patch<Image>(`${recipeResponse["@id"]}/image`, newRecipeImage).execute()
            }

            recipes.load()
            meals.load()
            setResponseId(recipeResponse.id)
            setState(recipeResponse.id > 0 ? PageState.SUCCESS : PageState.ERROR)
        } else {
            setState(PageState.ERROR)
        }
    }

    useEffect(() => {
        sidebar.configuration
               .activeItem("recipes")
               .rebuild()

        topbar.configuration
              .title(recipe?.title)
              .backButton({ isVisible: true, path: `/recipe/${id}` })
              .truncate(true)
              .mainViewWidth("md:max-w-[900px]")
              .isLoading(recipes.isLoading)
              .rebuild()

        window.scrollTo(0, 0)
    }, [recipe, state])

    return (
        <StandardContentWrapper>
            {state === PageState.LOADING &&
                <Spinner />
            }

            {state === PageState.SUCCESS &&
                <Navigate to={`/recipe/${responseId}`} />
            }

            {[PageState.WAITING, PageState.ERROR].includes(state) &&
                <form onSubmit={handleSubmit}>
                    <TwoColumnView>
                        <OuterCard>
                            <LabelledFormWidget
                                id={"title"}
                                label={t("label.title")}
                                widget={
                                    <InputWidget
                                        field={"title"}
                                        formData={recipeFormData}
                                        setFormData={setRecipeFormData}
                                        required={true}
                                        maxLength={255}
                                    />
                                }
                            />

                            <Spacer height="6" />

                            <SwitchWidget
                                field={"sideDish"}
                                formData={recipeFormData}
                                setFormData={setRecipeFormData}
                                displayedText={t("label.sideDish")}
                                onClick={() => {
                                    setRecipeFormData({
                                        ...recipeFormData,
                                        sideDish: recipeFormData.sideDish === SwitchValue.OFF
                                            ? SwitchValue.ON
                                            : SwitchValue.OFF,
                                    })
                                }}
                            />

                            <Spacer height="6" />

                            <LabelledFormWidget
                                id={"portionSize"}
                                label={t("label.portionSize")}
                                widget={
                                    <SliderWidget
                                        field={"portionSize"}
                                        formData={recipeFormData}
                                        setFormData={setRecipeFormData}
                                        min={1}
                                        max={10}
                                        step={1}
                                    />
                                }
                            />

                            <Spacer height="6" />

                            <ImageUploadWidget
                                setFile={setFile}
                                imagePreviewUrl={imagePreviewUrl}
                                setImagePreviewUrl={setImagePreviewUrl}
                                recipe={recipe}
                            />

                            <Spacer height="6" />

                            <LabelledFormWidget
                                id={"externalUrl"}
                                label={t("label.externalUrl")}
                                widget={
                                    <InputWidget
                                        field={"externalUrl"}
                                        formData={recipeFormData}
                                        setFormData={setRecipeFormData}
                                        placeholder={"https://..."}
                                    />
                                }
                            />
                        </OuterCard>

                        <OuterCard>
                            <LabelledFormWidget
                                id={"ingredients"}
                                label={t("label.ingredients")}
                                widget={
                                    <TextareaWidget
                                        field={"ingredients"}
                                        formData={recipeFormData}
                                        setFormData={setRecipeFormData}
                                        rows={10}
                                        placeholder={t("placeholder.ingredients")}
                                    />
                                }
                            />

                            <Spacer height="6" />

                            <LabelledFormWidget
                                id={"instructions"}
                                label={t("label.instructions")}
                                widget={
                                    <TextareaWidget
                                        field={"instructions"}
                                        formData={recipeFormData}
                                        setFormData={setRecipeFormData}
                                        rows={10}
                                        placeholder={t("placeholder.instructions")}
                                    />
                                }
                            />
                        </OuterCard>
                    </TwoColumnView>

                    <div className="flex justify-end md:mt-4 pb-[5.5rem] md:pb-0">
                        <Button
                            type="submit"
                            icon="save"
                            label={t("button.save")}
                            isElevated={true}
                            outlined={true}
                            isFloating={true}
                        />
                    </div>
                </form>
            }
        </StandardContentWrapper>
    )
}
