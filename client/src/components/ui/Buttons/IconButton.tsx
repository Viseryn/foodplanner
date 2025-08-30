import { ReactElement } from "react"

/**
 * A component that renders a button with only an icon, for example for the topbar.
 *
 * @deprecated
 *
 * @component
 * @param props
 * @param props.outlined Whether the icon should be only outlines (true) or filled (false, by default).
 * @param props.style Additional styling classes.
 * @param props.onClick An optional onClick handler.
 * @param props.children The Material Symbols identifier for the icon.
 *
 * @example <IconButton outlined={true} onClick={() => someHandler(params)}>sync</IconButton>
 */
export default function IconButton({ outlined = false, style = "", onClick, disabled = false, children }: {
    outlined?: boolean
    style?: string
    onClick?: () => void
    disabled?: boolean
    children: string
}): ReactElement {
    if (disabled) {
        return <span className={`material-symbols-rounded cursor-not-allowed transition duration-300 ${outlined ? "outlined" : ""} p-2 text-secondary-900/50 dark:text-secondary-dark-900/30 ${style}`}>
            {children}
        </span>
    }

    return <span
        onClick={onClick}
        className={
            "material-symbols-rounded cursor-pointer transition duration-300 md:hover:bg-secondary-200 dark:md:hover:bg-secondary-dark-200 p-2 rounded-full"
            + (outlined ? " outlined" : "")
            + " " + style
        }
    >
        {children}
    </span>
}
