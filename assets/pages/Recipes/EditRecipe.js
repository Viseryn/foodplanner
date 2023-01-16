/****************************************
 * ./assets/pages/Recipes/EditRecipe.js *
 ****************************************/
    
import React, { useEffect, useState } from 'react'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'

import FilePicker       from '../../components/form/FilePicker'
import { InputRow }     from '../../components/form/Input'
import { SliderRow }    from '../../components/form/Slider'
import Switch           from '../../components/form/Switch'
import { TextareaRow }  from '../../components/form/Textarea'
import Button           from '../../components/ui/Buttons/Button'
import Card             from '../../components/ui/Card'
import Spacer           from '../../components/ui/Spacer'
import Spinner          from '../../components/ui/Spinner'

/**
 * EditRecipe
 * 
 * A component that renders a form for editing
 * an existing recipe. After submitting via the 
 * submit button, the recipe will be updated by
 * an API and the user gets redirected to its 
 * detail page.
 * 
 * @component
 * @param {object} props
 * @param {function} props.setSidebar
 * @param {function} props.setTopbar
 * @param {object} props.recipes
 * @param {object} props.days
 */
export default function EditRecipe({ recipes, days, ...props }) {
    /**
     * The id parameter of the route '/recipe/:id/edit'.
     * 
     * @property {string} id
     */
    const { id } = useParams()

    /**
     * A function that can change location.
     * Needed for the edit topbar action button.
     * 
     * @type {NavigateFunction}
     */
    const navigate = useNavigate()

    /**
     * The currently selected recipe.
     * Will be updated whenever id changes.
     * 
     * @type {[object, function]}
     */
    const [recipe, setRecipe] = useState({})

    /**
     * The name of the selected file.
     * When no file is selected, show a placeholder text.
     * 
     * @type {[string, function]}
     */
    const [filename, setFilename] = useState('Datei auswählen')

    /**
     * Whether the page is loading. Will be 
     * true while the form data is processed
     * by the API.
     * 
     * @type {[boolean, function]}
     */
    const [isLoading, setLoading] = useState(false)

    /**
     * Whether the file upload button is enabled.
     * Can be toggled by a Switch component.
     */
    const [isFileUploadButtonEnabled, setFileUploadButtonEnabled] = useState(true)

    /**
     * The ID of the new recipe. Will be 
     * provided be the API and can be used
     * for redirecting.
     * 
     * @type {[number, function]}
     */
    const [responseId, setResponseId] = useState(0)

    /**
     * Initializes the recipe state variable.
     * Each time the id parameter changes, the 
     * recipe state is updated. When the recipes 
     * are reloaded, recipe is also updated.
     */
    useEffect(() => {
        if (recipes.isLoading) {
            return
        }

        // Find correct recipe
        const queryResult = recipes.data?.filter(recipe => recipe?.id == id)
        setRecipe(queryResult[0])

        // If recipe does not exist, redirect to 404 page
        if (queryResult.length === 0) {
            navigate('/error/404')
        }
    }, [id, recipes.isLoading])

    /**
     * getIngredients
     * 
     * Given an array of Ingredients, e.g. as ingredients property 
     * of a Recipe from the Recipe API, returns a string of the format 
     * "quantityValue quantityUnit ingredientName". If one or more of 
     * those three are empty, the whitespaces are not added 
     * accordingly. Ingredients are separated by a linebreak.
     * The return value can be for example used as defaultValue for 
     * a textarea field.
     * 
     * @param {*} arr An array of ingredients, e.g. received from the Recipe API.
     * @returns string A list of all ingredients, separated by linebreaks.
     */
    const getIngredients = (arr) => {
        let ingredients = ''
        let l = arr?.length

        arr?.map((ingredient, i) => {
            let q = '' + (ingredient.quantity_value ?? '')

            if (q !== '' && ingredient?.quantity_unit !== '') {
                q += ' ' + (ingredient.quantity_unit ?? '')
            } else if (ingredient?.quantity_unit !== '') {
                q += (ingredient.quantity_unit ?? '')
            }

            if (q !== '') {
                ingredients += q + ' '
            }

            ingredients += '' + ingredient.name

            if (l != i + 1) { // NOT WORKING
                ingredients += "\r\n"
            }
        })

        return ingredients
    }

    /**
     * getInstructions
     * 
     * Given an array of Instructions, e.g. as instructions property 
     * of a Recipe from the Recipe API, returns a string of the 
     * instructions separated by a linebreak.
     * The return value can be for example used as defaultValue for 
     * a textarea field.
     * 
     * @param {*} arr An array of instructions, e.g. received from the Recipe API.
     * @returns string A list of all instructions, separated by linebreaks.
     */
    const getInstructions = (arr) => {
        let instructions = ''
        let l = arr?.length

        arr?.map((instruction, i) => {
            if (l == i + 1) { 
                instructions += instruction.instruction
            } else {
                instructions += instruction.instruction + "\r\n\r\n"
            }
        })

        return instructions;
    };

    /**
     * handleFilePick
     * 
     * Changes the label of the upload button to the selected 
     * picture (or to the default text).
     * 
     * @param {*} event
     */
    const handleFilePick = (event) => {
        const value = event.target.value

        setFilename((value != '') ? value : 'Datei auswählen')
    }

    /**
     * handleFileRemove
     * 
     * Changes the visibility of the upload button when 
     * the toggle switch is changed.
     */
    const handleFileRemove = () => {
        setFileUploadButtonEnabled(isFileUploadButtonEnabled => {
            return !isFileUploadButtonEnabled
        })
    }

    /**
     * handleSubmit
     * 
     * Submits the form data to the Recipe Edit API.
     * Sets the ID of the response to the state
     * variable so that the component can redirect 
     * there after submitting.
     * 
     * @param {*} event
     */
    const handleSubmit = (event) => {
        const formData = new FormData(event.target)
        event.preventDefault()

        setLoading(true)

        axios
            .post('/api/recipes/edit/'+ recipe?.id, formData)
            .then(response => {
                // Reload recipes and get id
                recipes.setLoading(true)
                setResponseId(response.data.id)

                // Update Day entities that may have
                // Meals with that recipe
                days.setLoading(true)
                
                // Refresh Data Timestamp
                axios.get('/api/refresh-data-timestamp/set')

                // End loading screen
                setLoading(false)
            })
    }

    /**
     * Redirect to the new recipe after 
     * it has properly loaded.
     */
    useEffect(() => {
        if (responseId > 0) {
            navigate('/recipe/' + responseId)
        }
    }, [responseId])

    /**
     * deleteRecipe
     * 
     * When called, opens a SweetAlert. If it is confirmed,
     * then the Recipe Delete API is called and the user 
     * gets redirected to the index page. If cancelled, 
     * nothing happens.
     * 
     * @param {number} id The id of the recipe that should be deleted.
     */
    const deleteRecipe = (id) => {
        swal({
            dangerMode: true,
            icon: 'error',
            title: 'Rezept endgültig löschen?',
            text: 'Gelöschte Rezepte können nicht wiederhergestellt werden.',
            buttons: {
                cancel: 'Abbrechen',
                confirm: 'Löschen',
            },
        }).then(confirm => {
            if (confirm) {
                axios
                    .get('/api/recipes/delete/' + id)
                    .then(() => {
                        recipes.setLoading(true)
                        days.setLoading(true)
                
                        // Refresh Data Timestamp
                        axios.get('/api/refresh-data-timestamp/set')

                        // Navigate to recipe list
                        navigate('/recipes')
                    })
            }
        })
    }

    /**
     * Load layout
     */
    useEffect(() => {
        // Load sidebar
        props.setSidebar('recipes')

        // Load topbar
        props.setTopbar({
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

    /**
     * Render EditRecipe
     */
    return (
        <div className="pb-24 md:pb-4 md:max-w-[900px]">
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
                                    inputProps={{
                                        required: 'required', 
                                        maxLength: 255,
                                        defaultValue: recipe?.title
                                    }}
                                    className=""
                                />

                                <Spacer height="6" />

                                <SliderRow
                                    key={recipe?.id}
                                    id="recipe_portionSize"
                                    label="Wie viele Portionen?"
                                    sliderProps={{
                                        min: 1,
                                        max: 10,
                                        step: 1,
                                        marks: [...Array(10)].map((value, index) => ({
                                            value: index + 1,
                                            label: index + 1,
                                        })),
                                        defaultValue: recipe?.portion_size
                                    }}
                                    className=""
                                />

                                <Spacer height="6" />

                                <div className="">
                                    <div className="text-sm font-semibold block mb-2">Aktuelles Bild</div>
                                    {recipe?.image != null 
                                        ? <>
                                            {isFileUploadButtonEnabled
                                                ? <img 
                                                    className="rounded-3xl h-[248px] max-h-[248px] w-full object-cover transition duration-300" 
                                                    src={recipe?.image.directory + recipe?.image.filename}
                                                    alt={recipe}
                                                />
                                                : <img 
                                                    className="rounded-3xl h-[248px] max-h-[248px] w-full object-cover transition duration-300 opacity-25" 
                                                    src={recipe?.image.directory + recipe?.image.filename}
                                                    alt={recipe}
                                                />
                                            }
                                        </>
                                        : <img 
                                            className="rounded-3xl h-[248px] max-h-[248px] w-full object-cover transition duration-300 opacity-10 dark:opacity-100 dark:brightness-50" 
                                            src="/img/default.jpg"
                                            alt={recipe}
                                        />
                                    }
                                </div>

                                <Spacer height="6" />

                                <div className="text-sm font-semibold block mb-2">Bild bearbeiten</div>

                                <div className="flex justify-between items-center gap-4 h-12">
                                    <div className="overflow-hidden w-full">
                                        <FilePicker
                                            id="recipe_image"
                                            label={filename}
                                            onChange={handleFilePick}
                                            enabled={isFileUploadButtonEnabled}
                                        />
                                    </div>

                                    {recipe?.image != null &&
                                        <label htmlFor="recipe_image_remove" className="inline-flex relative items-center cursor-pointer">
                                            <input type="checkbox" value="" id="recipe_image_remove" name="recipe[image_remove]" className="sr-only peer" onChange={handleFileRemove} />
                                            <Switch />
                                            <span className="ml-3 text-sm font-semibold">Entfernen</span>
                                        </label>
                                    }
                                </div>
                            </Card>

                            <Card>
                                <TextareaRow
                                    id="recipe_ingredients"
                                    label="Zutaten"
                                    textareaProps={{
                                        rows: 10, 
                                        placeholder: "250 ml Gemüsebrühe\n1/2 Tube Tomatenmark\n10 g Salz",
                                        defaultValue: getIngredients(recipe?.ingredients)
                                    }}
                                    className=""
                                />

                                <Spacer height="6" />

                                <TextareaRow 
                                    id="recipe_instructions"
                                    label="Zubereitung"
                                    textareaProps={{
                                        rows: 10,
                                        placeholder: "Schreibe jeden Schritt in eine eigene Zeile.",
                                        defaultValue: getInstructions(recipe?.instructions)
                                    }}
                                    className=""
                                />
                            </Card>
                        </div>

                        <div className="flex justify-end md:mt-4 pb-[5.5rem] md:pb-0">
                            <Button
                                type="submit"
                                icon="save" 
                                label="Speichern" 
                                elevated={true}
                                outlined={true}
                                floating={true}
                            />
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
}
