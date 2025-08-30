import { useEffect, useState } from "react"

/**
 * @param withoutInnerHeight If set to false (default), the inner height of the window is added to the scroll value.
 * @returns Returns the current scroll position (on the vertical axis) plus (if not disabled) the inner height of the window.
 */
function useScrollPosition(withoutInnerHeight: boolean = false): number {
    const [scrollPosition, setScrollPosition] = useState<number>(0)

    useEffect(() => {
        const updatePosition = () => {
            setScrollPosition(window.pageYOffset)
        }

        window.addEventListener("scroll", updatePosition)
        updatePosition()

        return () => {
            window.removeEventListener("scroll", updatePosition)
        }
    }, [])

    return withoutInnerHeight ? scrollPosition : scrollPosition + window.innerHeight
}

/** Export */
export default useScrollPosition
