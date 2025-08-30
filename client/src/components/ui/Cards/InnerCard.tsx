import { CardComponent } from "@/types/CardComponent"
import { CardProps } from "@/types/props/CardProps"
import { ReactElement } from "react"

export const InnerCard: CardComponent = (props: CardProps): ReactElement => (
    <div className={
        props.overrideClassName
        ?? `bg-white dark:bg-bg-dark rounded-lg p-4` + (props.className ? ` ${props.className}` : ``)
    }>
        {props.children}
    </div>
)
