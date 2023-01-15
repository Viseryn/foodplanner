/*************************************
 * ./assets/components/EditRecipe.js *
 *************************************/
    
import React, { useEffect, useState } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import axios from 'axios';

import { InputRow }     from '../../components/form/Input';
import { SliderRow }    from '../../components/form/Slider';
import Switch           from '../../components/form/Switch';
import { TextareaRow }  from '../../components/form/Textarea';
import Button           from '../../components/ui/Buttons/Button';
import Card             from '../../components/ui/Card';
import Spacer           from '../../components/ui/Spacer';
import Spinner          from '../../components/ui/Spinner';

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
 * @property {boolean} isLoadingRecipes
 * @property {function} setLoadingRecipes
 * @property {number} recipeIndex
 * @property {function} setRecipeIndex
 * @property {function} setLoadingDays
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
            .post('/api/recipes/edit/'+ recipe?.id, formData)
            .then(response => {
                setSubmittedSuccessfully(true);
                setNewId(response.data.id);

                props.setLoadingRecipes(true);
                props.setLoadingDays(true);
                
                // Refresh Data Timestamp
                axios.get('/api/refresh-data-timestamp/set')
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
            title: 'Rezept endgültig löschen?',
            text: 'Gelöschte Rezepte können nicht wiederhergestellt werden.',
            buttons: {
                cancel: 'Abbrechen',
                confirm: 'Löschen',
            },
        }).then((confirm) => {
            if (confirm) {
                axios
                    .get('/api/recipes/delete/' + id)
                    .then(() => {
                        setDeleted(true);
                        props.setLoadingRecipes(true);
                        props.setLoadingDays(true);
                
                        // Refresh Data Timestamp
                        axios.get('/api/refresh-data-timestamp/set')
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
     * Load layout
     */
    useEffect(() => {
        // Load sidebar
        props.setSidebarActiveItem('recipes')
        props.setSidebarActionButton()

        // Load Topbar
        props.setTopbar({
            title: recipe?.title,
            showBackButton: true,
            backButtonPath: '/recipe/' + recipe?.id,
            actionButtons: [
                { icon: 'delete', onClick: () => deleteRecipe(recipe?.id) }
            ],
            truncate: true,
            style: 'max-w-[900px] pr-4',
        })

        // Scroll to top
        window.scrollTo(0, 0)
    }, [recipe])

    /**
     * Render
     */
    return (
        <div className="pb-24 md:pb-4 w-full md:max-w-[900px]">
            <Spacer height="6" />

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
                                        marks: marks,
                                        defaultValue: recipe?.portion_size
                                    }}
                                    className=""
                                />

                                <Spacer height="6" />

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

                                <Spacer height="6" />

                                <div className="text-sm font-semibold block mb-2">Bild bearbeiten</div>

                                <div className="flex justify-between items-center gap-4 h-12">
                                    <div className="overflow-hidden w-full">
                                        {isUploadButtonVisible 
                                            ? <>
                                                <label htmlFor="recipe_image" className="file-label cursor-pointer overflow-hidden rounded-full h-12 px-4 font-semibold text-md transition duration-300 flex items-center active:scale-95 text-primary-100 dark:text-primary-dark-100 bg-secondary-200 dark:bg-secondary-dark-200 hover:bg-secondary-300 dark:hover:bg-secondary-dark-300">
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
                                                <label htmlFor="recipe_image" className="file-label rounded-full h-12 px-4 font-semibold transition duration-300 flex items-center text-[#43483e] dark:text-[#c3c8bb] bg-[#e0e4d6] dark:bg-[#43483e]">
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
