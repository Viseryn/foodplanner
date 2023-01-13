/*************************************
 * ./assets/layouts/Topbar/Topbar.js *
 *************************************/

import React from 'react';
import { Link } from 'react-router-dom';

import HeadingAndBackButton from '../../components/ui/HeadingAndBackButton';
import Heading from '../../components/ui/Heading';
import IconButton from '../../components/ui/Buttons/IconButton';
import useScrollPosition from '../../hooks/useScrollPosition';

/**
 * Topbar
 * 
 * A layout component that renders the topbar.
 * 
 * @component
 * @property {JSX.Element} SidebarDrawerButton A SidebarDrawerButton component instance.
 * @property {object} topbar An object that describes the topbar. 
 */
export default function Topbar(props) {
    const scrollPosition = useScrollPosition(true)
    
    return (
        <>
            {/**
             * Topbar for mobile screens 
             */}
            <div className="w-full h-[4.5rem] bg-bg dark:bg-bg-dark md:hidden fixed z-20">
                {/* Sidebar Drawer Button */}
                <ul className={'transition-all duration-300 h-[4.5rem] p-2 pr-4 fixed z-40'}>
                    {props.SidebarDrawerButton}
                </ul>

                {/* Topbar action buttons */}
                <div className="flex items-center justify-end h-[4.5rem] p-2 pr-4 fixed z-40 right-0">
                    {props.topbar?.actionButtons?.map((button, index) => 
                        <IconButton
                            key={index}
                            outlined={true}
                            onClick={button.onClick}
                        >{button.icon}</IconButton>
                    )}
                </div>

                {/* Title ......pl-4 for back button, pl-6 for text */}
                <div className={
                    'duration-300 bg-bg dark:bg-bg-dark h-[4.5rem] w-[200%] flex '
                    + 'items-center fixed top-[4.5rem] left-[-5rem] pl-[6rem] ' 
                    + (scrollPosition > 0 ? 'translate-y-[-72px] translate-x-[58px]' : '')
                }> 
                    {props.topbar?.showBackButton // @todo Combine!!
                        ? <div className="flex justify-start items-center">
                            <div className="flex justify-between">
                                <Link 
                                    to={props.topbar?.backButtonPath ?? '#'} 
                                    className="mr-4 text-primary-200 dark:text-secondary-dark-900"
                                >
                                    <IconButton>arrow_back</IconButton>
                                </Link>
                            </div>
                
                            <div className={
                                'font-semibold text-primary-200 dark:text-secondary-dark-900 transition-all duration-300 ' 
                                + (scrollPosition > 0 ? 'text-xl w-[200px] truncate' : 'w-[300px] truncate text-3xl')
                            }>
                                {props.topbar?.title}
                            </div>
                        </div>
                        : <div className="ml-2">
                            <div className={
                                'font-semibold text-primary-200 dark:text-secondary-dark-900 transition-all duration-300 ' 
                                + (scrollPosition > 0 ? 'text-xl w-[200px] truncate' : 'w-[300px] truncate text-3xl')
                            }>
                                {props.topbar?.title}
                            </div>
                        </div>
                    }
                </div>
            </div>
            <div className={'h-[144px] md:hidden'}></div>

            {/** 
             * Topbar for larger screens (md+)
             */}
            <div className={
                'justify-between items-center h-14 mt-6 --fixed z-20 --left-24 hidden' 
                + (props.topbar?.onlyMobile ? '' : ' md:flex')
            }>
                <div>
                    {props.topbar?.showBackButton 
                        ? <HeadingAndBackButton location={props.topbar?.backButtonPath}>{props.topbar?.title}</HeadingAndBackButton>
                        : <Heading style="ml-2">{props.topbar?.title}</Heading>
                    }
                </div>
                <div>
                    {props.topbar?.actionButtons?.map((button, index) => 
                        <IconButton
                            key={index}
                            outlined={true}
                            onClick={button.onClick}
                        >{button.icon}</IconButton>
                    )}
                </div>
            </div>
        </>
    )
}
