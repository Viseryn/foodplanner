/************************************************************
 * ./assets/layouts/Sidebar/components/SidebarDrawerItem.js *
 ************************************************************/

import React    from 'react'
import { Link } from 'react-router-dom'

/**
 * SidebarDrawerItem
 * 
 * A component that renders a single sidebar drawer item.
 * 
 * @component
 * @property {string} id The id of the component this sidebar item should link to. Default is '/'. Will be overriden if path is set.
 * @property {string} icon The icon of the sidebar item. 
 * @property {string} label The label of the sidebar item.
 * @property {?string} path An external URL. 
 */
export default function SidebarDrawerItem({ id, icon, label, path }) {
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

    return (
        <li>
            {path ? (
                <a href={path} className={
                    'group transition duration-300 '
                    + 'flex items-center p-4 rounded-full '
                    + 'hover:bg-secondary-200 dark:hover:bg-secondary-dark-200 '
                    + 'active:scale-90 '
                } target="_blank" rel="noopener noreferrer">
                    {SidebarDrawerItemContent}
                </a>
            ) : (
                <Link to={'/' + id} className={
                    'group transition duration-300 '
                    + 'flex items-center p-4 rounded-full '
                    + 'hover:bg-secondary-200 dark:hover:bg-secondary-dark-200 '
                    + 'active:scale-90 '
                }>
                    {SidebarDrawerItemContent}
                </Link>
            )}
        </li>
    )
}
