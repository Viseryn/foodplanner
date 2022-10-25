// ./assets/components/Planner.js
    
import React, {Component} from 'react';
import {Route, Switch, Redirect, Link, withRouter} from 'react-router-dom';

import Heading from './Heading';
import Spinner from './Util';
    
class Planner extends Component {
    componentDidMount() {
        this.props.updateSidebar('planner');
        this.props.updateSAB(true, 'add', '/planner/add');
    }

    componentWillUnmount() {
        this.props.updateSidebar();
        this.props.updateSAB();
    }
    
    render() {
        return (
            <>
                <Heading title="Wochenplan" />
                <Spinner />
            </>
        )
    }
}
    
export default Planner;