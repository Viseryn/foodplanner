import { stateCacheStore } from "@/hooks/useStateCache"
import { findPage } from "@/types/constants/PAGE_CONFIGS"
import { Page } from "@/types/Page"
import { useEffect } from "react"

/**
 * Caches the scroll position on the given page and scrolls back to it when returning to the page.
 *
 * @param {string} pageId The `id` of some configured `Page` in `PAGE_CONFIGS´. Throws an error if the `Page` does not exist.
 */
export const useScrollCache = (pageId: string): void => {
    const page: Page = findPage(pageId)
    
    useEffect(() => {
        const y: number = stateCacheStore.getState().scrollPositions[page.id] ?? 0
        window.scrollTo(0, y)
    }, [page.id])

    useEffect(() => {
        const updateScroll = () => {
            stateCacheStore.setState(prev => ({
                scrollPositions: {
                    ...prev.scrollPositions,
                    [page.id]: window.scrollY,
                },
            }))
        }

        window.addEventListener("scroll", updateScroll)
        return () => window.removeEventListener("scroll", updateScroll)
    }, [page, page.id])
}
