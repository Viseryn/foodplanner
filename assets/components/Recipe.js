/*********************************
 * ./assets/components/Recipe.js *
 *********************************/

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

import Heading from './Heading';
import Button from './Buttons';
import SkeletonText from './SkeletonText';

/**
 * Recipe
 * 
 * A component for showing a Recipe.
 * Collects the data from the Recipe Show API 
 * in /src/Controller/RecipeController.php.
 * 
 * This component is used in the Recipes component
 * and may not be used as standalone.
 */
export default function Recipe(props) {
    const [recipe, setRecipe] = useState([]);
    const [isLoading, setLoading] = useState(true);

    useEffect(() => {
        // Scroll to top
        window.scrollTo(0, 0);

        // Load sidebar
        props.setSidebarActiveItem('recipes');
        props.setSidebarActionButton({
            visible: true, 
            icon: 'drive_file_rename_outline', 
            path: '/recipe/' + props.id + '/edit', 
            label: 'Bearbeiten',
        });

        // Call the Recipe Show API and load the Recipe
        // data into the state variable. Redirect to an 
        // Error 404 page if the Recipe does not exist.
        axios
            .get('/api/recipe/' + props.id)
            .then(response => {
                setRecipe(JSON.parse(response.data));
                setLoading(false);
            })
            .catch(error => {
                console.log(error);
                window.location = "/error/404";
            });
    }, []);

    // Render
    return (
        <>
            {isLoading 
                ? <div className="animate-pulse mb-10">
                    <div className="h-9 bg-gray-200 dark:bg-gray-800 rounded-full w-1/2"></div>
                </div>
                : <div className="flex justify-between items-start">
                    <Heading title={recipe.title} />
                    <Link to="/recipes">
                    
                    {/* Button for resetting two-column mode */}
                    <span 
                        className="hidden lg:block material-symbols-rounded ml-2 cursor-pointer transition duration-300 hover:bg-gray-200 dark:hover:bg-[#232325] p-2 rounded-full"
                        onClick={() => { props.setTwoColumns(); }}
                    >
                        close
                    </span>
                    </Link>
                </div>
            }

            {isLoading
                ? <img className="animate-pulse rounded-3xl h-80 w-full mb-10 object-cover" src='/img/default.jpg' />
                : <>
                    {recipe.image != null &&
                        <img 
                            className="rounded-3xl h-80 object-cover mb-10 shadow-md hover:shadow-xl transition duration-300 w-full" 
                            src={recipe.image.directory + recipe.image.filename}
                            alt={recipe}
                        />
                    }
                </>
            }

            {isLoading
                ? <>
                    <div className="flex bg-gray-100 dark:bg-[#232325] h-12 font-bold px-6 py-3 mb-6 rounded-xl">
                        <div className="animate-pulse self-center bg-gray-300 dark:bg-gray-700 w-48 h-2.5 rounded-full"></div>
                    </div>
                    <SkeletonText />
                </>
                : <>
                    <Ingredients portionSize={recipe.portion_size} ingredients={recipe.ingredients} />
                    <Instructions instructions={recipe.instructions} />

                    {recipe.image === undefined && recipe.ingredients.length === 0 && recipe.instructions.length === 0 &&
                        <div className="text-gray-400">
                            Hier gibt es noch nichts zu sehen.
                        </div>
                    }

                    <div className="flex justify-end">
                        <div className="hidden md:block">
                            <Button 
                                to={'/recipe/' + recipe.id + '/edit'}
                                icon="drive_file_rename_outline"
                                label="Bearbeiten"
                                style="transparent"
                            />
                        </div>
                    </div>
                </>
            }
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
                    <div className="bg-gray-100 dark:bg-[#232325] font-bold px-6 py-3 mb-3 rounded-xl">
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
                    <div className="bg-gray-100 dark:bg-[#232325] font-bold px-6 py-3 mb-5 rounded-xl">
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
