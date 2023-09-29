import React, { ReactElement, ReactNode } from 'react'
import Spacer from '@/components/ui/Spacer'

/**
 * Renders a div container suitable as wrapper for most components. The container maintains
 * the correct bottom padding so that the content will not be covered by the sidebar. Furthermore,
 * a Spacer component of height 6 is put at the beginning, which is the standard distance between
 * topbar and content.
 *
 * @component
 */
export const StandardContentWrapper = ({ children }: {
    children?: ReactNode
}): ReactElement => {
    return (
        <div className={`pb-24 md:pb-4`}>
            <Spacer height="6" />
            { children }
        </div>
    )
}
