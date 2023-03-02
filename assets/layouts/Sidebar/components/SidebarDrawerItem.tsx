/*************************************************************
 * ./assets/layouts/Sidebar/components/SidebarDrawerItem.tsx *
 *************************************************************/

import React from 'react'
import { Link } from 'react-router-dom'

/**
 * A component that renders a single sidebar drawer item.
 * 
 * @component
 * @param props
 * @param props.id The id of the component this sidebar item should link to. Default is '/'. Will be overriden if path is set.
 * @param props.icon The icon of the sidebar item. 
 * @param props.label The label of the sidebar item.
 * @param props.path An external URL. 
 * @param props.onClick An optional onClick handler, if no path was provided.
 */
export default function SidebarDrawerItem({ id, icon, label, path, onClick }: {
    id: string
    icon: string
    label: string
    path?: string
    onClick?: () => void
}): JSX.Element {
    // The location that the Link component will redirect to
    const linkLocation: string = (onClick != null) ? '#' : ('/' + id)

    // If onClick was provided, it will be called in onClickHandler
    const onClickHandler = (): void => { 
        if (onClick != null) {
            onClick()
        }
    }
        
    const SidebarDrawerItemContent = (
        <div className={
            'transition duration-300 group-hover:text-primary-200 dark:group-hover:text-primary-dark-100 '
            + 'flex flex-row items-center '
        }>
            {/* Label icon */}
            <span className="material-symbols-rounded rounded-full">
                {icon}
            </span>

            {/* Label text */}
            <span className="font-semibold ml-4">
                {label}
            </span>
        </div>
    )

    // Render SidebarDrawerItem
    return (
        <li>
            {path 
                ? <a 
                    href={path} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="group transition duration-300 flex items-center p-4 rounded-full hover:bg-secondary-200 dark:hover:bg-secondary-dark-200 active:scale-90" 
                >
                    {SidebarDrawerItemContent}
                </a>
                : <Link 
                    to={linkLocation} 
                    onClick={onClickHandler} 
                    className="group transition duration-300 flex items-center p-4 rounded-full hover:bg-secondary-200 dark:hover:bg-secondary-dark-200 active:scale-90"
                >
                    {SidebarDrawerItemContent}
                </Link>
            }
        </li>
    )
}
