import { ReactElement } from "react"
import { Link } from "react-router-dom"

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
 * @param props.role Can be 'primary' (default), 'secondary', 'tertiary' or 'disabled'.
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
 * @param props.isIconRight Whether the icon should be on the right side of the button. Default is false.
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
 *
 * @deprecated
 */
export default function Button({
                                   className, type = "link", role = "primary", location = "#", icon, label, title = "",
                                   outlined, elevated, isElevated, floating, isFloating, small, isSmall, onClick, isIconRight,
                                   roundedLeft = true, roundedRight = true,
                               }: ButtonOptions): ReactElement {
    // Generate styling classes for the button
    const stylingClasses: string = buttonStyle(
        role,
        elevated || isElevated,
        small || isSmall,
        floating || isFloating,
        label,
        roundedLeft,
        roundedRight,
    ) + (className ? " " + className : "")

    // Props for the button/Link component
    const componentProps = {
        title: title,
        onClick: role === "disabled" ? (() => {
        }) : onClick,
        className: stylingClasses,
    }

    return type === "submit" && role !== "disabled" ? (
        <button type="submit" {...componentProps}>
            <ButtonContent icon={icon} label={label} outlined={outlined} isIconRight={isIconRight} />
        </button>
    ) : (
        <Link to={role === "disabled" ? "#" : location} {...componentProps}>
            <ButtonContent icon={icon} label={label} outlined={outlined} isIconRight={isIconRight} />
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
 * @param props.isIconRight Whether the icon should be on the right side of the button. Default is false.
 */
function ButtonContent({ icon, label, outlined, isIconRight }: {
    icon?: string
    label?: string
    outlined?: boolean
    isIconRight?: boolean
}): ReactElement {
    const iconLeftElement: ReactElement = (
        <>
            {icon && <span className={"material-symbols-rounded" + (outlined ? " outlined" : "")}>
                {icon}
            </span>}

            {label && (
                icon != ""
                    ? <span className="mr-2 ml-3">{label}</span>
                    : <span className="mx-2">{label}</span>
            )}
        </>
    )

    const iconRightElement: ReactElement = (
        <>
            {label && (
                icon != ""
                    ? <span className="mr-3 ml-2">{label}</span>
                    : <span className="mx-2">{label}</span>
            )}

            {icon && <span className={"material-symbols-rounded" + (outlined ? " outlined" : "")}>
                {icon}
            </span>}
        </>
    )

    return isIconRight ? iconRightElement : iconLeftElement
}

/**
 * Returns the appropriate styling classes for the given parameters.
 *
 * @param role The role of the button.
 * @param isElevated Optional: Whether the button is elevated.
 * @param isSmall Optional: Whether the button is small.
 * @param isFloating Optional: Whether the button is floating.
 * @param label Optional: The label of the button.
 * @param roundedLeft
 * @param roundedRight
 * @returns The styling classes for the button.
 */
const buttonStyle = (
    role: ButtonRole,
    isElevated?: boolean,
    isSmall?: boolean,
    isFloating?: boolean,
    label?: string,
    roundedLeft?: boolean,
    roundedRight?: boolean,
): string => {
    const styles: { [x: string]: string } = {
        base: "font-semibold transition duration-300 flex items-center active:scale-95",
        primary: "text-white bg-primary-100 dark:bg-primary-dark-200 md:hover:bg-primary-200 dark:md:hover:bg-primary-100 --active:bg-primary-200" +
            " --dark:active:bg-primary-100",
        secondary: "text-primary-100 dark:text-primary-dark-100 bg-secondary-200 dark:bg-secondary-dark-200 md:hover:bg-secondary-300 dark:md:hover:bg-secondary-dark-300",
        tertiary: "text-primary-100 dark:text-primary-dark-100 md:hover:bg-secondary-200 dark:md:hover:bg-secondary-dark-200",
        withLabel: "min-h-12 px-4 py-2 text-base",
        noLabel: "p-2",
        elevated: "shadow-xl active:shadow-xl",
        elevatedTertiary: "border border-gray-100 dark:border-[#252f38]",
        floating: "fixed bottom-[6.5rem] right-6 md:right-0 z-[60] md:relative md:bottom-0 !text-tertiary-900 dark:!text-tertiary-dark-900 " +
            "!bg-tertiary-100 dark:!bg-tertiary-dark-100 !rounded-2xl !h-14 !shadow-xl",
        small: "h-10 px-3",
        disabled: "text-notification-600 dark:text-notification-800 bg-notification-500 dark:bg-notification-600 active:!scale-100 cursor-text",
    }

    let style: string = styles.base + " " + styles?.[role]

    if (isElevated) {
        style += " " + styles.elevated
        style += (role === "tertiary") ? " " + styles.elevatedTertiary : ""
    }

    style += " "
    style += (label && !isSmall) ? styles.withLabel : styles.noLabel
    style += (isSmall) ? " " + styles.small : ""
    style += (isFloating) ? " " + styles.floating : ""
    style += (roundedLeft) ? " rounded-l-[2rem]" : " rounded-l-lg"
    style += (roundedRight) ? " rounded-r-[2rem]" : " rounded-r-lg"

    return style
}

/**
 * Type specifications for Button components
 */

/** Whether a Button is a Submit Button or a Link Button. */
type ButtonType = "submit" | "link"

/** Whether a Button is a primary, secondary or tertiary button. */
type ButtonRole = "primary" | "secondary" | "tertiary" | "disabled"

/** Type for Button props. */
type ButtonOptions = {
    className?: string
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
    onClick?: (() => void) | (() => Promise<void>)
    isIconRight?: boolean
    roundedLeft?: boolean
    roundedRight?: boolean
}
