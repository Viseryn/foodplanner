import { useEffect, useState } from "react"

/**
 * @returns The current mediaQuery selector (```'' < 640 <= 'sm' < 768 <= 'md' < 1024 <= 'lg' < 1280 <= 'xl'```).
 */
function useMediaQuery(): "" | "sm" | "md" | "lg" | "xl" {
    const [screenWidth, setScreenWidth] = useState<number>(0)
    const [medium, setMedium] = useState<MediaQuerySelector>("")

    // Get the current screen width
    useEffect(() => {
        const handleResize = () => setScreenWidth(window.innerWidth)

        window.addEventListener("resize", handleResize)
        handleResize()

        return () => {
            window.removeEventListener("resize", handleResize)
        }
    }, [setScreenWidth])

    // When screenWidth updates, get media query selector
    useEffect(() => {
        if (screenWidth < 640) {
            setMedium("")
        } else if (screenWidth >= 640 && screenWidth < 768) {
            setMedium("sm")
        } else if (screenWidth >= 768 && screenWidth < 1024) {
            setMedium("md")
        } else if (screenWidth >= 1024 && screenWidth < 1280) {
            setMedium("lg")
        } else {
            setMedium("xl")
        }
    }, [screenWidth])

    return medium
}

type MediaQuerySelector = "" | "sm" | "md" | "lg" | "xl"

export default useMediaQuery
