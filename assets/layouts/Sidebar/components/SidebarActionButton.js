/**************************************************************
 * ./assets/layouts/Sidebar/components/SidebarActionButton.js *
 **************************************************************/

import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import useScrollDirection from '../../../hooks/useScrollDirection';

/**
 * SidebarActionButton
 * 
 * A component that renders the sidebar action button (SAB). 
 * 
 * @component
 * @property {string} path The path where the SAB should link to.
 * @property {boolean} visible Whether the SAB is visible or not. Default is false.
 * @property {?function} onClickHandler An optional onClickHandler for the SAB.
 * @property {string} icon The icon of the SAB.
 * @property {string} label The label of the SAB.
 * @property {?boolean} floating Set true for being displayed expanded and floating in the bottom-right corner. Set false for an SAB integrated in the sidebar.
 * 
 * @example 
 * <SidebarActionButton sidebarActionButton={props.sidebarActionButton} />
 */
export default function SidebarActionButton(props) {
    /**
     * Make the SAB label visible when the user scrolls up or is at top of page
     */
    const scrollDirection = useScrollDirection();
    const isLabelVisible = scrollDirection === 'up' || window.pageYOffset === 0;

    /**
     * SAB styling classes
     */
    const styles = {
        base: 'flex items-center p-4 rounded-2xl transition duration-300 h-14'
            + ' text-gray-900 dark:text-gray-300 bg-pink-300 dark:bg-pink-800 hover:bg-pink-400'
            + ' dark:hover:bg-pink-600 active:bg-pink-500 active:scale-90',
        smSize: ' shadow-xl transition-all duration-300 overflow-hidden', 
        smSizeReduced: ' max-w-[56px]',
        smSizeExpanded: ' max-w-[250px]',
        label: 'pl-4 font-semibold whitespace-nowrap',
    };

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
    ;

    /**
     * Build styling class for the label.
     * For a non-floating action button (i.e., on larger screens), 
     * the label only becomes visible at xl-size screens.
     */
    const labelStyle = styles.label + (!props.floating ? ' hidden xl:block' : '');

    /**
     * Render
     */
    return (
        <li className="h-14">
            <Link 
                to={props.sidebarActionButton?.path}
                onClick={props.sidebarActionButton?.onClickHandler}
                className={buttonStyle}
            >
                <span className="material-symbols-rounded">{props.sidebarActionButton?.icon}</span>
                <div className={labelStyle}>{props.sidebarActionButton?.label}</div>
            </Link>
        </li>
    );
}