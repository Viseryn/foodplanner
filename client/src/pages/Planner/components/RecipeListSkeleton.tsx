import Spacer from "@/components/ui/Spacer"
import { ReactElement } from "react"

/**
 * A components that renders a skeleton for the recipe list in AddMeal.
 */
export default function RecipeListSkeleton(): ReactElement {
    return <div role="status" className="animate-pulse">
        <div className="h-12 bg-notification-500 dark:bg-notification-700 rounded-xl w-full" />
        <Spacer height="4" />
        <div className="grid grid-cols-2 gap-2">
            <div className="rounded-xl h-12 transition duration-300 flex flex-col justify-center items-center text-primary-100 dark:text-primary-dark-100 bg-secondary-100 dark:bg-secondary-dark-100 border border-secondary-200 dark:border-secondary-dark-200 animate-pulse">
                <div className="h-6 bg-notification-500 dark:bg-notification-700 rounded-full w-2/3" />
            </div>
            <div className="rounded-xl h-12 transition duration-300 flex flex-col justify-center items-center text-primary-100 dark:text-primary-dark-100 bg-secondary-100 dark:bg-secondary-dark-100 border border-secondary-200 dark:border-secondary-dark-200 animate-pulse">
                <div className="h-6 bg-notification-500 dark:bg-notification-700 rounded-full w-2/3" />
            </div>
            <div className="rounded-xl h-12 transition duration-300 flex flex-col justify-center items-center text-primary-100 dark:text-primary-dark-100 bg-secondary-100 dark:bg-secondary-dark-100 border border-secondary-200 dark:border-secondary-dark-200 animate-pulse">
                <div className="h-6 bg-notification-500 dark:bg-notification-700 rounded-full w-2/3" />
            </div>
            <div className="rounded-xl h-12 transition duration-300 flex flex-col justify-center items-center text-primary-100 dark:text-primary-dark-100 bg-secondary-100 dark:bg-secondary-dark-100 border border-secondary-200 dark:border-secondary-dark-200 animate-pulse">
                <div className="h-6 bg-notification-500 dark:bg-notification-700 rounded-full w-2/3" />
            </div>
            <div className="rounded-xl h-12 transition duration-300 flex flex-col justify-center items-center text-primary-100 dark:text-primary-dark-100 bg-secondary-100 dark:bg-secondary-dark-100 border border-secondary-200 dark:border-secondary-dark-200 animate-pulse">
                <div className="h-6 bg-notification-500 dark:bg-notification-700 rounded-full w-2/3" />
            </div>
            <div className="rounded-xl h-12 transition duration-300 flex flex-col justify-center items-center text-primary-100 dark:text-primary-dark-100 bg-secondary-100 dark:bg-secondary-dark-100 border border-secondary-200 dark:border-secondary-dark-200 animate-pulse">
                <div className="h-6 bg-notification-500 dark:bg-notification-700 rounded-full w-2/3" />
            </div>
        </div>
    </div>
}
