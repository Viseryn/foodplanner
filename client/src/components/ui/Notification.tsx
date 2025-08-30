import { ReactElement } from "react"

/**
 * A component that renders a colored notification box containing a message.
 *
 * @component
 * @param props
 * @param props.title Optional: The title of the notification box.
 * @param props.color Optional: The color of the notification box. Default is 'gray'.
 * @param props.icon Optional: The Material Symbols identifier for the icon. Default is 'info'.
 * @param props.children Optional: The DOM children of the Notification component.
 *
 * @example
 * <Notification color="red" icon="info" title="Error 404">
 *     The page you requested could not be found.
 * </Notification>
 */
export default function Notification({ title, color = "gray", icon = "info", children }: {
    title?: string
    color?: "red" | "green" | "gray"
    icon?: string
    children?: React.ReactNode
}): ReactElement {
    let notificationStyle: string = "p-6 space-x-4 text-sm rounded-xl w-full"

    if (color === "red") {
        notificationStyle += " text-notification-200 dark:text-notification-400 bg-notification-100 dark:bg-notification-300"
    } else if (color === "green") {
        notificationStyle += " text-tertiary-900 dark:text-tertiary-dark-900 bg-tertiary-100 dark:bg-tertiary-dark-100"
    } else {
        notificationStyle += " text-notification-600 dark:text-notification-800 bg-notification-500 dark:bg-notification-700"
    }

    return <div className={notificationStyle}>
        <div className="flex items-center">
            <span className="material-symbols-rounded mr-6">
                {icon}
            </span>
            <div>
                {title && <div className="font-semibold">{title}</div>}

                {children &&
                    <div className={title ? "mt-2" : ""}>
                        {children}
                    </div>
                }
            </div>
        </div>
    </div>
}
