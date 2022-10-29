/*********************************
 * ./assets/components/Pantry.js *
 *********************************/
    
import {Route, Switch, Redirect, Link, withRouter} from 'react-router-dom';
import React, { useEffect } from 'react';

import Heading from './Heading';
import Spinner from './Util';

export default function Pantry(props) {
    useEffect(() => {
        props.setSidebarActiveItem('pantry');
        props.setSidebarActionButton({
            visible: false, 
        });
    }, []);

    return (
        <>
            <Heading title="Vorratskammer" />
            <Spinner />
        </>
    );
}
