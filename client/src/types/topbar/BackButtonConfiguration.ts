import { MutuallyExclusive } from "@/types/MutuallyExclusive"

export type BackButtonConfiguration = {
    isVisible: boolean
} & MutuallyExclusive<{ path: string }, { onClick: () => void }>
