import React from 'react';
import { Link } from 'react-router-dom';

function buttonStyle(style, elevated = false) {
    // let baseStyle = 'rounded-full h-12 px-4 font-semibold text-md transition duration-300 flex items-center active:scale-95 ';
    // let primaryStyle = ' text-white bg-blue-500 hover:bg-blue-700 active:bg-blue-500';
    // let inverseStyle = ' text-blue-600 bg-gray-100 hover:bg-blue-200 active:bg-blue-300 active:text-blue-800';
    // let transparentStyle = ' text-blue-600 hover:bg-blue-100 active:bg-blue-200 active:text-blue-800';
    let baseStyle = 'rounded-full h-12 px-4 font-semibold text-md transition duration-300 flex items-center active:scale-95';
    let primaryStyle = ' text-white dark:text-blue-300 bg-blue-500 dark:bg-[#1D252C] hover:bg-blue-700 dark:hover:bg-[#1D252C]/[.6] active:bg-blue-500';
    let inverseStyle = ' text-blue-600 dark:text-blue-300 bg-gray-100 dark:bg-transparent hover:bg-gray-200 dark:hover:bg-[#1D252C] active:text-blue-800';
    let transparentStyle = ' text-blue-600 dark:text-blue-300 hover:bg-gray-100 dark:hover:bg-[#1D252C] active:bg-gray-200 active:text-blue-800';
    let elevatedStyle = ' shadow-md active:shadow-xl';

    let buttonStyle = baseStyle;

    switch (style) {
        case 'inverse':
            buttonStyle += inverseStyle;
            break;
        case 'transparent':
            buttonStyle += transparentStyle;
            break;
        default:
            buttonStyle += primaryStyle;
    }

    if (elevated) {
        buttonStyle += elevatedStyle;
    }

    return buttonStyle;
}

function ButtonContent(props) {
    return(
        <>
            {props.icon != '' &&
                <span className="label-icon material-symbols-rounded">{props.icon}</span>
            } 
            
            {props.label != '' &&
                <>
                    {props.icon != '' 
                        ? <span className="label-content mr-2 ml-3">{props.label}</span>
                        : <span className="label-content mr-2 ml-2">{props.label}</span>
                    }
                </>
            }
        </>
    );
}

export function SubmitButton({style, elevated, to, icon, label, ...buttonProps}) {
    return (
        <button type="submit" className={buttonStyle(style, elevated)} {...buttonProps}>
            <ButtonContent icon={icon || ''} label={label || ''} />
        </button>
    );
}

export default function Button({style, elevated, to, icon, label, ...buttonProps}) {
    return (
        <Link to={to || '#'} className={buttonStyle(style, elevated)} {...buttonProps}>
            <ButtonContent icon={icon || ''} label={label || ''} />
        </Link>
    );
}
