/**************************************
 * ./assets/layouts/Topbar/Topbar.tsx *
 **************************************/

import React from 'react'
import { Link } from 'react-router-dom'

import IconButton from '@/components/ui/Buttons/IconButton'
import Heading from '@/components/ui/Heading'
import useScrollPosition from '@/hooks/useScrollPosition'
import TopbarHeading from '@/layouts/Topbar/components/TopbarHeading'
import TopbarTitleSkeleton from './components/TopbarTitleSkeleton'

/**
 * A layout component that renders the topbar. The topbar has two different versions.
 * 
 * First one, the version for larger screens (md+). It is a flex row with undetermined size that 
 * allows for additional styling classes (for example, setting a max-width).
 * 
 * Second one, the version for mobile screens. It is a full-width fixed container at the top. On 
 * scrolling (i.e., when scrollPosition > 0), it retracts to a smaller size. This version also 
 * contains a SidebarDrawerButton.
 * 
 * Both versions leave space for TopbarActionButtons in the top-right corner, e.g. edit or delete 
 * buttons. To the left of the title, a back button can be shown.
 * 
 * Each child component of App.js can set the topbar using the setTopbar method (see example). Most 
 * properties should be self-explanatory; truncate defines whether the title should be truncated on 
 * smaller screens after scrolling so it doesn't clip behind the action buttons; isLoading can be given 
 * some state condition (e.g. isLoadingRecipes) to show a skeleton instead of the title while loading.
 * 
 * @component
 * @param props
 * @param props.topbar An object that describes the topbar. 
 * @param props.SidebarDrawerButton An instance of the SidebarDrawerButton component.
 */
export default function Topbar({ topbar, SidebarDrawerButton }: {
    topbar: TopbarConfiguration
    SidebarDrawerButton: JSX.Element
}): JSX.Element {
    // Current scrolling position.
    const scrollPosition: number = useScrollPosition(true)

    /**
     * Renders a container div containing the action buttons.
     * 
     * @param style Styling classes of the container.
     * @return The container of the action buttons.
     */
    const TopbarActionButtons = (style: string = ''): JSX.Element => (
        <div className={'flex gap-2 ' + style}>
            {topbar?.actionButtons?.map((button, index) => 
                <IconButton
                    key={index}
                    outlined={true}
                    onClick={button.onClick}
                >
                    {button.icon}
                </IconButton>
            )}
        </div>
    )

    // The topbar for large screens (md+). Hidden on small screens.
    const TopbarLargeScreens: JSX.Element = (
        <div className={`hidden md:fixed z-20 bg-bg dark:bg-bg-dark md:flex justify-between items-center w-full h-[5.5rem] pt-6 pb-2 ${topbar?.style}`}>
            <div>
                {topbar?.showBackButton ? (
                    <TopbarHeading
                        location={topbar?.backButtonPath} 
                        onClick={topbar?.onBackButtonClick}
                    >
                        {!topbar?.isLoading ? topbar?.title : <TopbarTitleSkeleton />}
                    </TopbarHeading>
                ) : (
                    <Heading style="ml-2">
                        {!topbar?.isLoading ? topbar?.title : <TopbarTitleSkeleton />}
                    </Heading>
                )}
            </div>
            
            {TopbarActionButtons()}
        </div>
    )

    // The topbar for small screens. Hidden on large screens (md+).
    const TopbarSmallScreens: JSX.Element = (
        <>
            <div className="w-full h-[4.5rem] bg-bg dark:bg-bg-dark md:hidden fixed z-20">
                <ul className="transition-all duration-300 h-[4.5rem] p-2 pr-4 fixed z-40">
                    {SidebarDrawerButton}
                </ul>

                {TopbarActionButtons('flex items-center justify-end h-[4.5rem] p-2 pr-4 fixed right-0 z-40')}

                <div className={
                    'duration-300 bg-bg dark:bg-bg-dark h-[4.5rem] w-[200%] flex items-center fixed top-[4.5rem] left-[-5rem] pl-[6rem] ' 
                    + (scrollPosition > 0 ? 'translate-y-[-72px] translate-x-[58px]' : '')
                }> 
                    <div className={topbar?.showBackButton ? 'flex justify-start items-center' : 'ml-2'}>
                        {topbar?.showBackButton &&
                            <div className="flex justify-between">
                                <Link 
                                    to={topbar?.backButtonPath ?? '#'} 
                                    onClick={topbar?.onBackButtonClick}
                                    className="mr-4 text-primary-200 dark:text-secondary-dark-900"
                                >
                                    <IconButton>arrow_back</IconButton>
                                </Link>
                            </div>
                        }
            
                        <div className={
                            'font-semibold text-primary-200 dark:text-secondary-dark-900 transition-all duration-300 ' 
                            + (scrollPosition > 0 ? 'text-xl w-[150px] whitespace-nowrap' : 'w-[300px] text-3xl')
                            + (scrollPosition > 0 && topbar?.truncate ? ' truncate' : '')
                        }>
                            {!topbar?.isLoading ? topbar?.title : <TopbarTitleSkeleton />}
                        </div>
                    </div>
                </div>
            </div>
            
            <div className={'h-[144px] md:hidden'}></div>
        </>
    )
    
    // Render Topbar
    return <>
        {TopbarLargeScreens}
        {TopbarSmallScreens}
    </>
}
