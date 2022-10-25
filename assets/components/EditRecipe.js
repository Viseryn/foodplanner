/*************************************
 * ./assets/components/EditRecipe.js *
 *************************************/
    
import React, {Component} from 'react';
import axios from 'axios';
import { Navigate, useParams } from 'react-router-dom';

import Heading from './Heading';
import InputRow, { SliderRow, TextareaRow } from './Forms';
import Button, { SubmitButton } from './Buttons';
import Spinner from './Util';

/**
 * EditRecipe
 * 
 * A Component for editing a Recipe. 
 * Shows a form with the initial data of a given Recipe
 * (via ID) which can be submitted to the Recipe Edit API
 * in the /src/Controller/RecipeController.php.
 */
export class EditRecipe extends Component {
    /**
     * constructor
     * 
     * Sets initial state variables.
     * 
     * @param {*} props 
     */
    constructor(props) {
        super(props);
        this.state = {
            filename: 'Datei auswählen',
            recipe: [],
            isSubmittedSuccessfully: false,
            loading: true,
            isDeleted: false,
            isUploadButtonVisible: true,
            newId: 0,
        };
    }

    /**
     * componentDidMount
     * 
     * Loads Recipe on mount and updates sidebar.
     * Scrolls to the top on load.
     */
    componentDidMount() {
        const { id } = this.props.params;
        this.getRecipe(id);

        this.props.updateSidebar('recipes');
        this.props.updateSAB(true, 'redo', '/recipe/' + id);

        window.scrollTo(0, 0);
    }

    /**
     * componentWillUnmount
     * 
     * Updates sidebar on unload.
     */
    componentWillUnmount() {
        this.props.updateSidebar();
        this.props.updateSAB();
    }

    /**
     * getRecipe
     * 
     * Calls the Recipe Show API and loads the Recipe
     * data into the state variable. Redirects to an 
     * Error 404 page if the Recipe does not exist.
     * 
     * @param {id} id 
     */
    getRecipe(id) {
        axios
        .get('/api/recipe/' + id)
        .then(
            recipe => {
                this.setState({ 
                    recipe: JSON.parse(recipe.data), 
                    loading: false
                })
            }
        )
        .catch((err) => {
            console.log(err);
            window.location = "/error/404";
        });
    }

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
    getIngredients(arr) {
        let ingredients = '';
        let l = arr?.length;

        arr.map((ingredient, i) => {
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
    getInstructions(arr) {
        let instructions = '';
        let l = arr?.length;

        arr.map((instruction, i) => {
            if (l == i + 1) { 
                instructions += instruction.instruction;
            } else {
                instructions += instruction.instruction + "\r\n\r\n";
            }
        });

        return instructions;
    }

    /**
     * handleFilePick
     * 
     * Changes the label of the upload button to the selected 
     * picture (or to the default text).
     * 
     * @param {*} event
     */
    handleFilePick = (event) => {
        const val = event.target.value;

        this.setState({
            filename: (val != '') ? val : 'Datei auswählen'
        });
    }

    /**
     * handleFileRemove
     * 
     * Changes the visibility of the upload button when 
     * the toggle switch is changed.
     * 
     * @param {*} event 
     */
    handleFileRemove = (event) => {
        this.setState({
            isUploadButtonVisible: !this.state.isUploadButtonVisible
        });
    }

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
    handleSubmit = (event) => {
        const formData = new FormData(event.target);
        event.preventDefault();

        axios.post('/api/recipe/' + this.state.recipe.id + '/edit', formData).then(
            response => {
                this.setState({
                    isSubmittedSuccessfully: true,
                    newId: response.data.id,
                }
            );
        });
    }

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
     deleteRecipe(id) {
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
                axios.get('/api/recipe/' + id + '/delete').then(() => {
                    this.setState({
                        isDeleted: true
                    })
                });
            }
        });
    }
    
    /**
     * render 
     */
    render() {
        const marks = [];
        for (let i = 1; i <= 10; i++) {
            marks.push({
                value: i, label: i
            });
        }

        return (
            <>
                {this.state.isSubmittedSuccessfully &&
                    <Navigate to={'/recipe/' + this.state.newId} />
                }

                {this.state.isDeleted &&
                    <Navigate to="/recipes" />
                }

                {this.state.loading ? (
                    <>
                        <Spinner />
                    </>
                ) : (
                    <>
                        <Heading title={this.state.recipe.title} />
                        <form 
                            className="max-w-[400px] md:max-w-[900px]"
                            onSubmit={this.handleSubmit}
                        >
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 gap-y-6 mb-6">
                                <div>
                                    <InputRow
                                        id="recipe_title"
                                        label="Titel"
                                        inputProps={{
                                            required: 'required', 
                                            maxLength: 255,
                                            defaultValue: this.state.recipe.title
                                        }}
                                    />

                                    <SliderRow
                                        id="recipe_portionSize"
                                        label="Wie viele Portionen?"
                                        sliderProps={{
                                            min: 1,
                                            max: 10,
                                            step: 1,
                                            marks: marks,
                                            defaultValue: this.state.recipe.portion_size
                                        }}
                                    />

                                    <div className="text-sm font-semibold block mb-2">Bild bearbeiten</div>

                                    <div className="flex justify-between items-center gap-4 h-12">
                                        <div className="overflow-hidden w-full">
                                            {this.state.isUploadButtonVisible &&
                                                <>
                                                    <label htmlFor="recipe_image" className="file-label cursor-pointer overflow-hidden rounded-full h-12 px-4 font-semibold text-md transition duration-300 flex items-center active:scale-95 text-blue-600 bg-gray-100 hover:bg-blue-200 active:bg-blue-300 active:text-blue-800">
                                                        <span className="label-icon material-symbols-rounded">photo_size_select_small</span>
                                                        <span className="label-content mr-2 ml-3">{this.state.filename}</span>
                                                    </label>
                                                    <input 
                                                        type="file" id="recipe_image" name="recipe[image]" 
                                                        className="file-input hidden" 
                                                        onChange={(e) =>this.handleFilePick(e)}
                                                    />
                                                </>
                                            }
                                        </div>

                                        {this.state.recipe.image != null &&
                                            <label htmlFor="recipe_image_remove" className="inline-flex relative items-center cursor-pointer">
                                                <input type="checkbox" value="" id="recipe_image_remove" name="recipe[image_remove]" className="sr-only peer" onChange={(e) => this.handleFileRemove(e)} />
                                                <div className="w-11 h-6 bg-gray-100 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all transition duration-300 peer-checked:bg-blue-600"></div>
                                                <span className="ml-3 text-sm text-gray-500 font-semibold">Entfernen</span>
                                            </label>
                                        }
                                    </div>
                                </div>

                                <div className="flex items-center">
                                    {this.state.recipe.image != null 
                                        ? <>
                                            {this.state.isUploadButtonVisible
                                                ? <img 
                                                    className="rounded-3xl max-h-64 w-full object-cover shadow-md transition duration-300" 
                                                    src={this.state.recipe.image.directory + this.state.recipe.image.filename}
                                                    alt={this.state.recipe}
                                                />
                                                : <img 
                                                    className="rounded-3xl max-h-64 w-full object-cover shadow-md transition duration-300 opacity-25" 
                                                    src={this.state.recipe.image.directory + this.state.recipe.image.filename}
                                                    alt={this.state.recipe}
                                                />
                                            }
                                        </>
                                        : <img 
                                            className="rounded-3xl h-full max-h-64 w-full object-cover shadow-md transition duration-300 opacity-10" 
                                            src="/img/default.jpg"
                                            alt={this.state.recipe}
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
                                        defaultValue: this.getIngredients(this.state.recipe.ingredients)
                                    }}
                                    className=""
                                />
                                <TextareaRow 
                                    id="recipe_instructions"
                                    label="Zubereitung"
                                    textareaProps={{
                                        rows: 10,
                                        placeholder: "Schreibe jeden Schritt in eine eigene Zeile.",
                                        defaultValue: this.getInstructions(this.state.recipe.instructions)
                                    }}
                                    className=""
                                />
                            </div>

                            <div className="flex justify-end gap-4">
                                <div className="hidden lg:block">
                                    <Button
                                        to={'/recipe/' + this.state.recipe.id}
                                        icon="redo"
                                        label="Zurück"
                                        style="transparent"
                                    />
                                </div>
                                <Button
                                    onClick={() => this.deleteRecipe(this.state.recipe.id)}
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
            </>
        )
    }
}

/**
 * When the component <Recipe /> is called, 
 * all params become usable as props.
 */
export default (props) => (
    <EditRecipe
        {...props}
        params={useParams()}
    />
);