import { ReactElement } from "react"

/**
 * A component that renders a text skeleton, e.g. for loading screens.
 *
 * @component
 * @example <TextParagraph />
 *
 * @todo Make this customizable.
 */
export default function TextParagraph(): ReactElement {
    return (
        <div role="status" className="space-y-2.5 animate-pulse max-w-lg">
            <div className="flex items-center space-x-2 w-full">
                <div className="h-2.5 bg-notification-500 rounded-full dark:bg-notification-700 w-32"></div>
                <div className="h-2.5 bg-notification-500/75 rounded-full dark:bg-notification-700/75 w-24"></div>
                <div className="h-2.5 bg-notification-500/50 rounded-full dark:bg-notification-700/50 w-full"></div>
            </div>
            <div className="flex items-center w-full space-x-2 max-w-[480px]">
                <div className="h-2.5 bg-notification-500 rounded-full dark:bg-notification-700 w-full"></div>
                <div className="h-2.5 bg-notification-500/75 rounded-full dark:bg-notification-700/75 w-full"></div>
                <div className="h-2.5 bg-notification-500/50 rounded-full dark:bg-notification-700/50 w-24"></div>
            </div>
            <div className="flex items-center w-full space-x-2 max-w-[400px]">
                <div className="h-2.5 bg-notification-500/75 rounded-full dark:bg-notification-700/75 w-full"></div>
                <div className="h-2.5 bg-notification-500 rounded-full dark:bg-notification-700 w-80"></div>
                <div className="h-2.5 bg-notification-500/50 rounded-full dark:bg-notification-700/50 w-full"></div>
            </div>
            <div className="flex items-center w-full space-x-2 max-w-[480px]">
                <div className="h-2.5 bg-notification-500 rounded-full dark:bg-notification-700 w-full"></div>
                <div className="h-2.5 bg-notification-500/75 rounded-full dark:bg-notification-700/75 w-full"></div>
                <div className="h-2.5 bg-notification-500/50 rounded-full dark:bg-notification-700/50 w-24"></div>
            </div>
            <div className="flex items-center w-full space-x-2 max-w-[440px]">
                <div className="h-2.5 bg-notification-500/75 rounded-full dark:bg-notification-700/75 w-32"></div>
                <div className="h-2.5 bg-notification-500/50 rounded-full dark:bg-notification-700/50 w-24"></div>
                <div className="h-2.5 bg-notification-500 rounded-full dark:bg-notification-700 w-full"></div>
            </div>
            <div className="flex items-center w-full space-x-2 max-w-[360px]">
                <div className="h-2.5 bg-notification-500/75 rounded-full dark:bg-notification-700/75 w-full"></div>
                <div className="h-2.5 bg-notification-500 rounded-full dark:bg-notification-700 w-80"></div>
                <div className="h-2.5 bg-notification-500/50 rounded-full dark:bg-notification-700/50 w-full"></div>
            </div>
            <span className="sr-only">Loading...</span>
        </div>
    )
}
