/**********************************
 * ./assets/components/AddMeal.js *
 **********************************/

import React, { useEffect } from 'react';
import { Route, Switch, Redirect, Link, withRouter } from 'react-router-dom';

import Heading from './Heading';
import Spinner from './Util';

export default function ShoppingList(props) {
    useEffect(() => {
        props.setSidebarActiveItem('shoppinglist');
        props.setSidebarActionButton({
            visible: false, 
        });
    }, []);

    return (
        <>
            <Heading title="Einkaufsliste" />
            <Spinner />
        </>
    );
}
