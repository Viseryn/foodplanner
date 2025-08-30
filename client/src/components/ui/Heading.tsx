import { ReactElement } from "react"

/**
 * A component that renders a heading with variable size.
 *
 * @component
 * @param props
 * @param props.size Optional: The size of the heading. Default is '3xl'.
 * @param props.style Optional: Additional styling classes.
 * @param props.children The DOM children of the Heading component.
 *
 * @example <Heading size="xl" style="mb-6">This is a title</Heading>
 */
export default function Heading({ size = "3xl", style = "", children }: {
    size?: string
    style?: string
    children: React.ReactNode
}): ReactElement {
    return <div className={`text-${size} font-semibold text-primary-200 dark:text-secondary-dark-900 ${style}`}>
        {children}
    </div>
}

/** @deprecated Use Heading with size="lg" instead. */
export function SubHeading({ style = "", children }: {
    style?: string
    children: React.ReactNode
}): ReactElement {
    return <Heading size="lg" style={style}>{children}</Heading>
}

/** @deprecated Use Heading with size="xl" instead. */
export function SecondHeading({ style = "", children }: {
    style?: string
    children: React.ReactNode
}): ReactElement {
    return <Heading size="xl" style={style}>{children}</Heading>
}
