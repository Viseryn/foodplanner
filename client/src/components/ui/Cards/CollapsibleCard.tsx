import IconButton from "@/components/ui/Buttons/IconButton"
import Spacer from "@/components/ui/Spacer"
import { CardComponent } from "@/types/CardComponent"
import { CardProps } from "@/types/props/CardProps"
import { ReactElement, ReactNode, useState } from "react"

type CollapsibleCardProps = {
    cardComponent: CardComponent
    cardProps?: Omit<CardProps, "children">
    heading: ReactElement
    collapsed?: boolean
    onCollapse?: () => void
    children?: ReactNode
}

export const CollapsibleCard = (props: CollapsibleCardProps): ReactElement => {
    const [showContent, setShowContent] = useState<boolean>(!props.collapsed)

    return (
        <props.cardComponent {...props.cardProps}>
            <div className="flex items-center justify-between" onClick={() => {
                setShowContent(prevState => !prevState)
                if (props.onCollapse !== undefined) {
                    props.onCollapse()
                }
            }}>
                <div className="w-full">
                    {props.heading}
                </div>
                <div className="flex gap-2">
                    <IconButton>
                        {showContent ? "expand_circle_up" : "expand_circle_down"}
                    </IconButton>
                </div>
            </div>

            <div className={showContent ? "" : "hidden"}>
                <Spacer height="4" />

                {props.children}
            </div>
        </props.cardComponent>
    )
}
