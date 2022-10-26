/*********************************
 * ./assets/components/Recipe.js *
 *********************************/

import React, {Component} from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

import Spinner from './Util';
import Heading from './Heading';
import Button from './Buttons';

/**
 * Recipe
 * 
 * A Component for showing a Recipe. 
 * Collects the Recipe data from the Recipe Show API
 * in the /src/Controller/RecipeController.php.
 */
export class Recipe extends Component {
    /**
     * constructor
     * 
     * Sets initial state variables.
     * 
     * @param {*} props 
     */
    constructor(props) {
        super(props);
        this.state = {recipe: [], loading: true, isDeleted: false};
    }

    /**
     * componentDidMount
     * 
     * Loads Recipe on mount and updates sidebar.
     */
    componentDidMount() {
        const { id } = this.props.params; // Get id from route parameters
        this.getRecipe(id);

        this.props.updateSidebar('recipes');
        this.props.updateSAB(true, 'drive_file_rename_outline', '/recipe/' + id + '/edit');
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
     * render
     */
    render() {
        return (
            <>
                {this.state.loading ? (
                    <Spinner />
                ) : (
                    <div className="max-w-[900px]">
                        <Heading title={this.state.recipe.title} />

                        {this.state.recipe.image != null &&
                            <img 
                                className="rounded-3xl h-80 object-cover mb-10 shadow-md hover:shadow-xl transition duration-300 w-full" 
                                src={this.state.recipe.image.directory + this.state.recipe.image.filename}
                                alt={this.state.recipe}
                            />
                        }

                        {this.state.recipe.ingredients.length > 0 &&
                            <div className="mb-10">
                                <div className="bg-gray-100 font-bold px-6 py-3 mb-3 rounded-xl">
                                    Zutaten für 
                                    {this.state.recipe.portion_size == 1 
                                        ? ' eine Portion'
                                        : ' ' + this.state.recipe.portion_size + ' Portionen'
                                    }
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2">
                                    {this.state.recipe.ingredients.map(ingredient =>
                                        <div key={ingredient.id} className="px-6 pt-2">
                                            {(ingredient.quantity_value ?? '')
                                                + ' ' + (ingredient.quantity_unit ?? '')
                                                + ' ' + ingredient.name}
                                        </div>
                                    )}
                                </div>
                            </div>
                        }

                        {this.state.recipe.instructions.length > 0 &&
                            <div className="mb-10">
                                <div className="bg-gray-100 font-bold px-6 py-3 mb-5 rounded-xl">
                                    Zubereitung
                                </div>
                                <div className="space-y-2">
                                    {this.state.recipe.instructions.map((instruction, index) =>
                                        <div key={instruction.id} className="flex px-6">
                                            <span className="mr-2">{index + 1}.</span>
                                            {instruction.instruction}
                                        </div>
                                    )}
                                </div>
                            </div>
                        }

                        <div className="flex justify-end">
                            <div className="hidden lg:block lg:pt-6">
                                <Button 
                                    to={'/recipe/' + this.state.recipe.id + '/edit'}
                                    icon="drive_file_rename_outline"
                                    label="Bearbeiten"
                                    style="transparent"
                                />
                            </div>
                        </div>
                    </div>
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
    <Recipe
        {...props}
        params={useParams()}
    />
);