/********************************************
 * ./assets/components/ui/Buttons/Button.js *
 ********************************************/

import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Button
 * 
 * A component that renders a button. Depending on the type argument,
 * can be either a submit button or a link button.
 * 
 * @component
 * @property {?string} style Additional styling classes.
 * @property {?string} type For submit buttons, set this to 'submit'. Empty by default.
 * @property {?string} role Can be 'primary' (default), 'secondary' or 'tertiary'.
 * @property {?boolean} elevated If set to true, the button has a little shadow. Default is false.
 * @property {?string} location The path of the button. Default is '#'.
 * @property {?string} icon The icon on the left of the button. Default is empty.
 * @property {?string} label The label of the button. Default is empty.
 * @property {?string} title A title that is shown when hovering the button.
 * @property {?boolean} outlined Whether the icon should only have outlines. Default is false.
 * @property {?boolean} floating If set to true, the button will float above the rest of the UI and is fixed at the bottom. Default is false.
 * @property {?boolean} small If set to true, the button has a little less height. Default is false.
 * @property {?function} onClick An onClick handler function.
 * @param {*} props An optional object of properties of the <button /> element.
 * 
 * @example
 * <Button
 *     location="/recipe/add"
 *     icon="add"
 *     label="Add recipe"
 *     role="secondary"
 *     elevated={true}
 *     onClick={() => someHandler(params)}
 * />
 */
export default function Button({ style = '', type = '', ...props }) {
    const stylingClasses = buttonStyle(props) + (style ? ' ' + style : '');
    const generalProps = {
        title: props.title || '',
        onClick: props.onClick,
        className: stylingClasses,
    };

    return (
        type === 'submit' ? (
            <button type="submit" {...generalProps}>
                <ButtonContent {...props} />
            </button>
        ) : (
            <Link to={props.location || '#'} {...generalProps}>
                <ButtonContent {...props} />
            </Link>
        )
    );
}

/**
 * ButtonContent
 * 
 * Helper component for Button.
 * 
 * @component
 * @property {?string} icon The icon on the left of the button. Default is empty.
 * @property {?string} label The label of the button. Default is empty.
 * @property {?boolean} outlined Whether the icon should only have outlines. Default is false.
 */
function ButtonContent(props) {
    return (
        <>
            {props.icon &&
                <span className={'material-symbols-rounded' + (props.outlined ? ' outlined' : '')}>
                    {props.icon}
                </span>
            } 
            
            {props.label &&
                <>
                    {props.icon != '' 
                        ? <span className="mr-2 ml-3">{props.label}</span>
                        : <span className="mx-2">{props.label}</span>
                    }
                </>
            }
        </>
    );
}

/**
 * buttonStyle
 * 
 * Returns the appropriate styling classes for the given parameters.
 * 
 * @param {string} role Can be 'primary' (default), 'secondary' or 'tertiary'.
 * @param {boolean} elevated False by default.
 * @returns 
 */
const buttonStyle = ({
    role = 'primary',
    elevated = false,
    ...props
}) => {
    const styles = {
        base: 'rounded-full font-semibold transition duration-300 flex items-center active:scale-95',
        primary: 'text-white dark:text-blue-100 bg-blue-500 dark:bg-blue-800 hover:bg-blue-700 dark:hover:bg-blue-900 active:bg-blue-500 dark:active:bg-blue-700',
        secondary: 'text-blue-600 dark:text-blue-300 bg-gray-100 dark:bg-[#1D252C] hover:bg-blue-100 dark:hover:bg-[#1D252C]/[.5] active:bg-blue-300 active:text-blue-800',
        tertiary: 'text-blue-600 dark:text-blue-300 hover:bg-gray-100 dark:hover:bg-[#1D252C] active:bg-gray-200 active:text-blue-800',
        withLabel: 'h-12 px-4 text-base',
        noLabel: 'p-2',
        elevated: 'shadow-lg active:shadow-xl',
        elevatedTertiary: 'border border-gray-100 dark:border-[#252f38]',
        floating: 'fixed bottom-[6.5rem] z-[60] md:relative md:bottom-0',
        small: 'h-10 px-3 -text-sm',
    };

    let style = styles.base + ' ' + styles[role];

    if (elevated) {
        style += ' ' + styles.elevated;
        style += (role === 'tertiary') ? ' ' + styles.elevatedTertiary : '';
    }

    style += ' ';
    style += (props.label && !props.small) ? styles.withLabel : styles.noLabel;
    style += (props.small) ? ' ' + styles.small : '';
    style += (props.floating) ? ' ' + styles.floating : '';

    return style;
};
