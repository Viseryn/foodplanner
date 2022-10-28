// ./assets/components/ShoppingList.js
    
import React, {Component} from 'react';
import {Route, Switch, Redirect, Link, withRouter} from 'react-router-dom';

import Heading from './Heading';
import Spinner from './Util';
    
export default class ShoppingList extends Component {
    componentDidMount() {
        this.props.updateSidebar('shoppinglist');
        this.props.updateSAB();
    }

    componentWillUnmount() {
        this.props.updateSidebar();
        this.props.updateSAB();
    }
    
    render() {
        return (
            <>
                <Heading title="Einkaufsliste" />
                <Spinner />
            </>
        )
    }
}