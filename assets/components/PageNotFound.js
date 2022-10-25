/**
 * /assets/components/PageNotFound.js
 */
    
import React, {Component} from 'react';
import Notification from './Notification';
    
export default class PageNotFound extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.props.updateSidebar();
        this.props.updateSAB();
    }

    render() {
        return (
            <div className="max-w-[700px]">
                <Notification 
                    title="Fehler 404"
                    message="Die angeforderte Seite konnte nicht gefunden werden. Bitte wende dich an den Administrator, falls der Fehler weiterhin auftreten sollte."
                    icon="error"
                    color="red"
                />
            </div>
        );
    }
}
