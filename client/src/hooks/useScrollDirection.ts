import { useEffect, useState } from "react"

/**
 * @returns Returns the scroll direction as string. Return value is "up" or "down".
 */
function useScrollDirection(): "up" | "down" {
    const [scrollDirection, setScrollDirection] = useState<"up" | "down">("up")

    useEffect(() => {
        let lastScroll = window.pageYOffset

        const updateScrollDirection = () => {
            // Current scroll value
            const scroll: number = window.pageYOffset

            // Check the direction of the scrolling
            const direction = (scroll > lastScroll) ? "down" : "up"

            // Only update the state if the scroll is sufficiently large
            if (direction != scrollDirection && (scroll - lastScroll > 5 || scroll - lastScroll < -5)) {
                setScrollDirection(direction)
            }

            // Update lastScroll
            lastScroll = (scroll > 0) ? scroll : 0
        }

        // Add event listener for scrolling
        window.addEventListener("scroll", updateScrollDirection)

        // Return cleanup function
        return () => {
            window.removeEventListener("scroll", updateScrollDirection)
        }
    }, [scrollDirection])

    return scrollDirection
}

/** Export */
export default useScrollDirection
