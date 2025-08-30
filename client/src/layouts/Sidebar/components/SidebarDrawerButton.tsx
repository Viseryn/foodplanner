import { SidebarContext } from "@/context/SidebarContext"
import { useNullishContext } from "@/hooks/useNullishContext"
import { Sidebar } from "@/types/sidebar/Sidebar"
import { ReactElement } from "react"

type SidebarDrawerButtonProps = {
    /** Optional: Additional styling classes for the <li> element. */
    style?: string
    /** Optional: The icon of the menu button. Default is 'menu'. */
    icon?: string
}

/**
 * A component that renders a menu button that toggles the sidebar drawer.
 */
export const SidebarDrawerButton = ({ style = "", icon = "menu" }: SidebarDrawerButtonProps): ReactElement => {
    const sidebar: Sidebar = useNullishContext(SidebarContext)

    return (
        <li className={`xl:w-min ${style}`}>
            <div
                className="flex items-center p-4 rounded-full transition duration-300 hover:bg-secondary-200 dark:hover:bg-secondary-dark-200 active:scale-90 group cursor-pointer"
                onClick={() => sidebar.configuration.isDrawerVisible(!sidebar.isDrawerVisible)}
            >
                <span className="material-symbols-rounded transition duration-300 group-hover:text-primary-200 dark:group-hover:text-primary-dark-100">
                    {icon}
                </span>
            </div>
        </li>
    )
}
