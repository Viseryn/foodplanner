import React, { ReactElement, ReactNode } from 'react'
import Spacer from '@/components/ui/Spacer'

/**
 * Renders a div container suitable as wrapper for most components. The container maintains
 * the correct bottom padding so that the content will not be covered by the sidebar. Furthermore,
 * a Spacer component of height 6 is put at the beginning, which is the standard distance between
 * topbar and content. Additional CSS classes can be passed as argument.
 *
 * @component
 * @param children
 * @param className Additional CSS classes for the wrapper.
 */
export const StandardContentWrapper = ({ children, className }: {
    children?: ReactNode,
    className?: string,
}): ReactElement => {
    return (
        <div className={`mx-4 pb-24 md:ml-0 md:pb-4` + (className ? ` ${className}` : ``)}>
            <Spacer height="6" />
            { children }
        </div>
    )
}
