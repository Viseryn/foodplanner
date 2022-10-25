import React from 'react';

export default function Notification(props) {
    let notificationStyle = 'flex p-6 space-x-4 items-start text-sm rounded-3xl max-w-[400px]';

    if (props.color != '') {
        notificationStyle += ' text-' + props.color + '-700 bg-' + props.color + '-100';
    } else {
        notificationStyle += ' text-gray-900 bg-gray-100';
    }

    return (
        <div className="">
            <div className={notificationStyle}>
                <span className="material-symbols-rounded">{props.icon || 'info'}</span>
                <div>
                    {props.title != '' &&
                        <div className="font-bold mb-2 mt-[.125rem]">{props.title}</div>
                    }
                    <div>{props.message}</div>
                    <div className="mt-2 italic">
                        &rarr; info@yusel.net
                    </div>
                </div>
            </div>
        </div>
    );
}