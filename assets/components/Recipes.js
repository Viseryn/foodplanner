/**********************************
 * ./assets/components/Recipes.js *
 **********************************/

import React, {Component, useEffect, useState} from 'react';
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
export default function Recipes(props) {
    const [recipes, setRecipes] = useState([]);
    const [isLoading, setLoading] = useState(true);

    useEffect(() => {
        // Load Sidebar
        props.setSidebarActiveItem('recipes');
        props.setSidebarActionButton({
            visible: true, 
            icon: 'add', 
            path: '/recipe/add', 
            label: 'Neues Rezept',
        });
        
        // Call the Recipe List API and load the Recipe
        // data into the state variable.
        axios
            .get('/api/recipes')
            .then(response => {
                setRecipes(JSON.parse(response.data));
                setLoading(false);
            });
    }, []);
    
    // Render
    return (
        <>
            <Heading title="Rezepte" />


            {isLoading 
                ? <Spinner />
                : <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-10">
                        {recipesFiltered.map(recipe => 
                            <RecipeCard key={recipe.id} recipe={recipe} />
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
            }
        </>
    );
}

function RecipeCard(props) {
    return (
        <div key={props.recipe.id} className="h-40 w-full shadow-md rounded-2xl transition duration-300 hover:shadow-2xl">
            <div className="relative group">
                <Link to={'/recipe/' + props.recipe.id}>
                    <img 
                        className="rounded-2xl h-40 w-full object-cover brightness-[.7]" 
                        src={props.recipe.image?.filename != null 
                            ? props.recipe.image?.directory + props.recipe.image?.filename
                            : '/img/default.jpg'
                        } 
                        alt={props.recipe.title}
                    />
                    <div className="absolute w-full bottom-4 px-6 text-white font-semibold text-xl">
                        {props.recipe.title}
                    </div>
                </Link>
            </div>
        </div>
    );
}