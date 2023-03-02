/****************************************
 * ./assets/pages/Recipes/AddRecipe.tsx *
 ****************************************/

import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { NavigateFunction, useNavigate } from 'react-router-dom'

import InputRow from '@/components/form/Input/InputRow'
import SliderRow from '@/components/form/Slider/SliderRow'
import TextareaRow from '@/components/form/Textarea/TextareaRow'
import Button from '@/components/ui/Buttons/Button'
import FileSelectButton from '@/components/ui/Buttons/FileSelectButton'
import Card from '@/components/ui/Card'
import Spacer from '@/components/ui/Spacer'
import Spinner from '@/components/ui/Spinner'
import RecipeModel from '@/types/RecipeModel'

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
}): JSX.Element {
    // The name of the selected file. When no file is selected, show a placeholder text.
    const [filename, setFilename] = useState<string>('Datei auswählen')

    // Whether the page is loading. Will be true while the form data is processed by the API.
    const [isLoading, setLoading] = useState<boolean>(false)

    // The ID of the new recipe. Will be provided be the API and can be used for redirecting.
    const [id, setId] = useState<number>(0)

    // A function that can change the location. Needed for the redirect after submit.
    const navigate: NavigateFunction = useNavigate()

    /**
     * Changes the label of the upload button to the selected picture (or to the default text).
     * 
     * @param event
     */
    const handleFilePick = (event: React.ChangeEvent<HTMLInputElement>): void => {
        const value: string = event.target.value
        setFilename((value != '') ? value : 'Datei auswählen')
    }

    /**
     * Submits the form data to the Recipe Add API. Sets the ID of the new recipe to the 
     * state variable id so that the component can redirect there after submitting.
     * 
     * @param event A submit form event.
     */
    const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
        event.preventDefault()
        const formData = new FormData(event.currentTarget)

        setLoading(true)

        axios
            .post('/api/recipes/add', formData)
            .then(response => {
                // Reload recipes and get id
                recipes.load()
                setId(response.data)

                // End loading screen
                setLoading(false)
            })
    }

    // Redirect to the new recipe after it has properly loaded.
    useEffect(() => {
        if (id > 0) {
            navigate('/recipe/' + id)
        }
    }, [id])

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
    
    // Render AddRecipe
    return <div className="pb-24 md:pb-4 md:max-w-[900px]">
        <Spacer height="6" />

        {isLoading || recipes.isLoading ? (
            <Spinner />
        ) : (
            <div className="mx-4 md:ml-0 ">
                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Card>
                            <InputRow
                                id="recipe_title"
                                label="Titel"
                                {...{
                                    required: true, 
                                    maxLength: 255,
                                }}
                            />

                            <Spacer height="6" />

                            <SliderRow
                                id="recipe_portionSize"
                                label="Wie viele Portionen?"
                                {...{
                                    min: 1,
                                    max: 10,
                                    step: 1,
                                    marks: [...Array(10)].map((value, index) => ({
                                        value: index + 1,
                                        label: index + 1,
                                    }))
                                }}
                            />

                            <Spacer height="6" />

                            <div>
                                <div className="text-sm font-semibold block mb-2">Bild hochladen</div>
                                <FileSelectButton
                                    id="recipe_image"
                                    label={filename}
                                    onChange={handleFilePick}
                                    enabled={true}
                                />
                            </div>
                        </Card>

                        <Card>
                            <TextareaRow
                                id="recipe_ingredients"
                                label="Zutaten"
                                {...{
                                    rows: 10, 
                                    placeholder: "250 ml Gemüsebrühe\n1/2 Tube Tomatenmark\n10 g Salz",
                                }}
                            />

                            <Spacer height="6" />

                            <TextareaRow
                                id="recipe_instructions"
                                label="Zubereitung"
                                {...{
                                    rows: 10,
                                    placeholder: "Schreibe jeden Schritt in eine eigene Zeile.",
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
