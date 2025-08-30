import Spacer from "@/components/ui/Spacer"
import { ReactElement } from "react"

/**
 * A components that renders a skeleton for the day selection in AddMeal.
 */
export default function DayRadioSkeleton(): ReactElement {
    return <div className="grid grid-cols-5 gap-2">
        {[...Array(10)].map((value, index) => 
            <div key={index}>
                <div 
                    className="rounded-xl h-12 transition duration-300 flex flex-col justify-center items-center text-primary-100 dark:text-primary-dark-100 bg-secondary-100 dark:bg-secondary-dark-100 border border-secondary-200 dark:border-secondary-dark-200 animate-pulse"
                >
                    <div className="h-4 bg-notification-500 dark:bg-notification-700 rounded-full w-1/3" />
                    <Spacer height="1" />
                    <div className="h-3 bg-notification-500 dark:bg-notification-700 rounded-full w-3/5" />
                </div>
            </div>
        )}
    </div>
}
