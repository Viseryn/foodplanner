/***************************************
 * ./assets/components/ShoppingList.js *
 ***************************************/

import React, { useEffect } from 'react';

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
