/**************************************************************
 * ./assets/layouts/Sidebar/components/SidebarDrawerButton.js *
 **************************************************************/

import React from 'react'

/**
 * SidebarDrawerButton
 * 
 * A component that renders a menu button that toggles the sidebar drawer.
 * The rendered object is a <li> element.
 * 
 * @component
 * @property {boolean} isDrawerVisible Whether or not the sidebar drawer is visible now.
 * @property {React.Dispatch<ReactSetStateAction<boolean>>} setDrawerVisible A setter function of the property isDrawerVisible.
 * @property {string?} className Additional styling classes for the <li> element.
 * @property {string?} icon The icon of the menu button. Default is 'menu'.
 */
export default function SidebarDrawerButton({ isDrawerVisible, setDrawerVisible, className = '', icon = 'menu' }) {
    return (
        <li className={'xl:w-min ' + className}>
            <div 
                className="flex items-center p-4 rounded-full transition duration-300 hover:bg-secondary-200 dark:hover:bg-secondary-dark-200 active:scale-90 group cursor-pointer"
                onClick={() => setDrawerVisible(!isDrawerVisible)}
            >
                <span className="material-symbols-rounded transition duration-300 group-hover:text-primary-200 dark:group-hover:text-primary-dark-100">
                    {icon}
                </span>
            </div>
        </li>
    )
}
