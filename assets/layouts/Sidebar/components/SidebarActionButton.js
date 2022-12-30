/**************************************************************
 * ./assets/layouts/Sidebar/components/SidebarActionButton.js *
 **************************************************************/

import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

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
 * @property {?boolean} floating If true, the SAB will be displayed extended and floating in the bottom-right corner.
 * 
 * @example 
 * <SidebarActionButton sidebarActionButton={props.sidebarActionButton} />
 */
export default function SidebarActionButton(props) {
    const SABbaseStyle = 'flex items-center p-4 rounded-2xl transition duration-300 h-14 xl:w-auto' + (props.floating ? ' w-auto fixed bottom-[6.5rem] right-6 shadow-xl' : ' w-14');
    const SABinvisibleStyle = SABbaseStyle + ' hidden';
    const SABvisibleStyle = SABbaseStyle + ' text-gray-900 dark:text-gray-300 bg-pink-300 dark:bg-pink-800 hover:bg-pink-400 dark:hover:bg-pink-600 active:bg-pink-500 active:scale-90';

    /**
     * Helpers for visibility of SAB label on mobile
     */
    const [isVisible, setVisible] = useState(true);
    const [scrollY, setScrollY] = useState(0);
  
    useEffect(() => {   
      window.addEventListener("scroll", listenToScroll);
      return () => window.removeEventListener("scroll", listenToScroll); 
    }, []);

    const listenToScroll = () => {
        const heightToHideFrom = 1; // Removes label of SAB after scrolling past 1px
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        setScrollY(winScroll);

        if (winScroll > heightToHideFrom) {  
            isVisible && setVisible(false);
        } else {
            setVisible(true);
        }  
    };

    /**
     * Render
     */
    return (
        <li className="sidebar-action-button h-14">
            <Link 
                to={props.sidebarActionButton?.path}
                className={props.sidebarActionButton?.visible ? SABvisibleStyle : SABinvisibleStyle}
                onClick={props.sidebarActionButton?.onClickHandler}
            >
                <span className="material-symbols-rounded">
                    {
                        props.sidebarActionButton?.visible 
                        ? props.sidebarActionButton?.icon
                        : ''
                    }
                </span>
                <div className={(props.floating && isVisible ? '' : 'hidden ') + 'xl:block w-full ml-4 font-semibold'}>{props.sidebarActionButton?.label}</div>
            </Link>
        </li>
    );
}
