/**********************************
 * ./assets/components/Recipes.js *
 **********************************/

import React, {Component} from 'react';
import axios from 'axios';
import {Link} from 'react-router-dom';

import Spinner from './Util';
import Heading from './Heading';
import Button from './Buttons';

/**
 * Recipes
 * 
 * A Component for showing a list of all Recipes.
 * Collects the Recipe data from the Recipe List API
 * in the /src/Controller/RecipeController.php.
 */
export default class Recipes extends Component {
    /**
     * constructor
     * 
     * Sets initial state variables.
     * 
     * @param {*} props 
     */
    constructor(props) {
        super(props);
        this.state = {recipes: [], loading: true};
    }

    /**
     * componentDidMount
     * 
     * Loads Recipes on mount and updates sidebar.
     */
    componentDidMount() {
        this.props.setSidebarActiveItem('recipes');
        this.props.setSidebarActionButton({
            visible: true, 
            icon: 'add', 
            path: '/recipe/add', 
            label: 'Neues Rezept',
        });

        this.getRecipes();
    }

    /**
     * getRecipe
     * 
     * Calls the Recipe List API and loads the Recipe
     * data into the state variable.
     */
    getRecipes() {
        axios.get('/api/recipes').then(
            recipes => {
                this.setState({ 
                    recipes: JSON.parse(recipes.data), 
                    loading: false
                })
            }
        );
    }

    /**
     * render
     */
    render() {
        return (
            <div>
                <Heading title="Rezepte" />
                {
                    this.state.loading ? (
                        <Spinner />
                    ) : (
                        <>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-10">
                                {this.state.recipes.map(recipe => 
                                    <div 
                                        key={recipe.id}
                                        className="h-40 w-full shadow-md rounded-2xl border border-gray-200 transition duration-300 hover:scale-95 hover:shadow-lg hover:bg-gray-50"
                                    >
                                        {recipe.image != null 
                                            ? <Link 
                                                to={'/recipe/' + recipe.id} 
                                                className="relative"
                                            >
                                                <div className="absolute bottom-4 px-6 text-white font-semibold text-xl z-10">
                                                    {recipe.title}
                                                </div>
                                                <img 
                                                    className="rounded-2xl h-40 w-full object-cover brightness-75" 
                                                    src={recipe.image.directory + recipe.image.filename} 
                                                    alt={recipe.title} 
                                                />
                                            </Link>
                                            : <Link 
                                                to={'/recipe/' + recipe.id} 
                                                className="h-full w-full p-6 font-semibold text-xl z-10 flex items-end"
                                            >
                                                <div>{recipe.title}</div>
                                            </Link>
                                        }
                                    </div>
                                )}
                            </div>
                            
                            <div className="flex justify-end">
                                <div className="hidden md:block md:mt-10">
                                    <Button
                                        to="/recipe/add"
                                        icon="add"
                                        label="Neues Rezept"
                                        style="transparent"
                                    />
                                </div>
                            </div>
                        </>
                    )
                }
            </div>
        )
    }
}
