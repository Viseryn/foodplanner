// ./assets/components/Planner.js
    
import React, {Component} from 'react';
import {Route, Switch, Redirect, Link, withRouter} from 'react-router-dom';
    
class Planner extends Component {
    
    render() {
        loadSidebar('planner');
        return (
            <div>
                Planner
            </div>
        )
    }
}
    
export default Planner;