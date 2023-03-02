/*************************************************
 * ./assets/components/ui/Buttons/IconButton.tsx *
 *************************************************/

import React from 'react'

/**
 * A component that renders a button with only an icon, for example for the topbar.
 * 
 * @component
 * @param props
 * @param props.outlined Whether or not the icon should be only outlines (true) or filled (false, by default).
 * @param props.style Additional styling classes.
 * @param props.onClick An optional onClick handler.
 * @param props.children The Material Symbols identifier for the icon.
 * 
 * @example <IconButton outlined={true} onClick={() => someHandler(params)}>sync</IconButton>
 */
export default function IconButton({ outlined = false, style = '', onClick, children }: {
    outlined?: boolean
    style?: string
    onClick?: () => void
    children: string
}): JSX.Element {
    return <span 
        onClick={onClick}
        className={
            'material-symbols-rounded cursor-pointer transition duration-300 hover:bg-secondary-200 dark:hover:bg-secondary-dark-200 p-2 rounded-full' 
            + (outlined ? ' outlined' : '')
            + ' ' + style
        }
    >
        {children}
    </span>
}
