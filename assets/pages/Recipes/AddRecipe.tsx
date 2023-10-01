/****************************************
 * ./assets/pages/Recipes/AddRecipe.tsx *
 ****************************************/

import axios, { AxiosResponse } from 'axios'
import React, { ReactElement, useEffect, useState } from 'react'
import { NavigateFunction, useNavigate } from 'react-router-dom'

import InputRow from '@/components/form/Input/InputRow'
import SliderRow from '@/components/form/Slider/SliderRow'
import TextareaRow from '@/components/form/Textarea/TextareaRow'
import Button from '@/components/ui/Buttons/Button'
import Card from '@/components/ui/Card'
import Spacer from '@/components/ui/Spacer'
import Spinner from '@/components/ui/Spinner'
import RecipeModel from '@/types/RecipeModel'
import RecipeForm from '@/types/RecipeForm'
import getRecipeModel from '@/pages/Recipes/util/getRecipeModel'
import ImageModel from '@/types/ImageModel'
import { getImageModel } from '@/pages/Recipes/util/getImageModel'
import { TwoColumnView } from '@/components/ui/TwoColumnView'
import { StandardContentWrapper } from '@/components/ui/StandardContentWrapper'
import { ImageUploadWidget } from '@/pages/Recipes/components/ImageUploadWidget'

/**
 * AddRecipe
 *
 * A component that renders a form for adding a recipe. After submitting via the submit button,
 * the recipe will be added by an API and the user gets forwarded to its detail page.
 *
 * @component
 */
export default function AddRecipe({ recipes, setSidebar, setTopbar }: {
    recipes: EntityState<Array<RecipeModel>>
    setSidebar: SetSidebarAction
    setTopbar: SetTopbarAction
}): ReactElement {
    // The file that was selected
    const [file, setFile] = useState<File | null>(null)

    // Whether the page is loading. Will be true while the form data is processed by the API.
    const [isLoading, setLoading] = useState<boolean>(false)

    // The ID of the new recipe. Will be provided be the API and can be used for redirecting.
    const [responseId, setResponseId] = useState<number>(0)

    // Needed for the redirect after submit
    const navigate: NavigateFunction = useNavigate()

    // Form data
    const [recipeForm, setRecipeForm] = useState<RecipeForm>({
        title: '',
        portionSize: 1,
        ingredients: '',
        instructions: '',
    })

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
        setRecipeForm(prev => ({
            ...prev,
            [event.target.name]: event.target.value,
        }))
    }

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
        event.preventDefault()
        setLoading(true)

        const recipe: RecipeModel = getRecipeModel(recipeForm)
        const response: AxiosResponse<RecipeModel> = await axios.post('/api/recipes', recipe)

        if (file !== null) {
            const imageUpload: ImageModel = await getImageModel(file)
            await axios.patch(`/api/recipes/${response.data.id}/image`, imageUpload)
        }

        recipes.load()
        setResponseId(response.data.id)
        setLoading(false)
    }

    useEffect(() => {
        if (responseId > 0) {
            navigate('/recipe/' + responseId)
        }
    }, [responseId])

    // Load layout
    useEffect(() => {
        setSidebar('recipes')
        setTopbar({
            title: 'Neues Rezept',
            showBackButton: true,
            backButtonPath: '/recipes',
        })

        // Scroll to top
        window.scrollTo(0, 0)
    }, [])

    return (
        <StandardContentWrapper>
            <div className="md:max-w-[900px]">
                {isLoading || recipes.isLoading ? (
                    <Spinner />
                ) : (
                    <div className="mx-4 md:ml-0">
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

                            <ImageUploadWidget setFile={setFile} />
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
                    </div>
                )}
            </div>
        </StandardContentWrapper>
    )
}
