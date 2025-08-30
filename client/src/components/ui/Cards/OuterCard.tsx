import { CardComponent } from "@/types/CardComponent"
import { CardProps } from "@/types/props/CardProps"
import { ReactElement } from "react"

export const OuterCard: CardComponent = (props: CardProps): ReactElement => (
    <div className={
        props.overrideClassName
        ?? `bg-secondary-100 dark:bg-secondary-dark-100 rounded-xl p-4` + (props.className ? ` ${props.className}` : ``)
    }>
        {props.children}
    </div>
)
