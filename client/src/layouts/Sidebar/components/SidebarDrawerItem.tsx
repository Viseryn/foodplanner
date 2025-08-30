import { ReactElement } from "react"
import { Link } from "react-router-dom"

type SidebarDrawerItemProps = {
    id: string
    icon: string
    label: string
    path?: string
    onClick?: () => void
}

/**
 * A component that renders a single sidebar drawer item.
 *
 * @component
 * @param props
 * @param props.id The id of the component this sidebar item should link to. Default is '/'. Will be overriden if path is set.
 * @param props.icon The icon of the sidebar item.
 * @param props.label The label of the sidebar item.
 * @param props.path An external URL.
 * @param props.onClick An optional onClick handler, if no path was provided.
 */
export const SidebarDrawerItem = (props: SidebarDrawerItemProps): ReactElement => {
    const { id, icon, label, path, onClick } = props

    const linkLocation: string = onClick != null ? "#" : `/${id}`

    const onClickHandler = (): void => {
        if (onClick != null) {
            onClick()
        }
    }

    const SidebarDrawerItemContent = (
        <div className="transition duration-300 group-hover:text-primary-200 dark:group-hover:text-primary-dark-100 flex flex-row items-center">
            <span className="material-symbols-rounded rounded-full">{icon}</span>
            <span className="font-semibold ml-4">{label}</span>
        </div>
    )

    return (
        <li>
            {path ? (
                <a
                    href={path}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group transition duration-300 flex items-center p-4 rounded-full hover:bg-secondary-200 dark:hover:bg-secondary-dark-200 active:scale-90"
                >
                    {SidebarDrawerItemContent}
                </a>
            ) : (
                <Link
                    to={linkLocation}
                    onClick={onClickHandler}
                    className="group transition duration-300 flex items-center p-4 rounded-full hover:bg-secondary-200 dark:hover:bg-secondary-dark-200 active:scale-90"
                >
                    {SidebarDrawerItemContent}
                </Link>
            )}
        </li>
    )
}
