/*********************************************
 * ./assets/components/ui/Buttons/Button.tsx *
 *********************************************/

import React from 'react'
import { Link } from 'react-router-dom'

/**
 * A component that renders a button. Depending on the type argument, can be either a submit button 
 * or a link button. The role argument determines the color of the Button. Primary buttons are dark 
 * green with light font color, while secondary buttons are light green with darker font color. 
 * Tertiary buttons are transparent, so they appear almost as links. 
 * 
 * @component
 * @param props
 * @param props.style Additional styling classes.
 * @param props.type For submit buttons, set this to 'submit'. Default is 'link'.
 * @param props.role Can be 'primary' (default), 'secondary' or 'tertiary'.
 * @param props.location The path of the button. Default is '#'.
 * @param props.icon The icon on the left of the button. Default is empty.
 * @param props.label The label of the button. Default is empty.
 * @param props.title A title that is shown when hovering the button.
 * @param props.outlined Whether the icon should only have outlines. Default is false.
 * @param props.elevated Deprecated: Use isElevated instead.
 * @param props.isElevated If set to true, the button has a little shadow. Default is false.
 * @param props.floating Deprecated: Use isFloating instead.
 * @param props.isFloating If set to true, the button will float above the rest of the UI and is fixed at the bottom. Default is false.
 * @param props.small Deprecated: Use isSmall instead.
 * @param props.isSmall If set to true, the button has a little less height. Default is false.
 * @param props.onClick An onClick handler function.
 * 
 * @example
 * <Button
 *     location="/recipe/add"
 *     icon="add"
 *     label="Add recipe"
 *     role="secondary"
 *     isElevated={true}
 *     onClick={() => someHandler(params)}
 * />
 */
export default function Button({ 
    style, type = 'link', role = 'primary', location = '#', icon, label, title = '', 
    outlined, elevated, isElevated, floating, isFloating, small, isSmall, onClick 
}: ButtonOptions): JSX.Element {
    // Generate styling classes for the button
    const stylingClasses: string = buttonStyle(
        role, 
        elevated || isElevated, 
        small || isSmall, 
        floating || isFloating, 
        label
    ) + (style ? ' ' + style : '')

    // Props for the button/Link component
    const componentProps = {
        title: title,
        onClick: onClick,
        className: stylingClasses,
    }

    return type === 'submit' ? (
        <button type="submit" {...componentProps}>
            <ButtonContent icon={icon} label={label} outlined={outlined} />
        </button>
    ) : (
        <Link to={location } {...componentProps}>
            <ButtonContent icon={icon} label={label} outlined={outlined} />
        </Link>
    )
}

/**
 * PRIVATE: Helper component for Button.
 * 
 * @component
 * @param props
 * @param props.icon The icon on the left of the button. Default is empty.
 * @param props.label The label of the button. Default is empty.
 * @param props.outlined Whether the icon should only have outlines. Default is false.
 */
function ButtonContent({ icon, label, outlined }: {
    icon?: string
    label?: string
    outlined?: boolean
}): JSX.Element {
    return <>
        {icon && <span className={'material-symbols-rounded' + (outlined ? ' outlined' : '')}>
            {icon}
        </span>} 
        
        {label && (
            icon != '' 
                ? <span className="mr-2 ml-3">{label}</span>
                : <span className="mx-2">{label}</span>
            )
        }
    </>
}

/**
 * Returns the appropriate styling classes for the given parameters.
 * 
 * @param role The role of the button.
 * @param isElevated Optional: Whether the button is elevated.
 * @param isSmall Optional: Whether the button is small.
 * @param isFloating Optional: Whether the button is floating.
 * @param label Optional: The label of the button.
 * @returns The styling classes for the button.
 */
const buttonStyle = (
    role: ButtonRole,
    isElevated?: boolean,
    isSmall?: boolean,
    isFloating?: boolean,
    label?: string,
): string => {
    const styles: { [x: string]: string } = {
        base: 'rounded-full font-semibold transition duration-300 flex items-center active:scale-95',
        primary: 'text-white bg-primary-100 dark:bg-primary-dark-200 hover:bg-primary-200 dark:hover:bg-primary-100 active:bg-primary-200 dark:active:bg-primary-100',
        secondary: 'text-primary-100 dark:text-primary-dark-100 bg-secondary-200 dark:bg-secondary-dark-200 hover:bg-secondary-300 dark:hover:bg-secondary-dark-300',
        tertiary: 'text-primary-100 dark:text-primary-dark-100 hover:bg-secondary-200 dark:hover:bg-secondary-dark-200',
        withLabel: 'h-12 px-4 text-base',
        noLabel: 'p-2',
        elevated: 'shadow-xl active:shadow-xl',
        elevatedTertiary: 'border border-gray-100 dark:border-[#252f38]',
        floating: 'fixed bottom-[6.5rem] right-6 md:right-0 z-[60] md:relative md:bottom-0 !text-primary-100 !dark:text-primary-dark-100 !bg-secondary-200 !dark:bg-secondary-dark-200 !hover:bg-secondary-300 !dark:hover:bg-secondary-dark-300 !rounded-2xl !h-14 !shadow-xl',
        small: 'h-10 px-3',
    }

    let style: string = styles.base + ' ' + styles?.[role]

    if (isElevated) {
        style += ' ' + styles.elevated
        style += (role === 'tertiary') ? ' ' + styles.elevatedTertiary : ''
    }

    style += ' '
    style += (label && !isSmall) ? styles.withLabel : styles.noLabel
    style += (isSmall) ? ' ' + styles.small : ''
    style += (isFloating) ? ' ' + styles.floating : ''

    return style
}

/**
 * Type specifications for Button components
 */

/** Whether a Button is a Submit Button or a Link Button. */
type ButtonType = 'submit' | 'link'

/** Whether a Button is a primary, secondary or tertiary button. */
type ButtonRole = 'primary' | 'secondary' | 'tertiary'

/** Type for Button props. */
type ButtonOptions = {
    style?: string
    type?: ButtonType
    role?: ButtonRole
    location?: string
    icon?: string
    label?: string
    title?: string
    outlined?: boolean
    /** @deprecated Use isElevated instead. */
    elevated?: boolean
    isElevated?: boolean
    /** @deprecated Use isFloating instead. */
    floating?: boolean
    isFloating?: boolean
    /** @deprecated Use isSmall instead. */
    small?: boolean
    isSmall?: boolean
    onClick?: () => void
}