import { InputWidget } from "@/components/form/InputWidget"
import { LabelledFormWidget } from "@/components/form/LabelledFormWidget"
import { SliderWidget } from "@/components/form/SliderWidget"
import { TextareaWidget } from "@/components/form/TextareaWidget"
import Button from "@/components/ui/Buttons/Button"
import { OuterCard } from "@/components/ui/Cards/OuterCard"
import Spacer from "@/components/ui/Spacer"
import { Spinner } from "@/components/ui/Spinner"
import { GlobalAppDataContext } from "@/context/GlobalAppDataContext"
import { SidebarContext } from "@/context/SidebarContext"
import { TopbarContext } from "@/context/TopbarContext"
import { useNullishContext } from "@/hooks/useNullishContext"
import { StandardContentWrapper } from "@/layouts/StandardContentWrapper"
import { TwoColumnView } from "@/layouts/TwoColumnView"
import { ImageUploadWidget } from "@/pages/Recipes/components/ImageUploadWidget"
import { createRecipe } from "@/pages/Recipes/util/createRecipe"
import { createRecipeImage } from "@/pages/Recipes/util/createRecipeImage"
import { Detached } from "@/types/api/Detached"
import { Image } from "@/types/api/Image"
import { Recipe } from "@/types/api/Recipe"
import { Base64Image } from "@/types/Base64Image"
import { PageState } from "@/types/enums/PageState"
import { RecipeForm } from "@/types/forms/RecipeForm"
import { GlobalAppData } from "@/types/GlobalAppData"
import { Maybe } from "@/types/Maybe"
import { Sidebar } from "@/types/sidebar/Sidebar"
import { Topbar } from "@/types/topbar/Topbar"
import { ApiRequest } from "@/util/ApiRequest"
import React, { ReactElement, useEffect, useState } from "react"
import { Navigate, NavigateFunction, useNavigate } from "react-router-dom"

export const AddRecipe = (): ReactElement => {
    const navigate: NavigateFunction = useNavigate()
    const sidebar: Sidebar = useNullishContext(SidebarContext)
    const topbar: Topbar = useNullishContext(TopbarContext)
    const { recipes }: Partial<GlobalAppData> = useNullishContext(GlobalAppDataContext)

    const [file, setFile] = useState<File | null>(null)
    const [state, setState] = useState<PageState>(PageState.LOADING)
    const [responseId, setResponseId] = useState<number>(0)
    const [recipeFormData, setRecipeFormData] = useState<RecipeForm>({
        title: '',
        portionSize: 1,
        ingredients: '',
        instructions: '',
    })
    const [imagePreviewUrl, setImagePreviewUrl] = useState<string>('')

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
        event.preventDefault()
        setState(PageState.LOADING)

        const recipe: Detached<Recipe> = createRecipe(recipeFormData)
        const recipeResponse: Maybe<Recipe> = await ApiRequest.post<Recipe>("/api/recipes", recipe).build().getResponse()

        if (recipeResponse) {
            if (file) {
                const imageUpload: Base64Image = await createRecipeImage(file)
                await ApiRequest.patch<Image>(`${recipeResponse["@id"]}/image`, imageUpload).execute()
            }

            recipes.load()
            setResponseId(recipeResponse.id)
            setState(recipeResponse.id > 0 ? PageState.SUCCESS : PageState.ERROR)
        } else {
            setState(PageState.ERROR)
        }
    }

    useEffect(() => {
        if (!recipes.isLoading) {
            setState(PageState.WAITING)
        }
    }, [recipes.isLoading])

    useEffect(() => {
        sidebar.configuration
               .activeItem("recipes")
               .rebuild()
        topbar.configuration
              .title("Neues Rezept")
              .backButton({ isVisible: true, path: "/recipes" })
              .truncate(true)
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
                <Navigate to={`/recipe/${responseId}`} />
            }

            {[PageState.WAITING, PageState.ERROR].includes(state) &&
                <form onSubmit={handleSubmit}>
                    <TwoColumnView>
                        <OuterCard>
                            <LabelledFormWidget
                                id={"title"}
                                label={"Titel"}
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

                            <LabelledFormWidget
                                id={"portionSize"}
                                label={"Wie viele Portionen?"}
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
                            />
                        </OuterCard>

                        <OuterCard>
                            <LabelledFormWidget
                                id={"ingredients"}
                                label={"Zutaten"}
                                widget={
                                    <TextareaWidget
                                        field={"ingredients"}
                                        formData={recipeFormData}
                                        setFormData={setRecipeFormData}
                                        rows={10}
                                        placeholder={"250 ml Gemüsebrühe\n1/2 Tube Tomatenmark\n10 g Salz"}
                                    />
                                }
                            />

                            <Spacer height="6" />

                            <LabelledFormWidget
                                id={"instructions"}
                                label={"Zubereitung"}
                                widget={
                                    <TextareaWidget
                                        field={"instructions"}
                                        formData={recipeFormData}
                                        setFormData={setRecipeFormData}
                                        rows={10}
                                        placeholder={"Schreibe jeden Schritt in eine eigene Zeile."}
                                    />
                                }
                            />
                        </OuterCard>
                    </TwoColumnView>

                    <div className="flex justify-end md:mt-4 pb-[5.5rem] md:pb-0">
                        <Button
                            type="submit"
                            icon="save"
                            label="Speichern"
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
