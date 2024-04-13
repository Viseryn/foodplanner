import InputRow from '@/components/form/Input/InputRow'
import SliderRow from '@/components/form/Slider/SliderRow'
import TextareaRow from '@/components/form/Textarea/TextareaRow'
import Button from '@/components/ui/Buttons/Button'
import Card from '@/components/ui/Card'
import Spacer from '@/components/ui/Spacer'
import Spinner from '@/components/ui/Spinner'
import { StandardContentWrapper } from '@/components/ui/StandardContentWrapper'
import { TwoColumnView } from '@/components/ui/TwoColumnView'
import { ImageUploadWidget } from '@/pages/Recipes/components/ImageUploadWidget'
import { getImageModel } from '@/pages/Recipes/util/getImageModel'
import getRecipeModel from '@/pages/Recipes/util/getRecipeModel'
import { PageState } from "@/types/enums/PageState"
import ImageModel from '@/types/ImageModel'
import { Optional } from "@/types/Optional"
import { RecipeForm } from '@/types/forms/RecipeForm'
import RecipeModel from '@/types/RecipeModel'
import { tryApiRequest } from "@/util/tryApiRequest"
import axios, { AxiosResponse } from 'axios'
import React, { ReactElement, useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'

type AddRecipeProps = {
    recipes: EntityState<Array<RecipeModel>>
    setSidebar: SetSidebarAction
    setTopbar: SetTopbarAction
}

export const AddRecipe = ({ recipes, setSidebar, setTopbar }: AddRecipeProps): ReactElement => {
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

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
        setRecipeFormData(prev => ({
            ...prev,
            [event.target.name]: event.target.value,
        }))
    }

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
        event.preventDefault()
        setState(PageState.LOADING)

        const recipe: RecipeModel = getRecipeModel(recipeFormData)
        let recipeResponse: Optional<RecipeModel>

        const postResponse: boolean = await tryApiRequest("POST", "/api/recipes", async (apiUrl) => {
            const response: AxiosResponse<RecipeModel> = await axios.post(apiUrl, recipe)
            recipeResponse = response.data
            return response
        })

        if (postResponse && recipeResponse !== undefined) {
            if (file !== null) {
                const imageUpload: ImageModel = await getImageModel(file)
                await tryApiRequest("PATCH", `/api/recipes/${recipeResponse.id}/image`, async (apiUrl) => {
                    return await axios.patch(apiUrl, imageUpload)
                })
            }

            recipes.load()
            setResponseId(recipeResponse.id)
            setState(recipeResponse.id > 0 ? PageState.SUCCESS : PageState.ERROR)
        }
    }

    useEffect(() => {
        if (!recipes.isLoading) {
            setState(PageState.WAITING)
        }
    }, [recipes.isLoading]);

    useEffect(() => {
        setSidebar('recipes')
        setTopbar({
            title: 'Neues Rezept',
            showBackButton: true,
            backButtonPath: '/recipes',
        })

        window.scrollTo(0, 0)
    }, [])

    return (
        <StandardContentWrapper className="md:max-w-[900px]">
            {state === PageState.LOADING &&
                <Spinner />
            }

            {state === PageState.SUCCESS &&
                <Navigate to={`/recipe/${responseId}`} />
            }

            {[PageState.WAITING, PageState.ERROR].includes(state) &&
                <form onSubmit={handleSubmit}>
                    <TwoColumnView>
                        <Card>
                            <InputRow
                                id="title"
                                label="Titel"
                                {...{
                                    required: true,
                                    maxLength: 255,
                                    onChange: handleInputChange,
                                    name: 'title',
                                }}
                            />

                            <Spacer height="6" />

                            <SliderRow
                                id="portionSize"
                                label="Wie viele Portionen?"
                                {...{
                                    min: 1,
                                    max: 10,
                                    step: 1,
                                    marks: [...Array(10)].map((value, index) => ({
                                        value: index + 1,
                                        label: index + 1,
                                    })),
                                    onChange: handleInputChange,
                                    name: 'portionSize',
                                }}
                            />

                            <Spacer height="6" />

                            <ImageUploadWidget
                                setFile={setFile}
                                imagePreviewUrl={imagePreviewUrl}
                                setImagePreviewUrl={setImagePreviewUrl}
                            />
                        </Card>

                        <Card>
                            <TextareaRow
                                id="ingredients"
                                label="Zutaten"
                                {...{
                                    rows: 10,
                                    placeholder: "250 ml Gemüsebrühe\n1/2 Tube Tomatenmark\n10 g Salz",
                                    onChange: handleInputChange,
                                    name: 'ingredients',
                                }}
                            />

                            <Spacer height="6" />

                            <TextareaRow
                                id="instructions"
                                label="Zubereitung"
                                {...{
                                    rows: 10,
                                    placeholder: "Schreibe jeden Schritt in eine eigene Zeile.",
                                    onChange: handleInputChange,
                                    name: 'instructions',
                                }}
                            />
                        </Card>
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
