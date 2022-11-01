import React from 'react';

export default function Notification(props) {
    let notificationStyle = 'p-6 space-x-4 text-sm rounded-3xl w-full';

    if (props.color !== undefined) {
        notificationStyle += ' text-' + props.color + '-700 dark:text-gray-200 bg-' + props.color + '-200 dark:bg-' + props.color + '-900';
    } else {
        notificationStyle += ' text-gray-900 dark:text-gray-100 bg-gray-200 dark:bg-gray-900';
    }

    return (
        <div className={notificationStyle}>
            <div className="flex items-center">
                <span className="material-symbols-rounded mr-6">
                    {props.icon || 'info'}
                </span>
                <div>
                    <div className="font-semibold">{props.children}</div>

                    {props?.message !== undefined &&
                        <div className="mt-2">
                            {props.message}
                        </div>
                    }
                </div>
            </div>
        </div>
    );
}