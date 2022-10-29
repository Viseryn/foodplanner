/*********************************
 * ./assets/components/Recipe.js *
 *********************************/

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

import Spinner from './Util';
import Heading from './Heading';
import Button from './Buttons';

/**
 * Recipe
 * 
 * A component for showing a Recipe.
 * Collects the data from the Recipe Show API 
 * in /src/Controller/RecipeController.php.
 */
function Recipe(props) {
    const { id } = props.params; 
    const [recipe, setRecipe] = useState([]);
    const [isLoading, setLoading] = useState(true);

    // Load Sidebar
    useEffect(() => {
        props.setSidebarActiveItem('recipes');
        props.setSidebarActionButton({
            visible: true, 
            icon: 'drive_file_rename_outline', 
            path: '/recipe/' + id + '/edit', 
            label: 'Bearbeiten',
        });
    }, []);


    // Call the Recipe Show API and load the Recipe
    // data into the state variable. Redirect to an 
    // Error 404 page if the Recipe does not exist.
    axios
        .get('/api/recipe/' + id)
        .then(response => {
            setRecipe(JSON.parse(response.data));
            setLoading(false);
        })
        .catch(error => {
            console.log(error);
            window.location = "/error/404";
        });

    // Render
    return (
        <>
            {isLoading ? (
                <Spinner />
            ) : (
                <div className="max-w-[900px]">
                    <Heading title={recipe.title} />

                    {recipe.image != null &&
                        <img 
                            className="rounded-3xl h-80 object-cover mb-10 shadow-md hover:shadow-xl transition duration-300 w-full" 
                            src={recipe.image.directory + recipe.image.filename}
                            alt={recipe}
                        />
                    }

                    <Ingredients portionSize={recipe.portion_size} ingredients={recipe.ingredients} />
                    <Instructions instructions={recipe.instructions} />

                    <div className="flex justify-end">
                        <div className="hidden md:block md:pt-6">
                            <Button 
                                to={'/recipe/' + recipe.id + '/edit'}
                                icon="drive_file_rename_outline"
                                label="Bearbeiten"
                                style="transparent"
                            />
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

/**
 * Ingredients
 * 
 * Renders a heading and a list of ingredients.
 */
function Ingredients(props) {
    return (
        <>
            {props.ingredients.length > 0 &&
                <div className="mb-10">
                    <div className="bg-gray-100 font-bold px-6 py-3 mb-3 rounded-xl">
                        Zutaten für 
                        {props.portionSize == 1 
                            ? ' eine Portion'
                            : ' ' + props.portionSize + ' Portionen'
                        }
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2">
                        {props.ingredients.map(ingredient =>
                            <div key={ingredient.id} className="px-6 pt-2">
                                {(ingredient.quantity_value ?? '')
                                    + ' ' + (ingredient.quantity_unit ?? '')
                                    + ' ' + ingredient.name}
                            </div>
                        )}
                    </div>
                </div>
            }
        </>
    );
}

/**
 * Ingredients
 * 
 * Renders a heading and a list of instructions.
 */
function Instructions(props) {
    return (
        <>
            {props.instructions.length > 0 &&
                <div className="mb-10">
                    <div className="bg-gray-100 font-bold px-6 py-3 mb-5 rounded-xl">
                        Zubereitung
                    </div>
                    <div className="space-y-2">
                        {props.instructions.map((instruction, index) =>
                            <div key={instruction.id} className="flex px-6">
                                <span className="mr-2">{index + 1}.</span>
                                {instruction.instruction}
                            </div>
                        )}
                    </div>
                </div>
            }
        </>
    )
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