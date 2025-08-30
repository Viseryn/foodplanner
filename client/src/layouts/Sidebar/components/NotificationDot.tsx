import { ReactElement } from "react"

export const NotificationDot = ({ value }: { value: number }): ReactElement => (
    <div className="absolute inline-flex items-center justify-center -top-2 right-[2px] md:-top-[2px] md:-right-[2px] xl:top-[16px] xl:right-[16px] w-6 h-6 bg-red-500 border-2 border-bg dark:border-bg-dark xl:border-0 rounded-full z-40 font-bold text-xs text-white">
        {value}
    </div>
)
