/***************************************************************
 * ./assets/layouts/Sidebar/components/SidebarActionButton.tsx *
 ***************************************************************/

import React                from 'react'
import { Link }             from 'react-router-dom'

import useScrollDirection   from '@/hooks/useScrollDirection'
import useScrollPosition    from '@/hooks/useScrollPosition'

/**
 * SidebarActionButton
 * 
 * A component that renders the sidebar action button (SAB). 
 * 
 * @component
 * @param props
 * @param props.sidebarActionButton The configuration of the SAB.
 * @param props.floating Set true for being displayed expanded and floating in the bottom-right corner. Set false for an SAB integrated in the sidebar.
 */
export default function SidebarActionButton({ sidebarActionButton, floating }: {
    sidebarActionButton: SidebarActionButtonConfiguration
    floating?: boolean
}): JSX.Element {
    /**
     * Make the SAB label visible when the user scrolls up or is at top/bottom of page
     */
    const scrollDirection = useScrollDirection()
    const scrollPosition = useScrollPosition()
    const isAtBottom = scrollPosition >= document.body.scrollHeight - 50 // Add some buffer
    const isLabelVisible = scrollDirection === 'up' || window.pageYOffset === 0 || (scrollDirection === 'down' && isAtBottom)

    /**
     * SAB styling classes
     */
    const styles = {
        base: 'flex items-center p-4 rounded-2xl transition duration-300 h-14'
            + ' text-tertiary-900 dark:text-tertiary-dark-900 bg-tertiary-100 dark:bg-tertiary-dark-100 hover:bg-tertiary-200'
            + ' dark:hover:bg-tertiary-dark-200 active:scale-90',
        smSize: ' shadow-xl transition-all duration-300 overflow-hidden', 
        smSizeReduced: ' max-w-[56px]',
        smSizeExpanded: ' max-w-[250px]',
        label: 'pl-4 font-semibold whitespace-nowrap',
    }

    /** 
     * Build styling class for the button itself (the <Link /> element).
     * If the configuration sidebarActionButton.visible === false, then
     * the element is just hidden. Otherwise, use the base styling.
     * For a floating action button (i.e., on small screens), we 
     * add the styling styles.smSize. The label is hidden when scrolling 
     * down, so we animate the width of the action button with the 
     * two stylings styles.smSizeExpanded and styles.smSizeReduced.
     */
    const buttonStyle = !sidebarActionButton?.visible 
        ? 'hidden'
        : styles.base + (floating 
            ? styles.smSize + (isLabelVisible 
                ? styles.smSizeExpanded 
                : styles.smSizeReduced)
            : ''
        )

    /**
     * Build styling class for the label.
     * For a non-floating action button (i.e., on larger screens), 
     * the label only becomes visible at xl-size screens.
     */
    const labelStyle = styles.label + (!floating ? ' hidden xl:block' : '')

    /**
     * Render SidebarActionButton
     */
    return (
        <li className="h-14">
            <Link 
                to={sidebarActionButton.path || '#'}
                onClick={sidebarActionButton?.onClick}
                className={buttonStyle}
            >
                <span className="material-symbols-rounded">{sidebarActionButton?.icon}</span>
                <span className={labelStyle}>{sidebarActionButton?.label}</span>
            </Link>
        </li>
    )
}
