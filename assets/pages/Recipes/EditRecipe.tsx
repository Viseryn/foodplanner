/*****************************************
 * ./assets/pages/Recipes/EditRecipe.tsx *
 *****************************************/

import axios, { AxiosResponse } from 'axios'
import React, { ReactElement, useEffect, useState } from 'react'
import { NavigateFunction, useNavigate, useParams } from 'react-router-dom'
import swal from 'sweetalert'

import InputRow from '@/components/form/Input/InputRow'
import SliderRow from '@/components/form/Slider/SliderRow'
import TextareaRow from '@/components/form/Textarea/TextareaRow'
import Button from '@/components/ui/Buttons/Button'
import Card from '@/components/ui/Card'
import Spacer from '@/components/ui/Spacer'
import Spinner from '@/components/ui/Spinner'
import DayModel from '@/types/DayModel'
import RecipeModel from '@/types/RecipeModel'
import RecipeForm from '@/types/RecipeForm'
import getRecipeModel from '@/pages/Recipes/util/getRecipeModel'
import getIngredientsAsString from '@/pages/Recipes/util/getIngredientsAsString'
import getInstructionsAsString from '@/pages/Recipes/util/getInstructionsAsString'
import { getImageModel } from '@/pages/Recipes/util/getImageModel'
import ImageModel from '@/types/ImageModel'
import { StandardContentWrapper } from '@/components/ui/StandardContentWrapper'
import { TwoColumnView } from '@/components/ui/TwoColumnView'
import { ImageUploadWidget } from '@/pages/Recipes/components/ImageUploadWidget'

/**
 * A component that renders a form for editing an existing recipe. After submitting via the submit
 * button, the recipe will be updated by an API and the user gets redirected to its detail page.
 *
 * @component
 */
export default function EditRecipe({ recipes, days, setSidebar, setTopbar }: {
    recipes: EntityState<Array<RecipeModel>>
    days: EntityState<Array<DayModel>>
    setSidebar: SetSidebarAction
    setTopbar: SetTopbarAction
}): ReactElement {
    type EditRecipeRouteParams = {
        id?: string
    }

    const { id }: EditRecipeRouteParams = useParams()
    const navigate: NavigateFunction = useNavigate()
    const [recipe, setRecipe] = useState<RecipeModel>({} as RecipeModel)

    // The file that was selected
    const [file, setFile] = useState<File | null>(null)

    // Whether the page is loading. Will be true while the form data is processed by the API.
    const [isLoading, setLoading] = useState<boolean>(false)

    // The ID of the new recipe. Will be provided be the API and can be used for redirecting.
    const [responseId, setResponseId] = useState<number>(0)

    // Form data
    const [recipeForm, setRecipeForm] = useState<RecipeForm>({
        title: '',
        portionSize: 1,
        ingredients: '',
        instructions: '',
    })

    // Initializes the recipe state variable. Each time the id parameter changes, the recipe state 
    // is updated. When the recipes are reloaded, recipe is also updated.
    useEffect(() => {
        if (recipes.isLoading) {
            return
        }

        // Find correct recipe
        const queryResult: Array<RecipeModel> = recipes.data.filter(recipe => recipe.id.toString() == id)
        setRecipe(queryResult[0])
        setRecipeForm(prev => ({
            ...prev,
            title: queryResult[0].title,
            portionSize: queryResult[0].portionSize,
            ingredients: getIngredientsAsString(queryResult[0].ingredients),
            instructions: getInstructionsAsString(queryResult[0].instructions),
        }))

        // If recipe does not exist, redirect to 404 page
        if (queryResult.length === 0) {
            navigate('/error/404')
        }
    }, [id, recipes.isLoading])

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
        const response: AxiosResponse<RecipeModel> = await axios.post(`/api/recipes/${id}`, recipe)

        const imageUpload: ImageModel = await getImageModel(file, file === null)
        await axios.patch(`/api/recipes/${id}/image`, imageUpload)

        recipes.load()
        days.load()
        setResponseId(response.data.id)
        setLoading(false)
    }

    useEffect(() => {
        if (responseId > 0) {
            navigate('/recipe/' + responseId)
        }
    }, [responseId])

    const deleteRecipe = (id: number): void => {
        swal({
            dangerMode: true,
            icon: 'error',
            title: 'Rezept endgültig löschen?',
            text: 'Gelöschte Rezepte können nicht wiederhergestellt werden.',
            buttons: ["Abbrechen", "Löschen"],
        }).then(confirm => {
            if (confirm) {
                axios
                    .delete('/api/recipes/' + id)
                    .then(() => {
                        // Reload recipes and days
                        recipes.load()
                        days.load()

                        // Navigate to recipe list
                        navigate('/recipes')
                    })
            }
        })
    }

    // Load layout
    useEffect(() => {
        setSidebar('recipes')
        setTopbar({
            title: recipe?.title,
            showBackButton: true,
            backButtonPath: '/recipe/' + id,
            actionButtons: [
                { icon: 'delete', onClick: () => deleteRecipe(recipe?.id) }
            ],
            truncate: true,
            style: 'max-w-[900px] pr-4',
            isLoading: recipes.isLoading,
        })

        // Scroll to top
        window.scrollTo(0, 0)
    }, [recipe])

    return (
        <StandardContentWrapper className="md:max-w-[900px]">
            {isLoading || recipes.isLoading ? (
                <Spinner />
            ) : (
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
                                    value: recipeForm.title,
                                }}
                            />

                            <Spacer height="6" />

                            <SliderRow
                                key={recipe?.id}
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
                                    value: recipeForm.portionSize,
                                }}
                            />

                            <Spacer height="6" />

                            <ImageUploadWidget setFile={setFile} recipe={recipe} />
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
                                    value: recipeForm.ingredients,
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
                                    value: recipeForm.instructions,
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
            )}
        </StandardContentWrapper>
    )
}
