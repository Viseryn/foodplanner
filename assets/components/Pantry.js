/*********************************
 * ./assets/components/Pantry.js *
 *********************************/
    
import React, {Component} from 'react';
import {Route, Switch, Redirect, Link, withRouter} from 'react-router-dom';

import Heading from './Heading';
import Spinner from './Util';
    
export default class Pantry extends Component {
    componentDidMount() {
        this.props.updateSidebar('pantry');
        this.props.updateSAB();
    }

    render() {
        return (
            <>
                <Heading title="Vorratsschrank" />
                <Spinner />
            </>
        )
    }
}