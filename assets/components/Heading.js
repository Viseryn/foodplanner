import React, {Component} from 'react';

export default function Heading(props) {
    return (
        <div className="text-3xl font-semibold text-blue-600 dark:text-gray-100 mb-10">
            {props.title || ''} 
            {props.children}
        </div>
    );
}

export function SubHeading(props) {
    return (
        <div className="text-lg font-semibold text-blue-600 dark:text-gray-100 mb-10">
            {props.children}
        </div>
    );
}
