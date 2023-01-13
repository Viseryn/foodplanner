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
     * Load sidebar and scroll to top
     */
    useEffect(() => {
        props.setSidebarActiveItem('recipes');
        props.setSidebarActionButton();

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
     * Render
     */
    return (
        <div className="pb-[6.5rem] md:pb-0 w-full md:max-w-[900px]">
            {/* If the form is submitted, redirect to the new recipe */}
            {isSubmittedSuccessfully && !props.isLoadingRecipes &&
                <Navigate to={'/recipe/' + newId} />
            }

            {isLoading || props.isLoadingRecipes ? (
                <Spinner />
            ) : (
                <>
                    <div className="p-4 md:px-0 md:pt-9 mb-6">
                        <HeadingAndBackButton location="/recipes">Rezept hinzufügen</HeadingAndBackButton>
                    </div>

                    <form 
                        className="px-4 md:pl-0 grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-4 md:mb-6"
                        onSubmit={handleSubmit}
                    >
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

                        <div></div>

                        <div className="flex justify-end gap-4 mb-10 md:mb-0">
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
                </>
            )}
        </div>
    );
}
