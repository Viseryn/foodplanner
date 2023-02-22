/***************************************************************
 * ./assets/layouts/Sidebar/components/SidebarDrawerButton.tsx *
 ***************************************************************/

import React from 'react'

/**
 * SidebarDrawerButton
 * 
 * A component that renders a menu button that toggles the sidebar drawer.
 * The rendered object is a <li> element.
 * 
 * @component
 * @param props
 * @param props.isDrawerVisible Whether or not the sidebar drawer is visible now.
 * @param props.setDrawerVisible A setter function of the property isDrawerVisible.
 * @param props.style Additional styling classes for the <li> element.
 * @param props.icon The icon of the menu button. Default is 'menu'.
 */
export default function SidebarDrawerButton({ isDrawerVisible, setDrawerVisible, style = '', icon = 'menu' }: {
    isDrawerVisible: boolean
    setDrawerVisible: React.Dispatch<React.SetStateAction<boolean>>
    style?: string
    icon?: string
}): JSX.Element {
    return (
        <li className={'xl:w-min ' + style}>
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
