import { SidebarContext } from "@/context/SidebarContext"
import { useNullishContext } from "@/hooks/useNullishContext"
import useScrollDirection from "@/hooks/useScrollDirection"
import useScrollPosition from "@/hooks/useScrollPosition"
import { Sidebar } from "@/types/sidebar/Sidebar"
import { SidebarActionButtonConfiguration } from "@/types/sidebar/SidebarActionButtonConfiguration"
import { ReactElement } from "react"
import { Link } from "react-router-dom"

type SidebarActionButtonProps = {
    /** Set true for being displayed expanded and floating in the bottom-right corner. Set false for an SAB integrated in the sidebar. */
    floating?: boolean
}

/**
 * A component that renders the sidebar action button (SAB). On larger screens, it is fixed in the
 * top of the sidebar. On small screens it is a floating action button in the bottom-right corner
 * of the screen. By default, it is invisible.
 */
export const SidebarActionButton = (props: SidebarActionButtonProps): ReactElement => {
    const { floating } = props

    const sidebar: Sidebar = useNullishContext(SidebarContext)
    const sidebarActionButton: SidebarActionButtonConfiguration = sidebar.actionButton

    // Make the SAB label visible when the user scrolls up or is at top/bottom of page
    const scrollDirection = useScrollDirection()
    const scrollPosition = useScrollPosition()
    const isAtBottom = scrollPosition >= document.body.scrollHeight - 50 // Add some buffer
    const isLabelVisible = scrollDirection === "up" || window.pageYOffset === 0 || (scrollDirection === "down" && isAtBottom)

    // SAB styling classes
    const styles = {
        base: "flex items-center p-4 rounded-2xl transition duration-300 h-14"
            + " text-tertiary-900 dark:text-tertiary-dark-900 bg-tertiary-100 dark:bg-tertiary-dark-100 hover:bg-tertiary-200"
            + " dark:hover:bg-tertiary-dark-200 active:scale-90",
        smSize: " shadow-xl transition-all duration-300 overflow-hidden",
        smSizeReduced: " max-w-[56px]",
        smSizeExpanded: " max-w-[250px]",
        label: "pl-4 font-semibold whitespace-nowrap",
    }

    // Build styling class for the button itself (the <Link /> element). If the configuration 
    // sidebarActionButton.visible === false, then the element is just hidden. Otherwise, use the 
    // base styling. For a floating action button (i.e., on small screens), we add the styling 
    // styles.smSize. The label is hidden when scrolling down, so we animate the width of the action 
    // button with the two stylings styles.smSizeExpanded and styles.smSizeReduced.
    const buttonStyle = !sidebarActionButton?.isVisible
        ? "hidden"
        : styles.base + (floating
            ? styles.smSize + (isLabelVisible
            ? styles.smSizeExpanded
            : styles.smSizeReduced)
            : ""
    )

    // Build styling class for the label.
    // For a non-floating action button (i.e., on larger screens), 
    // the label only becomes visible at xl-size screens.
    const labelStyle = styles.label + (!floating ? " hidden xl:block" : "")

    return (
        <li className="h-14">
            <Link
                to={sidebarActionButton.path || "#"}
                onClick={sidebarActionButton?.onClick}
                className={buttonStyle}
            >
                <span className="material-symbols-rounded">{sidebarActionButton?.icon}</span>
                <span className={labelStyle}>{sidebarActionButton?.label}</span>
            </Link>
        </li>
    )
}
