// ./assets/components/Recipes.js
    
import React, {Component} from 'react';
import {Route, Switch, Redirect, Link, withRouter} from 'react-router-dom';
    
export default class Recipes extends Component {
    constructor(props) {
        super(props);
        this.state = {recipes: [], loading: true};
    }

    getRecipes() {
        axios.get('/api/recipes').then(
            recipes => {
                this.setState({ 
                    recipes: recipes.data, 
                    loading: false
                })
            }
        );
    }

    render() {
        loadSidebar('recipes');

        return (
            <div>
                Recipes
            </div>
        )
    }
}
