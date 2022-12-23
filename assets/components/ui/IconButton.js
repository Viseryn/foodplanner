/****************************************
 * ./assets/components/ui/IconButton.js *
 ****************************************/

import React from 'react';

/**
 * IconButton
 * 
 * A component that renders a button with only an icon, for example for header navigation.
 * 
 * @component
 * @property {?boolean} outlined Whether or not the icon should be outlines only (true) or filled (false, default).
 * @property
 * @property {*} props An optional object of properties of the <span /> element.
 * 
 * @example
 * <IconButton
 *     outlined={true}
 *     onClick={() => someHandler(params)}
 * >
 *     sync
 * </IconButton>
 */
function IconButton({ outlined = false, styles = '', ...props }) {
    return (
        <span 
            className={
                'material-symbols-rounded cursor-pointer transition duration-300 '
                + 'hover:bg-gray-200 dark:hover:bg-[#232325] p-2 rounded-full' 
                + (outlined ? ' outlined' : '')
                + ' ' + styles
            }
            {...props} 
        >
            {props.children}
        </span>
    );
}

export default IconButton;
