// eslint-disable-next-line @typescript-eslint/no-unused-vars
const HOMEPAGE_VALUES = [
    "PLANNER",
    "RECIPES",
    "SHOPPING_LIST",
    "PANTRY",
] as const

export type Homepage = typeof HOMEPAGE_VALUES[number]
