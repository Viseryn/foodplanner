/**********************************
 * ./assets/components/Buttons.js *
 **********************************/

import React from 'react';
import { Link } from 'react-router-dom';

/**
 * SubmitButton
 * 
 * A component that renders a submit-type button, e.g. for forms.
 * 
 * @component
 * @property {?string} style Can either be 'transparent' or 'inverse'. Default is 'primary'.
 * @property {?boolean} elevated If set to true, the button has a little shadow. Default is false.
 * @property {?string} icon The icon on the left of the button. Default is empty.
 * @property {?string} label The label of the button. Default is empty.
 * @param {*} buttonProps An optional object of properties of the <button /> element.
 * 
 * @example
 * <SubmitButton
 *     icon="update"
 *     label="Update"
 *     style="inverse"
 *     elevated={true}
 *     onClick={() => someHandler(params)}
 * />
 */
export function SubmitButton({style, elevated, icon, label, ...buttonProps}) {
    return (
        <button type="submit" className={buttonStyle(style, elevated)} {...buttonProps}>
            <ButtonContent icon={icon || ''} label={label || ''} />
        </button>
    );
}

/**
 * Button
 * 
 * A component that renders a link-type button.
 * 
 * @component
 * @property {?string} style Can either be 'transparent' or 'inverse'. Default is 'primary'.
 * @property {?boolean} elevated If set to true, the button has a little shadow. Default is false.
 * @property {?string} to The path of the button. Default is '#'.
 * @property {?string} icon The icon on the left of the button. Default is empty.
 * @property {?string} label The label of the button. Default is empty.
 * @param {*} buttonProps An optional object of properties of the <button /> element.
 * 
 * @example
 * <Button
 *     to="/recipe/add"
 *     icon="add"
 *     label="Add recipe"
 *     style="inverse"
 *     elevated={true}
 *     onClick={() => someHandler(params)}
 * />
 */
export default function Button({style, elevated, to, icon, label, ...buttonProps}) {
    return (
        <Link to={to || '#'} className={buttonStyle(style, elevated)} {...buttonProps}>
            <ButtonContent icon={icon || ''} label={label || ''} />
        </Link>
    );
}

/**
 * ButtonContent
 * 
 * Helper component for SubmitButton and Button.
 * 
 * @component
 * @property {?string} icon The icon on the left of the button. Default is empty.
 * @property {?string} label The label of the button. Default is empty.
 */
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

/**
 * buttonStyle
 * 
 * @param {string} style Can either be 'transparent' or 'inverse'. Default is 'primary'.
 * @param {boolean} elevated If set to true, the button has a little shadow. Default is false.
 * @returns 
 */
function buttonStyle(style = 'primary', elevated = false) {
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
