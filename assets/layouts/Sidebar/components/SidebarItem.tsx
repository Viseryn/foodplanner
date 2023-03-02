/*******************************************************
 * ./assets/layouts/Sidebar/components/SidebarItem.tsx *
 *******************************************************/

import React from 'react'
import { Link } from 'react-router-dom'

/**
 * A component that renders a single sidebar item, i.e. a <li> element that contains an icon and a label.
 * 
 * @component
 * @param props
 * @param props.id The id of the component this sidebar item should link to. Default is '/'. Will be overriden if path is set.
 * @param props.icon The icon of the sidebar item. 
 * @param props.label The label of the sidebar item.
 * @param props.sidebarActiveItem The id of the sidebar item that is currently active.
 */
export default function SidebarItem({ id, icon, label, sidebarActiveItem }: {
    id: string
    icon: string
    label: string
    sidebarActiveItem: string
}): JSX.Element {
    const SidebarItemContent = (
        <div className={
            'transition duration-300 group-hover:text-primary-200 dark:group-hover:text-primary-dark-100 flex flex-col md:flex-row items-center '
            + (sidebarActiveItem == id ? 'text-primary-200 dark:text-primary-dark-100' : '')
        }>
            {/* Label icon */}
            <span className={
                'material-symbols-rounded transition-[background-color] duration-300 rounded-full h-8 w-16 md:h-auto md:w-auto flex md:block justify-center items-center group-hover:bg-secondary-200 dark:group-hover:bg-secondary-dark-200 md:group-hover:bg-transparent dark:md:group-hover:bg-transparent '
                + (sidebarActiveItem == id 
                    ? 'bg-secondary-200 dark:bg-secondary-dark-200 md:bg-transparent dark:md:bg-transparent ' 
                    : 'outlined '
                )
            }>
                {icon}
            </span>

            {/* Label text */}
            <span className="font-semibold mt-1 text-xs md:mt-0 md:ml-4 md:hidden xl:block xl:text-base">
                {label}
            </span>
        </div>
    )

    // Render SidebarItem
    return (
        <li>
            <Link to={'/' + id} className={
                'group transition duration-300 md:flex md:items-center md:p-4 md:rounded-full md:hover:bg-secondary-200 dark:md:hover:bg-secondary-dark-200 md:active:scale-90 '
                + (sidebarActiveItem == id ? 'md:bg-secondary-200 dark:md:bg-secondary-dark-200' : '')
            }>
                {SidebarItemContent}
            </Link>
        </li>
    )
}
