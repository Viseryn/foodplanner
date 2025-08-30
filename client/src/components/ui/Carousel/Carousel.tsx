import Button from "@/components/ui/Buttons/Button"
import Spacer from "@/components/ui/Spacer"
import { Children, ReactElement, useEffect, useState } from "react"
import CarouselItem from "./CarouselItem"

/**
 * A component that renders a carousel for arbitrary children. Can show one or multiple items at a
 * time. The default behaviour is that one child is shown and the children have no gap. To set a
 * manual gap and a manual translation value, pass corresponding values as arguments. A carousel
 * can also be infinitely scrollable.
 *
 * @component
 * @param props
 * @param props.visibleItems Optional: The number of children that are visible at once. Default is 1.
 * @param props.gap Optional: The gap between the children in multiples of 4px.
 * @param props.translation Optional: The value by which the children should be translated. Default is (100% / visibleItems).
 * @param props.infinite Optional: Whether the carousel is infinitely scrollable. Default is false.
 * @param props.children Each child of the Carousel component corresponds to one CarouselItem component.
 */
export default function Carousel({ visibleItems = 1, gap = 0, translation, infinite, children }: {
    visibleItems?: number
    gap?: number
    translation?: number
    infinite?: boolean
    children: React.ReactNode
}): ReactElement {
    // The index of the currently viewed child
    const [current, setCurrent] = useState<number>(0)

    // The length of the Carousel
    const [length, setLength] = useState<number>(0)

    // The translation value of the Carousel item wrapper.
    const [translationValue, setTranslationValue] = useState<string>("")

    // Sets the length of the Carousel to the current length of the children array.
    useEffect(() => {
        setLength(Children.count(children))
    }, [children])

    // Depending on the currently viewed child, sets the translation value for the div.
    useEffect(() => {
        setTranslationValue(
            translation
                ? current * translation + "px"
                : current * (100 / visibleItems) + "%",
        )
    }, [current])

    /** Handles a click on the "Next" button. */
    const handleNext = (): void => {
        if (current < (length - visibleItems)) {
            setCurrent(prevState => prevState + 1)
        } else if (infinite) {
            setCurrent(0)
        }
    }

    /** Handles a click on the "Previous" button. */
    const handlePrevious = (): void => {
        if (current > 0) {
            setCurrent(prevState => prevState - 1)
        } else if (infinite) {
            setCurrent(length - visibleItems)
        }
    }

    // Render Carousel
    return <div className="">
        <div className="w-full flex flex-col">
            <div className="w-full flex relative">
                <div className={`overflow-hidden w-full h-full`}>
                    <div
                        className="flex transition-all duration-300"
                        style={{ transform: `translateX(-${translationValue})`, gap: `${4 * gap}px` }}
                    >
                        {Children.map(children, (child, index) =>
                            <CarouselItem key={index} visibleItems={visibleItems}>
                                {child}
                            </CarouselItem>,
                        )}
                    </div>
                </div>
            </div>
        </div>

        <Spacer height="6" />

        <div className="flex justify-between select-none">
            <Button
                onClick={handlePrevious}
                icon="navigate_before"
                label="Zurück"
                role={current === 0 && !infinite ? "disabled" : "secondary"}
                isSmall={true}
            />
            <Button
                onClick={handleNext}
                icon="navigate_next"
                label="Weiter"
                role={current === length - visibleItems && !infinite ? "disabled" : "secondary"}
                isIconRight={true}
                isSmall={true}
            />
        </div>
    </div>
}
