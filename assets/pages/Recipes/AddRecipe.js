/************************************
 * ./assets/components/AddRecipe.js *
 ************************************/

import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import axios from 'axios';

import { InputRow }     from '../../components/form/Input';
import { SliderRow }    from '../../components/form/Slider';
import { TextareaRow }  from '../../components/form/Textarea';
import Button           from '../../components/ui/Buttons/Button';
import Card             from '../../components/ui/Card';
import Spacer           from '../../components/ui/Spacer';
import Spinner          from '../../components/ui/Spinner';

/**
 * AddRecipe
 * 
 * A Component for adding a Recipe. 
 * Shows a form with which can be submitted to 
 * the Recipe Add API in the 
 * /src/Controller/RecipeController.php.
 * 
 * @component
 * @property {function} setSidebarActiveItem
 * @property {function} setSidebarActionButton
 * @property {boolean} isLoadingRecipes
 * @property {function} setLoadingRecipes
 */
export default function AddRecipe(props) {
    /**
     * State variables
     */
    const [filename, setFilename] = useState('Datei auswählen');
    const [isSubmittedSuccessfully, setSubmittedSuccessfully] = useState(false);
    const [isLoading, setLoading] = useState(false);
    const [newId, setNewId] = useState(0);

    /**
     * handleFilePick
     * 
     * Changes the label of the upload button to the selected 
     * picture (or to the default text).
     * 
     * @param {*} event
     */
    const handleFilePick = (event) => {
        const val = event.target.value;

        setFilename((val != '') ? val : 'Datei auswählen');
    };

    /**
     * handleSubmit
     * 
     * Submits the form data to the Recipe Add API.
     * Sets the ID of the new recipe to the states
     * variables so that the Component can redirect 
     * there after submitting.
     * 
     * @param {*} event
     */
    const handleSubmit = (event) => {
        const formData = new FormData(event.target);
        event.preventDefault();

        setLoading(true);

        axios
            .post('/api/recipes/add', formData)
            .then(response => {
                setLoading(false);
                setSubmittedSuccessfully(true);
                props.setLoadingRecipes(true);
                setNewId(response.data.id);
                
                // Refresh Data Timestamp
                axios.get('/api/refresh-data-timestamp/set')
            })
        ;
    };

    /**
     * Create an array for the slider marks from 1 to 10
     */
    const marks = [];

    for (let i = 1; i <= 10; i++) {
        marks.push({
            value: i, label: i
        });
    }

    /**
     * Load layout
     */
    useEffect(() => {
        // Load sidebar
        props.setSidebarActiveItem('recipes')
        props.setSidebarActionButton()

        // Load Topbar
        props.setTopbar({
            title: 'Neues Rezept',
            showBackButton: true,
            backButtonPath: '/recipes',
        })

        // Scroll to top
        window.scrollTo(0, 0)
    }, [])
    
    /**
     * Render
     */
    return (
        <div className="pb-24 md:pb-4 w-full md:max-w-[900px]">
            <Spacer height="6" />

            {/* If the form is submitted, redirect to the new recipe */}
            {isSubmittedSuccessfully && !props.isLoadingRecipes &&
                <Navigate to={'/recipe/' + newId} />
            }

            {isLoading || props.isLoadingRecipes ? (
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
                                        marks: marks
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
    );
}
