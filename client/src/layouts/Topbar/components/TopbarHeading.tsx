import IconButton from "@/components/ui/Buttons/IconButton"
import Heading from "@/components/ui/Heading"
import { ReactElement } from "react"
import { Link } from "react-router-dom"

/**
 * A component that renders a huge heading and a back button.
 *
 * @component
 * @param props
 * @param props.location Optional: The location that the back button navigates to.
 * @param props.onClick Optional: An onClick handler callback for the back button.
 * @param props.children The DOM children of the Heading component.
 */
export default function TopbarHeading({ location = '#', onClick = () => {}, children }: {
    location?: string
    onClick?: () => void
    children?: React.ReactNode
}): ReactElement {
    return <div className="flex justify-start items-center">
        <div className="flex justify-between">
            <Link to={location} onClick={onClick} className="mr-4 text-primary-200 dark:text-secondary-dark-900">
                <IconButton>arrow_back</IconButton>
            </Link>
        </div>

        <Heading>{children}</Heading>
    </div>
}
