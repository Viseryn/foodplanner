/*************************************
 * ./assets/components/EditRecipe.js *
 *************************************/
    
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Navigate, useParams } from 'react-router-dom';

import { InputRow } from '../../components/form/Input';
import { TextareaRow } from '../../components/form/Textarea';
import { SliderRow } from '../../components/form/Slider';
import Button, { SubmitButton } from '../../components/ui/Buttons';
import Heading from '../../components/ui/Heading';
import Spinner from '../../components/ui/Spinner';

/**
 * EditRecipe
 * 
 * A Component for editing a Recipe. 
 * Shows a form with the initial data of a given Recipe
 * (via ID) which can be submitted to the Recipe Edit API
 * in the /src/Controller/RecipeController.php.
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
export default function EditRecipe(props) {
    /**
     * State variables
     */
    const { id } = useParams();

    const [filename, setFilename] = useState('Datei auswählen');
    const [recipe, setRecipe] = useState([]);
    const [isSubmittedSuccessfully, setSubmittedSuccessfully] = useState(false);
    const [isLoading, setLoading] = useState(false);
    const [isDeleted, setDeleted] = useState(false);
    const [isUploadButtonVisible, setUploadButtonVisible] = useState(true);
    const [newId, setNewId] = useState(0);

    /**
     * Load sidebar and scroll to top
     */
    useEffect(() => {
        props.setSidebarActiveItem('recipes');
        props.setSidebarActionButton({
            visible: true, 
            icon: 'redo', 
            path: '/recipe/' + id, 
            label: 'Zurück',
        });

        window.scrollTo(0, 0);
    }, []);

    /**
     * When recipes are loaded, on each re-render, 
     * check if there is a recipe with the id parameter.
     * If yes, set the index of that recipe to the 
     * global state variable recipeIndex, which is 
     * passed to <EditRecipe />. If no, redirect to an
     * Error 404 page.
     */
    useEffect(() => {
        if (!props.isLoadingRecipes) {
            let returnVal;

            props.recipes.forEach((recipe, index) => {
                if (recipe.id == id) {
                    returnVal = index;
                }
            });

            if (returnVal >= 0) {
                props.setRecipeIndex(returnVal);
            } else if (id) {
                window.location = "/error/404";
            }
        }
    });

    /**
     * Put the selected recipe in a local state 
     * variable as an abbreviation.
     */
    useEffect(() => {
        setRecipe(props.recipes[props.recipeIndex]);
    });

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
        let ingredients = '';
        let l = arr?.length;

        arr?.map((ingredient, i) => {
            let q = '' + (ingredient.quantity_value ?? '');

            if (q !== '' && ingredient?.quantity_unit !== '') {
                q += ' ' + (ingredient.quantity_unit ?? '');
            } else if (ingredient?.quantity_unit !== '') {
                q += (ingredient.quantity_unit ?? '');
            }

            if (q !== '') {
                ingredients += q + ' ';
            }

            ingredients += '' + ingredient.name;

            if (l != i + 1) { // NOT WORKING
                ingredients += "\r\n";
            }
        });

        return ingredients;
    };

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
        let instructions = '';
        let l = arr?.length;

        arr?.map((instruction, i) => {
            if (l == i + 1) { 
                instructions += instruction.instruction;
            } else {
                instructions += instruction.instruction + "\r\n\r\n";
            }
        });

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
        const val = event.target.value;

        setFilename((val != '') ? val : 'Datei auswählen');
    };

    /**
     * handleFileRemove
     * 
     * Changes the visibility of the upload button when 
     * the toggle switch is changed.
     * 
     * @param {*} event 
     */
    const handleFileRemove = (event) => {
        setUploadButtonVisible(isUploadButtonVisible => {
            return !isUploadButtonVisible;
        })
    };

    /**
     * handleSubmit
     * 
     * Submits the form data to the Recipe Edit API.
     * Sets the ID response to the states
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
            .post('/api/recipe/' + recipe?.id + '/edit', formData)
            .then(response => {
                setSubmittedSuccessfully(true);
                setNewId(response.data.id);

                props.setLoadingRecipes(true);
            })
        ;
    };

    /**
     * deleteRecipe
     * 
     * When called, opens a SweetAlert. If it is confirmed,
     * then the Recipe Delete API is called and the user 
     * gets redirected to the index page. If cancelled, 
     * nothing happens.
     * 
     * @param {int} id 
     */
    const deleteRecipe = (id) => {
        swal({
            dangerMode: true,
            icon: 'error',
            title: 'Für immer löschen?',
            text: 'Gelöschte Inhalte können nicht wiederhergestellt werden.',
            buttons: {
                cancel: 'Abbrechen',
                confirm: 'Löschen',
            },
        }).then((confirm) => {
            if (confirm) {
                axios
                    .get('/api/recipe/' + id + '/delete')
                    .then(() => {
                        setDeleted(true);
                    })
                ;
            }
        });
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
            {isSubmittedSuccessfully &&
                <Navigate to={'/recipe/' + newId} />
            }

            {isDeleted &&
                <Navigate to="/recipes" />
            }

            {props.isLoadingRecipes || isLoading ? (
                <>
                    <Spinner />
                </>
            ) : (
                <>
                    <Heading>{recipe?.title}</Heading>
                    <form 
                        className="max-w-[400px] md:max-w-[900px]"
                        onSubmit={handleSubmit}
                    >
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 gap-y-6 mb-6">
                            <div>
                                <InputRow
                                    id="recipe_title"
                                    label="Titel"
                                    inputProps={{
                                        required: 'required', 
                                        maxLength: 255,
                                        defaultValue: recipe?.title
                                    }}
                                />

                                <SliderRow
                                    key={recipe?.id}
                                    id="recipe_portionSize"
                                    label="Wie viele Portionen?"
                                    sliderProps={{
                                        min: 1,
                                        max: 10,
                                        step: 1,
                                        marks: marks,
                                        defaultValue: recipe?.portion_size
                                    }}
                                />

                                <div className="text-sm font-semibold block mb-2">Bild bearbeiten</div>

                                <div className="flex justify-between items-center gap-4 h-12">
                                    <div className="overflow-hidden w-full">
                                        {isUploadButtonVisible 
                                            ? <>
                                                <label htmlFor="recipe_image" className="file-label cursor-pointer rounded-full h-12 px-4 font-semibold transition duration-300 flex items-center active:scale-95 text-blue-600 dark:text-blue-300 bg-gray-100 dark:bg-[#1D252C] hover:bg-blue-200 dark:hover:bg-[#1D252C]/[.6] active:bg-blue-300 active:text-blue-800">
                                                    <span className="label-icon material-symbols-rounded">photo_size_select_small</span>
                                                    <span className="label-content max-h-6 overflow-hidden mr-2 ml-3">{filename}</span>
                                                </label>
                                                <input 
                                                    type="file" id="recipe_image" name="recipe[image]" 
                                                    className="file-input hidden" 
                                                    onChange={handleFilePick}
                                                />
                                            </>
                                            : <>
                                                <label htmlFor="recipe_image" className="file-label rounded-full h-12 px-4 font-semibold transition duration-300 flex items-center text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-[#1D252C]">
                                                    <span className="label-icon material-symbols-rounded">photo_size_select_small</span>
                                                    <span className="label-content max-h-6 overflow-hidden mr-2 ml-3">Datei auswählen</span>
                                                </label>
                                                <input 
                                                    disabled="disabled"
                                                    type="file" id="recipe_image" name="recipe[image]" 
                                                    className="file-input hidden" 
                                                    onChange={handleFilePick}
                                                />
                                            </>
                                        }
                                    </div>

                                    {recipe?.image != null &&
                                        <label htmlFor="recipe_image_remove" className="inline-flex relative items-center cursor-pointer">
                                            <input type="checkbox" value="" id="recipe_image_remove" name="recipe[image_remove]" className="sr-only peer" onChange={handleFileRemove} />
                                            <div className="w-11 h-6 bg-gray-100 dark:bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all transition duration-300 dark:border-gray-600 peer-checked:bg-blue-600"></div>
                                            <span className="ml-3 text-sm text-gray-500 dark:text-gray-200 font-semibold">Entfernen</span>
                                        </label>
                                    }
                                </div>
                            </div>

                            <div className="">
                                <div className="text-sm font-semibold block mb-2">Aktuelles Bild</div>
                                {recipe?.image != null 
                                    ? <>
                                        {isUploadButtonVisible
                                            ? <img 
                                                className="rounded-3xl h-[248px] max-h-[248px] w-full object-cover shadow-md transition duration-300" 
                                                src={recipe?.image.directory + recipe?.image.filename}
                                                alt={recipe}
                                            />
                                            : <img 
                                                className="rounded-3xl h-[248px] max-h-[248px] w-full object-cover shadow-md transition duration-300 opacity-25" 
                                                src={recipe?.image.directory + recipe?.image.filename}
                                                alt={recipe}
                                            />
                                        }
                                    </>
                                    : <img 
                                        className="rounded-3xl h-[248px] max-h-[248px] w-full object-cover shadow-md transition duration-300 opacity-10 dark:opacity-100 dark:brightness-50" 
                                        src="/img/default.jpg"
                                        alt={recipe}
                                    />
                                }
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 gap-y-6 mb-6">
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
                        </div>

                        <div className="flex justify-end gap-4">
                            <div className="hidden md:block">
                                <Button
                                    to={'/recipe/' + recipe?.id}
                                    icon="redo"
                                    label="Zurück"
                                    style="transparent"
                                />
                            </div>
                            <Button
                                onClick={() => deleteRecipe(recipe?.id)}
                                icon="delete"
                                label="Löschen"
                                style="inverse"
                            />
                            <SubmitButton 
                                icon="update" 
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
