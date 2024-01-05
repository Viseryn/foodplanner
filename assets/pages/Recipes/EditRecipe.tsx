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
import getIngredientsAsString from '@/pages/Recipes/util/getIngredientsAsString'
import getInstructionsAsString from '@/pages/Recipes/util/getInstructionsAsString'
import getRecipeModel from '@/pages/Recipes/util/getRecipeModel'
import DayModel from '@/types/DayModel'
import { PageState } from "@/types/enums/PageState"
import ImageModel from '@/types/ImageModel'
import { Optional } from "@/types/Optional"
import { RecipeForm } from '@/types/RecipeForm'
import RecipeModel from '@/types/RecipeModel'
import { tryApiRequest } from "@/util/tryApiRequest"
import axios, { AxiosResponse } from 'axios'
import React, { ReactElement, useEffect, useState } from 'react'
import { Navigate, NavigateFunction, useNavigate, useParams } from 'react-router-dom'
import swal from 'sweetalert'

type EditRecipeProps = {
    recipes: EntityState<Array<RecipeModel>>
    days: EntityState<Array<DayModel>>
    setSidebar: SetSidebarAction
    setTopbar: SetTopbarAction
}

export const EditRecipe = ({ recipes, days, setSidebar, setTopbar }: EditRecipeProps): ReactElement => {
    const { id }: { id?: string } = useParams()
    const navigate: NavigateFunction = useNavigate()

    const [file, setFile] = useState<File | null>(null)
    const [state, setState] = useState<PageState>(PageState.LOADING)
    const [responseId, setResponseId] = useState<number>(0)
    const [recipe, setRecipe] = useState<RecipeModel>({} as RecipeModel)
    const [recipeFormData, setRecipeFormData] = useState<RecipeForm>({
        title: '',
        portionSize: 1,
        ingredients: '',
        instructions: '',
    })
    const [imagePreviewUrl, setImagePreviewUrl] = useState<string>('')

    useEffect(() => {
        if (recipes.isLoading) {
            return
        }

        const queryResult: Array<RecipeModel> = recipes.data.filter(recipe => recipe.id.toString() == id)
        if (queryResult.length === 0) {
            navigate("/error/404")
        }

        const recipeResult: RecipeModel = queryResult[0]
        setRecipe(recipeResult)
        setRecipeFormData(prev => ({
            ...prev,
            title: recipeResult.title,
            portionSize: recipeResult.portionSize,
            ingredients: getIngredientsAsString(recipeResult.ingredients),
            instructions: getInstructionsAsString(recipeResult.instructions),
        }))
        setState(PageState.WAITING)
    }, [id, recipes.isLoading])

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

        const postResponse: boolean = await tryApiRequest("POST", `/api/recipes/${id}`, async (apiUrl) => {
            const response: AxiosResponse<RecipeModel> = await axios.post(apiUrl, recipe)
            recipeResponse = response.data
            return response
        })

        if (postResponse && recipeResponse !== undefined) {
            const imageUpload: ImageModel = await getImageModel(file, imagePreviewUrl.length === 0)
            await tryApiRequest("PATCH", `/api/recipes/${id}/image`, async (apiUrl) => {
                return await axios.patch(apiUrl, imageUpload)
            })

            recipes.load()
            days.load()
            setResponseId(recipeResponse.id)
            setState(recipeResponse.id > 0 ? PageState.SUCCESS : PageState.ERROR)
        }
    }

    const deleteRecipe = async (id: number): Promise<void> => {
        const swalResponse = await swal({
            dangerMode: true,
            icon: 'error',
            title: 'Rezept endgültig löschen?',
            text: 'Gelöschte Rezepte können nicht wiederhergestellt werden.',
            buttons: ["Abbrechen", "Löschen"],
        })

        if (swalResponse) {
            await tryApiRequest("DELETE", `/api/recipes/${id}`, async (apiUrl) => {
                const response: AxiosResponse = await axios.delete(apiUrl)
                recipes.load()
                days.load()
                navigate("/recipes")
                return response
            })
        }
    }

    useEffect(() => {
        setSidebar('recipes')
        setTopbar({
            title: recipe?.title,
            showBackButton: true,
            backButtonPath: '/recipe/' + id,
            actionButtons: state === PageState.WAITING ? [
                { icon: 'delete', onClick: () => deleteRecipe(recipe?.id) }
            ] : [],
            truncate: true,
            style: 'max-w-[900px] pr-4',
            isLoading: recipes.isLoading,
        })

        window.scrollTo(0, 0)
    }, [recipe, state])

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
                                    value: recipeFormData.title,
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
                                    value: recipeFormData.portionSize,
                                }}
                            />

                            <Spacer height="6" />

                            <ImageUploadWidget
                                setFile={setFile}
                                imagePreviewUrl={imagePreviewUrl}
                                setImagePreviewUrl={setImagePreviewUrl}
                                recipe={recipe}
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
                                    value: recipeFormData.ingredients,
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
                                    value: recipeFormData.instructions,
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
