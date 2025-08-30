import { ReactElement } from "react"

/**
 * Renders a wrapper for a Carousel child.
 *
 * @component
 * @param props
 * @param props.visibleItems Optional: The number of Carousel items that are visible at once. Default is 1.
 * @param props.children The children of the CarouselItem component.
 */
export default function CarouselItem({ visibleItems = 1, children }: {
    visibleItems?: number
    children: React.ReactNode
}): ReactElement {
    return <div className="flex-shrink-0 flex-grow" style={{ maxWidth: `${100 / visibleItems}%` }}>
        {children}
    </div>
}
