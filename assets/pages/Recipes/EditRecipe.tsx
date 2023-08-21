/*****************************************
 * ./assets/pages/Recipes/EditRecipe.tsx *
 *****************************************/

import axios, { AxiosResponse } from 'axios'
import React, { useEffect, useState } from 'react'
import { NavigateFunction, useNavigate, useParams } from 'react-router-dom'
import swal from 'sweetalert'

import InputRow from '@/components/form/Input/InputRow'
import SliderRow from '@/components/form/Slider/SliderRow'
import SwitchRow from '@/components/form/Switch/SwitchRow'
import TextareaRow from '@/components/form/Textarea/TextareaRow'
import Button from '@/components/ui/Buttons/Button'
import FileSelectButton from '@/components/ui/Buttons/FileSelectButton'
import Card from '@/components/ui/Card'
import Spacer from '@/components/ui/Spacer'
import Spinner from '@/components/ui/Spinner'
import DayModel from '@/types/DayModel'
import IngredientModel from '@/types/IngredientModel'
import InstructionModel from '@/types/InstructionModel'
import RecipeModel from '@/types/RecipeModel'
import getFullIngredientName from '@/util/getFullIngredientName'

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
}): JSX.Element {
    // Type for route parameters
    type EditRecipeRouteParams = {
        id?: string
    }

    // The id parameter of the route '/recipe/:id/edit'.
    const { id }: EditRecipeRouteParams = useParams()

    // A function that can change location. Needed for the edit topbar action button.
    const navigate: NavigateFunction = useNavigate()

    // The currently selected recipe. Will be updated whenever id changes.
    const [recipe, setRecipe] = useState<RecipeModel>({} as RecipeModel)

    // The name of the selected file. When no file is selected, show a placeholder text.
    const [filename, setFilename] = useState<string>('Datei auswählen')

    // Whether the page is loading. Will be true while the form data is processed by the API.
    const [isLoading, setLoading] = useState<boolean>(false)

    // Whether the file upload button is enabled. Can be toggled by a Switch component.
    const [isFileUploadButtonEnabled, setFileUploadButtonEnabled] = useState<boolean>(true)

    // The ID of the new recipe. Will be provided be the API and can be used for redirecting.
    const [responseId, setResponseId] = useState<number>(0)

    // Initializes the recipe state variable. Each time the id parameter changes, the recipe state 
    // is updated. When the recipes are reloaded, recipe is also updated.
    useEffect(() => {
        if (recipes.isLoading) {
            return
        }

        // Find correct recipe
        const queryResult: Array<RecipeModel> = recipes.data.filter(recipe => recipe.id.toString() == id)
        setRecipe(queryResult[0])

        // If recipe does not exist, redirect to 404 page
        if (queryResult.length === 0) {
            navigate('/error/404')
        }
    }, [id, recipes.isLoading])

    /**
     * Given an array of Ingredients, e.g. as ingredients property of a Recipe from the Recipe API, 
     * returns a string of the format "quantityValue quantityUnit ingredientName". If one or more of 
     * those three are empty, the whitespaces are not added accordingly. Ingredients are separated 
     * by a linebreak. The return value can be for example used as defaultValue for a textarea field.
     * 
     * @param arr An array of ingredients, e.g. received from the Recipe API.
     * @returns A list of all ingredients, separated by linebreaks.
     */
    const getIngredients = (arr: Array<IngredientModel>): string => {
        let ingredients: string = ''
        let l: number = arr?.length

        arr?.map((ingredient, i) => {
            ingredients += getFullIngredientName(ingredient)

            if (l != i + 1) { 
                ingredients += "\r\n"
            }
        })

        return ingredients
    }

    /**
     * Given an array of Instructions, e.g. as instructions property of a Recipe from the Recipe API, 
     * returns a string of the instructions separated by a linebreak. The return value can be for 
     * example used as defaultValue for a textarea field.
     * 
     * @param arr An array of instructions, e.g. received from the Recipe API.
     * @returns A list of all instructions, separated by linebreaks.
     */
    const getInstructions = (arr: Array<InstructionModel>): string => {
        let instructions: string = ''
        let l: number = arr?.length

        arr?.map((instruction, i) => {
            if (l == i + 1) { 
                instructions += instruction.instruction
            } else {
                instructions += instruction.instruction + "\r\n\r\n"
            }
        })

        return instructions
    }

    /**
     * Changes the label of the upload button to the selected picture (or to the default text).
     * 
     * @param event
     */
    const handleFilePick = (event: React.ChangeEvent<HTMLInputElement>): void => {
        const value = event.target.value
        setFilename((value != '') ? value : 'Datei auswählen')
    }

    /**
     * Changes the visibility of the upload button when the toggle switch is changed.
     */
    const handleFileRemove = (): void => {
        setFileUploadButtonEnabled(isFileUploadButtonEnabled => {
            return !isFileUploadButtonEnabled
        })
    }

    /**
     * Submits the form data to the Recipe Edit API. Sets the ID of the response to the state 
     * variable so that the component can redirect there after submitting.
     * 
     * @param event A form submit event.
     */
    const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
        event.preventDefault()
        const formData = new FormData(event.currentTarget)

        setLoading(true)

        axios
            .post('/api/recipes/'+ recipe?.id, formData)
            .then((response: AxiosResponse<RecipeModel, any>) => {
                // Reload recipes and get id
                recipes.load()
                setResponseId(response.data.id)

                // Update Day entities that may have
                // Meals with that recipe
                days.load()

                // End loading screen
                setLoading(false)
            })
    }

    // Redirect to the new recipe after it has properly loaded.
    useEffect(() => {
        if (responseId > 0) {
            navigate('/recipe/' + responseId)
        }
    }, [responseId])

    /**
     * When called, opens a SweetAlert. If it is confirmed, then the Recipe Delete API is called 
     * and the user gets redirected to the index page. If cancelled, nothing happens.
     * 
     * @param id The id of the recipe that should be deleted.
     */
    const deleteRecipe = (id: number): void => {
        swal({
            dangerMode: true,
            icon: 'error',
            title: 'Rezept endgültig löschen?',
            text: 'Gelöschte Rezepte können nicht wiederhergestellt werden.',
            buttons: {
                cancel: { text: 'Abbrechen' },
                confirm: { text: 'Löschen' },
            },
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

    // Render EditRecipe
    return <div className="pb-24 md:pb-4 md:max-w-[900px]">
        <Spacer height="6" />

        {recipes.isLoading || isLoading ? (
            <>
                <Spinner />
            </>
        ) : (
            <div className="mx-4 md:ml-0">
                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Card>
                            <InputRow
                                id="recipe_title"
                                label="Titel"
                                {...{
                                    required: 'required', 
                                    maxLength: 255,
                                    defaultValue: recipe?.title
                                }}
                            />

                            <Spacer height="6" />

                            <SliderRow
                                key={recipe?.id}
                                id="recipe_portionSize"
                                label="Wie viele Portionen?"
                                {...{
                                    min: 1,
                                    max: 10,
                                    step: 1,
                                    marks: [...Array(10)].map((value, index) => ({
                                        value: index + 1,
                                        label: index + 1,
                                    })),
                                    defaultValue: recipe.portionSize
                                }}
                            />

                            <Spacer height="6" />

                            <div className="">
                                <div className="text-sm font-semibold block mb-2">Aktuelles Bild</div>
                                {recipe.image != null 
                                    ? <>
                                        {isFileUploadButtonEnabled
                                            ? <img 
                                                className="rounded-3xl h-[248px] max-h-[248px] w-full object-cover transition duration-300" 
                                                src={recipe.image.directory + recipe.image.filename}
                                                alt={recipe.title}
                                            />
                                            : <img 
                                                className="rounded-3xl h-[248px] max-h-[248px] w-full object-cover transition duration-300 opacity-25" 
                                                src={recipe.image.directory + recipe.image.filename}
                                                alt={recipe.title}
                                            />
                                        }
                                    </>
                                    : <img 
                                        className="rounded-3xl h-[248px] max-h-[248px] w-full object-cover transition duration-300 opacity-10 dark:opacity-100 dark:brightness-50" 
                                        src="/img/default.jpg"
                                        alt={recipe.title}
                                    />
                                }
                            </div>

                            <Spacer height="6" />

                            <div className="text-sm font-semibold block mb-2">Bild bearbeiten</div>

                            <div className="flex justify-between items-center gap-4 h-12">
                                <div className="overflow-hidden w-full">
                                    <FileSelectButton
                                        id="recipe_image"
                                        label={filename}
                                        onChange={handleFilePick}
                                        enabled={isFileUploadButtonEnabled}
                                    />
                                </div>

                                {recipe?.image != null &&<>
                                    <SwitchRow
                                        id="recipe_image_remove"
                                        label="Entfernen"
                                        {...{
                                            name: "recipe[image_remove]",
                                            onChange: handleFileRemove,
                                        }}
                                    /></>
                                }
                            </div>
                        </Card>

                        <Card>
                            <TextareaRow
                                id="recipe_ingredients"
                                label="Zutaten"
                                {...{
                                    rows: 10, 
                                    placeholder: "250 ml Gemüsebrühe\n1/2 Tube Tomatenmark\n10 g Salz",
                                    defaultValue: getIngredients(recipe.ingredients)
                                }}
                            />

                            <Spacer height="6" />

                            <TextareaRow 
                                id="recipe_instructions"
                                label="Zubereitung"
                                {...{
                                    rows: 10,
                                    placeholder: "Schreibe jeden Schritt in eine eigene Zeile.",
                                    defaultValue: getInstructions(recipe.instructions)
                                }}
                            />
                        </Card>
                    </div>

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
}
