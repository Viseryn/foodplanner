import IconButton from "@/components/ui/Buttons/IconButton"
import Heading from "@/components/ui/Heading"
import { MainViewWidthContext } from "@/context/MainViewWidthContext"
import { SidebarContext } from "@/context/SidebarContext"
import { TopbarContext } from "@/context/TopbarContext"
import { useNullishContext } from "@/hooks/useNullishContext"
import useScrollPosition from "@/hooks/useScrollPosition"
import { TopbarActionButtons } from "@/layouts/Topbar/components/TopbarActionButtons"
import TopbarHeading from "@/layouts/Topbar/components/TopbarHeading"
import { Sidebar } from "@/types/sidebar/Sidebar"
import { Topbar } from "@/types/topbar/Topbar"
import { StringBuilder } from "@/util/StringBuilder"
import { ReactElement } from "react"
import { Link } from "react-router-dom"
import TopbarTitleSkeleton from "./components/TopbarTitleSkeleton"

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
 */
export const TopbarComponent = (): ReactElement => {
    const topbar: Topbar = useNullishContext(TopbarContext)
    const sidebar: Sidebar = useNullishContext(SidebarContext)
    const mainViewWidth: string = useNullishContext(MainViewWidthContext).mainViewWidth

    const scrollPosition: number = useScrollPosition(true)

    const TopbarHeadingTitle: ReactElement = <>{!topbar.isLoading ? topbar.title : <TopbarTitleSkeleton />}</>

    // The topbar for large screens (md+). Hidden on small screens.
    const TopbarLargeScreens: ReactElement = (
        <div className={StringBuilder.cn(
            "hidden transition-all duration-500 md:fixed z-20 bg-bg dark:bg-bg-dark md:flex justify-between items-center w-[calc(100%-7rem)] h-[5.5rem] pt-6 pb-2",
            mainViewWidth.length > 0 ? mainViewWidth : "md:max-w-[1000px]",
            [scrollPosition > 0, "shadow-[0_10px_5px_-5px_rgba(0,0,0,0.1)]"],
        )}>
            <div>
                {topbar.backButton.isVisible
                    ? topbar.backButton.path
                        ? <TopbarHeading location={topbar.backButton.path}>{TopbarHeadingTitle}</TopbarHeading>
                        : <TopbarHeading onClick={topbar.backButton.onClick}>{TopbarHeadingTitle}</TopbarHeading>
                    : <Heading style="ml-2">{TopbarHeadingTitle}</Heading>
                }
            </div>

            {TopbarActionButtons()}
        </div>
    )

    // The topbar for small screens. Hidden on large screens (md+).
    const TopbarSmallScreens: ReactElement = (
        <>
            <div className={StringBuilder.cn(
                "md:hidden w-full h-[4.5rem] pl-2 flex gap-4 justify-start items-center fixed z-20 bg-bg dark:bg-bg-dark transition-all duration-500",
                [scrollPosition > 0, "shadow-lg"],
            )}>
                {topbar.backButton.isVisible ? (
                    <Link
                        to={topbar.backButton.path ?? "#"}
                        onClick={topbar.backButton.onClick}
                        className="h-14 w-14 flex items-center justify-center rounded-full transition duration-300 hover:bg-secondary-200 dark:hover:bg-secondary-dark-200 active:scale-90 group cursor-pointer text-primary-200 dark:text-secondary-dark-900"
                    >
                        <IconButton>arrow_back</IconButton>
                    </Link>
                ) : (
                    <div
                        className="flex items-center p-4 rounded-full transition duration-300 hover:bg-secondary-200 dark:hover:bg-secondary-dark-200 active:scale-90 group cursor-pointer"
                        onClick={() => sidebar.configuration.isDrawerVisible(!sidebar.isDrawerVisible)}
                    >
                        <span className="material-symbols-rounded transition duration-300 group-hover:text-primary-200 dark:group-hover:text-primary-dark-100">
                            menu
                        </span>
                    </div>
                )}

                <div className="flex flex-1 justify-between items-center">
                    <div className={StringBuilder.cn(
                        "font-semibold text-primary-200 dark:text-secondary-dark-900 transition-all duration-300 text-xl w-[230px] whitespace-nowrap",
                        [topbar.truncate, "truncate"]
                    )}>
                        {TopbarHeadingTitle}
                    </div>

                    {TopbarActionButtons("flex items-center justify-end h-[4.5rem] pr-2")}
                </div>
            </div>

            <div className={"h-16 md:hidden"}></div>
        </>
    )

    return (
        <>
            {TopbarLargeScreens}
            {TopbarSmallScreens}
        </>
    )
}
