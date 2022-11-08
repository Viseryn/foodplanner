/******************************************
 * ./assets/components/ui/Notification.js *
 ******************************************/

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
    let notificationStyle = 'p-6 space-x-4 text-sm rounded-3xl w-full';

    if (props.color !== undefined) {
        notificationStyle += ' text-' + props.color + '-700 dark:text-gray-200 bg-' + props.color + '-200 dark:bg-' + props.color + '-900';
    } else {
        notificationStyle += ' text-gray-900 dark:text-gray-100 bg-gray-200 dark:bg-gray-900';
    }

    return (
        <div className={notificationStyle}>
            {/* <div className="text-red-700 text-green-700 text-yellow-700 text-blue-700 bg-red-200 bg-green-200 bg-yellow-200 bg-blue-200 dark:bg-red-900 dark:bg-green-900 dark:bg-yellow-900 dark:bg-blue-900"></div> */}
            <div className="flex items-center">
                <span className="material-symbols-rounded mr-6">
                    {props.icon || 'info'}
                </span>
                <div>
                    <div className="font-semibold">{props.title}</div>

                    {props?.children !== undefined &&
                        <div className="mt-2">
                            {props.children}
                        </div>
                    }
                </div>
            </div>
        </div>
    );
}
