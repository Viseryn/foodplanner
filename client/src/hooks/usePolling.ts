import { RefObject, useEffect, useRef } from "react"

/**
 * Periodically executes the given callback function, waiting for the specified amount of time between two iterations.
 * The loop is suspended while the document is not visible, i.e. it only iterates while the app is opened.
 *
 * @param {() => void} callback The callback function to be executed periodically.
 * @param {number} timeout The timespan between to execution iterations.
 */
export const usePolling = (callback: () => void, timeout: number = 5000): void => {
    const interval: RefObject<NodeJS.Timeout | null> = useRef<NodeJS.Timeout | null>(null)

    const startPolling = (): void => {
        if (!interval.current) {
            interval.current = setInterval(async () => callback(), timeout)
        }
    }

    const stopPolling = (): void => {
        if (interval.current) {
            clearInterval(interval.current)
            interval.current = null
        }
    }

    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.visibilityState === "visible") {
                startPolling()
            } else {
                stopPolling()
            }
        }

        document.addEventListener("visibilitychange", handleVisibilityChange)

        // Start polling immediately if visible
        if (document.visibilityState === "visible") {
            startPolling()
        }

        return () => {
            stopPolling()
            document.removeEventListener("visibilitychange", handleVisibilityChange)
        }
    }, [callback, timeout])
}