/*******************************************
 * ./assets/components/ui/Notification.tsx *
 *******************************************/

import React from 'react'

/**
 * Notification
 * 
 * A component that renders a colored notification box
 * containing a message. 
 * 
 * @component
 * @param props
 * @param props.title The title of the notification box.
 * @param props.color The color of the notification box. Default is gray.
 * @param props.icon The Material Symbols identifier for the icon. Default is 'info'.
 * @param props.children The DOM children of the Notification component.
 * 
 * @example
 * <Notification color="red" icon="info" title="Error 404">
 *     The page you requested could not be found.
 * </Notification>
 */
export default function Notification({ title, color = '', icon = 'info', children }: {
    title?: string
    color?: string
    icon?: string
    children: React.ReactNode
}): JSX.Element {
    let notificationStyle: string = 'p-6 space-x-4 text-sm rounded-xl w-full'

    if (color === 'red') {
        notificationStyle += ' text-notification-200 dark:text-notification-400 bg-notification-100 dark:bg-notification-300'
    } else if(color === 'green') {
        notificationStyle += ' text-tertiary-900 dark:text-tertiary-dark-900 bg-tertiary-100 dark:bg-tertiary-dark-100'
    } else {
        notificationStyle += ' text-notification-600 dark:text-notification-800 bg-notification-500 dark:bg-notification-700'
    }

    return <div className={notificationStyle}>
        <div className="flex items-center">
            <span className="material-symbols-rounded mr-6">
                {icon}
            </span>
            <div>
                <div className="font-semibold">{title}</div>

                {children !== undefined &&
                    <div className={title !== undefined ? 'mt-2' : ''}>
                        {children}
                    </div>
                }
            </div>
        </div>
    </div>
}
