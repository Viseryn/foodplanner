/**************************************************************
 * ./assets/layouts/Sidebar/components/SidebarActionButton.js *
 **************************************************************/

import React                from 'react'
import { Link }             from 'react-router-dom'

import useScrollDirection   from '../../../hooks/useScrollDirection'
import useScrollPosition    from '../../../hooks/useScrollPosition'

/**
 * SidebarActionButton
 * 
 * A component that renders the sidebar action button (SAB). 
 * 
 * @component
 * @param {object} props
 * @param {string} props.path The path where the SAB should link to.
 * @param {boolean} props.visible Whether the SAB is visible or not. Default is false.
 * @param {function} props.onClick An optional onClickHandler for the SAB.
 * @param {string} props.icon The icon of the SAB.
 * @param {string} props.label The label of the SAB.
 * @param {?boolean} props.floating Set true for being displayed expanded and floating in the bottom-right corner. Set false for an SAB integrated in the sidebar.
 */
export default function SidebarActionButton(props) {
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
    const buttonStyle = !props.sidebarActionButton?.visible 
        ? 'hidden'
        : styles.base + (props.floating 
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
    const labelStyle = styles.label + (!props.floating ? ' hidden xl:block' : '')

    /**
     * Render SidebarActionButton
     */
    return (
        <li className="h-14">
            <Link 
                to={props.sidebarActionButton?.path}
                onClick={props.sidebarActionButton?.onClick}
                className={buttonStyle}
            >
                <span className="material-symbols-rounded">{props.sidebarActionButton?.icon}</span>
                <span className={labelStyle}>{props.sidebarActionButton?.label}</span>
            </Link>
        </li>
    )
}
