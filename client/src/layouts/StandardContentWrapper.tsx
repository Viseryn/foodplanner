import Spacer from "@/components/ui/Spacer"
import { MainViewWidthContext } from "@/context/MainViewWidthContext"
import { useNullishContext } from "@/hooks/useNullishContext"
import { StringBuilder } from "@/util/StringBuilder"
import { motion } from "motion/react"
import { ReactElement, ReactNode } from "react"

/**
 * Renders a div container suitable as wrapper for most components. The container maintains
 * the correct bottom padding so that the content will not be covered by the sidebar. Furthermore,
 * a Spacer component of height 6 is put at the beginning, which is the standard distance between
 * topbar and content. Additional CSS classes can be passed as argument.
 */
export const StandardContentWrapper = ({ children, className }: {
    children: ReactNode,
    className?: string,
}): ReactElement => {
    const mainViewWidth: string = useNullishContext(MainViewWidthContext).mainViewWidth

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{
                duration: 0.8,
                delay: 0.2,
                ease: [0, 0.71, 0.2, 1.01],
            }}
        >
            <div className={StringBuilder.cn(`mx-4 pb-24 md:mx-0 md:pb-4`, mainViewWidth, className)}>
                <Spacer height="6" />
                {children}
            </div>
        </motion.div>
    )
}
