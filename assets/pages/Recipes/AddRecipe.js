/************************************
 * ./assets/components/AddRecipe.js *
 ************************************/

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Navigate } from 'react-router-dom';

import { InputRow } from '../../components/form/Input';
import { TextareaRow } from '../../components/form/Textarea';
import { SliderRow } from '../../components/form/Slider';
import Button, { SubmitButton } from '../../components/ui/Buttons';
import Heading from '../../components/ui/Heading';
import Spinner from '../../components/ui/Spinner';

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
 * @property {arr} recipes 
 * @property {function} setRecipes
 * @property {boolean} isLoadingRecipes
 * @property {function} setLoadingRecipes
 * @property {number} recipeIndex
 * @property {function} setRecipeIndex
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
     * Load sidebar and scroll to top
     */
    useEffect(() => {
        props.setSidebarActiveItem('recipes');
        props.setSidebarActionButton({
            visible: true, 
            icon: 'redo', 
            path: '/recipes', 
            label: 'Zurück',
        });

        window.scrollTo(0, 0)
    }, []);

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
     * 
     * @todo If the submit was performed too fast, the navigate will return 404.
     */
    const handleSubmit = (event) => {
        const formData = new FormData(event.target);
        event.preventDefault();

        setLoading(true);

        axios
            .post('/api/recipe/add', formData)
            .then(response => {
                setLoading(false);
                setSubmittedSuccessfully(true);
                props.setLoadingRecipes(true);
                setNewId(response.data.id);
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
     * Render
     */
    return (
        <div className="px-6 pb-24 pt-6 md:pb-6 md:my-6 md:mr-6 w-full min-h-screen md:min-h-fit bg-white dark:bg-[#29353f] md:rounded-3xl md:max-w-[900px]">
            {/* If the form is submitted, redirect to the new recipe */}
            {isSubmittedSuccessfully && !props.isLoadingRecipes &&
                <Navigate to={'/recipe/' + newId} />
            }

            {isLoading || props.isLoadingRecipes ? (
                <Spinner />
            ) : (
                <>
                    <Heading>Rezept hinzufügen</Heading>
                    <form 
                        className="max-w-[400px] md:max-w-[900px]"
                        onSubmit={handleSubmit}
                    >
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 gap-y-6 mb-6">
                            <div>
                                <InputRow
                                    id="recipe_title"
                                    label="Titel"
                                    inputProps={{required: 'required', maxLength: 255}}
                                    className=""
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 gap-y-6 mb-6">
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

                            <div>
                                <div className="text-sm font-semibold block mb-2">Bild hochladen</div>
                                <label htmlFor="recipe_image" className="file-label cursor-pointer overflow-hidden rounded-full h-12 px-4 font-semibold text-md transition duration-300 flex items-center active:scale-95 text-blue-600 dark:text-blue-300 bg-gray-100 dark:bg-[#1D252C] hover:bg-blue-200 dark:hover:bg-[#1D252C]/[.6] active:bg-blue-300 active:text-blue-800">
                                    <span className="label-icon material-symbols-rounded">photo_size_select_small</span>
                                    <span className="label-content mr-2 ml-3">{filename}</span>
                                </label>
                                <input 
                                    type="file" id="recipe_image" name="recipe[image]" 
                                    className="file-input hidden" 
                                    onChange={(e) => handleFilePick(e)}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 gap-y-6 mb-6">
                            <TextareaRow
                                id="recipe_ingredients"
                                label="Zutaten"
                                textareaProps={{
                                    rows: 10, 
                                    placeholder: "250 ml Gemüsebrühe\n1/2 Tube Tomatenmark\n10 g Salz"
                                }}
                                className=""
                            />
                            <TextareaRow 
                                id="recipe_instructions"
                                label="Zubereitung"
                                textareaProps={{
                                    rows: 10,
                                    placeholder: "Schreibe jeden Schritt in eine eigene Zeile."
                                }}
                                className=""
                            />
                        </div>

                        <div className="flex justify-end gap-4">
                            <div className="hidden md:block">
                                <Button
                                    to="/recipes"
                                    icon="redo"
                                    label="Zurück"
                                    style="transparent"
                                />
                            </div>
                            <SubmitButton 
                                icon="add" 
                                label="Speichern" 
                                elevated={true}
                            />
                        </div>
                    </form>
                </>
            )}
        </div>
    );
}
