/************************************************
 * ./assets/components/ui/Buttons/IconButton.js *
 ************************************************/

import React from 'react';

/**
 * IconButton
 * 
 * A component that renders a button with only an icon, for example for header navigation.
 * 
 * @component
 * @property {?boolean} outlined Whether or not the icon should be outlines only (true) or filled (false, default).
 * @property {?string} style Additional styling classes.
 * @property {*} props An optional object of properties of the <span /> element, e.g. onClick handling.
 * 
 * @example
 * <IconButton
 *     outlined={true}
 *     onClick={() => someHandler(params)}
 * >
 *     sync
 * </IconButton>
 */
export default function IconButton({ outlined = false, style = '', ...props }) {
    return (
        <span 
            className={
                'material-symbols-rounded cursor-pointer transition duration-300 '
                + 'hover:bg-secondary-200 dark:hover:bg-secondary-dark-200 p-2 rounded-full' 
                + (outlined ? ' outlined' : '')
                + ' ' + style
            }
            {...props} 
        >
            {props.children}
        </span>
    );
}
