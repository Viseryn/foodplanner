/*******************************************
 * ./assets/components/ui/Notification.tsx *
 *******************************************/

import React from 'react';

/**
 * Notification
 * 
 * A component that renders a colored notification box
 * containing a message. 
 * 
 * @component
 * @property {string} title The title of the notification box.
 * @property {?string} color The color of the notification box. Default is gray.
 * @property {?string} icon The material-symbols-rounded identifier for the icon. Default is 'info'.
 * @property {*} children Any content under the title. Can be empty.
 * 
 * @example
 * <Notification color="red" icon="info" title="Error 404">
 *     The page you requested could not be found.
 * </Notification>
 */
export default function Notification(props) {
    let notificationStyle = 'p-6 space-x-4 text-sm rounded-xl w-full';

    if (props.color === 'red') {
        notificationStyle += ' text-notification-200 dark:text-notification-400 bg-notification-100 dark:bg-notification-300';
    } else if(props.color === 'green') {
        notificationStyle += ' text-tertiary-900 dark:text-tertiary-dark-900 bg-tertiary-100 dark:bg-tertiary-dark-100';
    } else {
        notificationStyle += ' text-notification-600 dark:text-notification-800 bg-notification-500 dark:bg-notification-700';
    }

    return (
        <div className={notificationStyle}>
            <div className="flex items-center">
                <span className="material-symbols-rounded mr-6">
                    {props.icon || 'info'}
                </span>
                <div>
                    <div className="font-semibold">{props.title}</div>

                    {props?.children !== undefined &&
                        <div className={props?.title !== undefined ? 'mt-2' : ''}>
                            {props.children}
                        </div>
                    }
                </div>
            </div>
        </div>
    );
}
