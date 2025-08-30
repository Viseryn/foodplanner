import { SidebarContext } from "@/context/SidebarContext"
import { useNullishContext } from "@/hooks/useNullishContext"
import { NotificationDot } from "@/layouts/Sidebar/components/NotificationDot"
import { NotificationDot as NotificationDotData } from "@/types/NotificationDot"
import { Sidebar } from "@/types/sidebar/Sidebar"
import { ReactElement } from "react"
import { Link } from "react-router-dom"

type SidebarItemProps = {
    /** The id of the component this sidebar item should link to. */
    id: string
    icon: string
    label: string
}

/**
 * A component that renders a single sidebar item, i.e. a <code>&lt;li&gt;</code> element that contains an icon and a label.
 */
export const SidebarItem = (props: SidebarItemProps): ReactElement => {
    const { id, icon, label } = props

    const sidebar: Sidebar = useNullishContext(SidebarContext)
    const notificationDotValue: number = sidebar.notificationDots.find((notificationDot: NotificationDotData) => notificationDot.item === id)?.value ?? 0

    return (
        <li>
            <Link to={"/" + id} className={
                "relative group transition duration-300 md:flex md:items-center md:p-4 md:rounded-full md:hover:bg-secondary-200 dark:md:hover:bg-secondary-dark-200 md:active:scale-90 "
                + (sidebar.activeItem === id ? "md:bg-secondary-200 dark:md:bg-secondary-dark-200" : "")
            }>
                {notificationDotValue > 0 &&
                    <NotificationDot value={notificationDotValue} />
                }

                <div className={
                    "transition duration-300 group-hover:text-primary-200 dark:group-hover:text-primary-dark-100 flex flex-col md:flex-row items-center "
                    + (sidebar.activeItem === id ? "text-primary-200 dark:text-primary-dark-100" : "")
                }>
                    <span className={
                        "material-symbols-rounded transition-[background-color] duration-300 rounded-full h-8 w-16 md:h-auto md:w-auto flex md:block justify-center items-center group-hover:bg-secondary-200 dark:group-hover:bg-secondary-dark-200 md:group-hover:bg-transparent dark:md:group-hover:bg-transparent "
                        + (sidebar.activeItem === id
                                ? "bg-secondary-200 dark:bg-secondary-dark-200 md:bg-transparent dark:md:bg-transparent "
                                : "outlined "
                        )
                    }>
                        {icon}
                    </span>

                    <span className="font-semibold mt-1 text-xs md:mt-0 md:ml-4 md:hidden xl:block xl:text-base">
                        {label}
                    </span>
                </div>
            </Link>
        </li>
    )
}
