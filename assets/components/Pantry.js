/*********************************
 * ./assets/components/Pantry.js *
 *********************************/
    
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
        <div className="px-6 pb-24 pt-6 md:pb-6 md:my-6 md:mr-6 w-full min-h-screen md:min-h-fit bg-white dark:bg-[#29353f] md:rounded-3xl md:w-[450px]">
            <Heading>Vorratskammer</Heading>
            <Spinner />
        </div>
    );
}
