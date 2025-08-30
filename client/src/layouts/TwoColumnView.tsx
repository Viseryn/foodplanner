import { ReactElement, ReactNode } from "react"

/**
 * Renders two child components in two neighbored columns with a gap of 4.
 * On small screens, the columns will be on top of each other.
 *
 * @component
 * @example
 * <TwoColumnView>
 *     <Card ... />
 *     <Card ... />
 * </TwoColumnView>
 */
export const TwoColumnView = ({ children, className, overrideClassname }: {
    children?: ReactNode,
    className?: string,
    overrideClassname?: string,
}): ReactElement => {
    return (
        <div className={overrideClassname ?? `grid grid-cols-1 md:grid-cols-2 gap-4 ${className}`}>
            {children}
        </div>
    )
}
