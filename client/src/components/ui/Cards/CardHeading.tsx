import { ReactElement, ReactNode } from "react"

type CardHeadingProps = {
    children?: ReactNode
    size?: string
    className?: string
    overrideClassName?: string
}

export const CardHeading = (props: CardHeadingProps): ReactElement => (
    <div className={
        props.overrideClassName
        ?? `${props.size ?? `text-3xl`} font-semibold text-primary-200 dark:text-secondary-dark-900` + (props.className ? ` ${props.className}` : ``)
    }>
        {props.children}
    </div>
)
