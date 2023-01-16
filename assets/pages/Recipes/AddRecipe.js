/***************************************
 * ./assets/pages/Recipes/AddRecipe.js *
 ***************************************/

import React, { useEffect, useState }   from 'react'
import { useNavigate }                  from 'react-router-dom'
import axios                            from 'axios'

import { InputRow }                     from '../../components/form/Input'
import { SliderRow }                    from '../../components/form/Slider'
import { TextareaRow }                  from '../../components/form/Textarea'
import Button                           from '../../components/ui/Buttons/Button'
import Card                             from '../../components/ui/Card'
import Spacer                           from '../../components/ui/Spacer'
import Spinner                          from '../../components/ui/Spinner'

/**
 * AddRecipe
 * 
 * A component that renders a form for 
 * adding a Recipe. After submitting via 
 * the submit button, the recipe will be 
 * added by an API and the user gets 
 * forwarded to its detail page.
 * 
 * @component
 * @property {function} setSidebar
 * @property {function} setTopbar
 * @property {object} recipes
 */
export default function AddRecipe({ recipes, ...props }) {
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
     * The ID of the new recipe. Will be 
     * provided be the API and can be used
     * for redirecting.
     * 
     * @type {[number, function]}
     */
    const [id, setId] = useState(0)

    /**
     * A function that can change the location.
     * Needed for the redirect after submit.
     * 
     * @type {NavigateFunction}
     */
    const navigate = useNavigate()

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
     * handleSubmit
     * 
     * Submits the form data to the Recipe Add API.
     * Sets the ID of the new recipe to the state
     * variable id so that the component can redirect 
     * there after submitting.
     * 
     * @param {*} event
     */
    const handleSubmit = (event) => {
        const formData = new FormData(event.target)
        event.preventDefault()

        setLoading(true)

        axios
            .post('/api/recipes/add', formData)
            .then(response => {
                // Reload recipes and get id
                recipes.setLoading(true)
                setId(response.data.id)
                
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
        if (id > 0) {
            navigate('/recipe/' + id)
        }
    }, [id])

    /**
     * Load layout
     */
    useEffect(() => {
        // Load sidebar
        props.setSidebar('recipes')

        // Load topbar
        props.setTopbar({
            title: 'Neues Rezept',
            showBackButton: true,
            backButtonPath: '/recipes',
        })

        // Scroll to top
        window.scrollTo(0, 0)
    }, [])
    
    /**
     * Render AddRecipe
     */
    return (
        <div className="pb-24 md:pb-4 md:max-w-[900px]">
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
                                    inputProps={{required: 'required', maxLength: 255}}
                                    className=""
                                />

                                <Spacer height="6" />

                                <SliderRow
                                    id="recipe_portionSize"
                                    label="Wie viele Portionen?"
                                    sliderProps={{
                                        min: 1,
                                        max: 10,
                                        step: 1,
                                        marks: [...Array(10)].map((value, index) => ({
                                            value: index + 1,
                                            label: index + 1,
                                        }))
                                    }}
                                    className=""
                                />

                                <Spacer height="6" />

                                <div>
                                    <div className="text-sm font-semibold block mb-2">Bild hochladen</div>
                                    <label htmlFor="recipe_image" className="file-label cursor-pointer overflow-hidden rounded-full h-12 px-4 font-semibold text-md transition duration-300 flex items-center active:scale-95 text-primary-100 dark:text-primary-dark-100 bg-secondary-200 dark:bg-secondary-dark-200 hover:bg-secondary-300 dark:hover:bg-secondary-dark-300">
                                        <span className="label-icon material-symbols-rounded">photo_size_select_small</span>
                                        <span className="label-content mr-2 ml-3">{filename}</span>
                                    </label>
                                    <input 
                                        type="file" id="recipe_image" name="recipe[image]" 
                                        className="file-input hidden" 
                                        onChange={(e) => handleFilePick(e)}
                                    />
                                </div>
                            </Card>

                            <Card>
                                <TextareaRow
                                    id="recipe_ingredients"
                                    label="Zutaten"
                                    textareaProps={{
                                        rows: 10, 
                                        placeholder: "250 ml Gemüsebrühe\n1/2 Tube Tomatenmark\n10 g Salz"
                                    }}
                                    className=""
                                />

                                <Spacer height="6" />

                                <TextareaRow 
                                    id="recipe_instructions"
                                    label="Zubereitung"
                                    textareaProps={{
                                        rows: 10,
                                        placeholder: "Schreibe jeden Schritt in eine eigene Zeile."
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
    )
}
