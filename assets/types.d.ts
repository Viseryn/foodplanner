type SetSidebarAction = (
    sidebarActiveItem?: string,
    sidebarActionButton?: SidebarActionButtonConfiguration
) => void

type SetTopbarAction = React.Dispatch<TopbarConfiguration>

type SidebarActionButtonConfiguration = {
    path?: string           /** A path that the SAB leads to.            */
    visible?: boolean       /** Whether the SAB shall be visible or not. */
    onClick?: () => void    /** An onClick handler callback.             */
    icon?: string           /** The icon of the SAB.                     */
    label?: string          /** The label text of the SAB.               */
}

type TopbarConfiguration = {
    title?: string                  /** The title of the topbar.                                           */
    showBackButton?: boolean        /** Whether the back button shall be visible or not.                   */
    backButtonPath?: string         /** The path that the back button leads to.                            */
    onBackButtonClick?: () => void  /** An onClick handler callback for the back button.                   */
    actionButtons?: Array<{         /** An array of action buttons for the top-right corner of the topbar. */
        icon: string
        onClick?: () => void
    }>
    truncate?: boolean              /** Whether a too long title shall be truncated or not on scroll.                                              */
    isLoading?: boolean             /** Whether the topbar should display a skeleton while this property is true.                                  */
    style?: string                  /** Additional styling classes for the topbar on larger screns (e.g. a max-width to match the main container). */
}

type FetchableEntity<Type = any> = {
    data: Type
    setData: React.Dispatch<React.SetStateAction<Type>>
    isLoading: boolean
    setLoading: React.Dispatch<React.SetStateAction<boolean>>
}

type User = {
    id?: number
    username?: string
    roles?: Array<string>
}

type Authentication = {
    isAuthenticated: boolean
    isLoading: boolean
}

type Settings = {
    showPantry: boolean
}

/** @todo Refactor */
type UserGroup = {
    name: string
    users: Array<string>
    isStandard: boolean
    icon: string
    id: string
    value: number
    label: string
    checked: "checked" | ""
}

/** @todo Refactor */
type MealCategory = {
    name: string
    isStandard: boolean
    icon: string
    id: string
    value: number
    label: string
    checked: "checked" | ""
}

/** @todo Refactor API */
type Recipe = {
    id: number
    title: string
    portion_size: number
    instructions: Array<Instruction>
    ingredients: Array<Ingredient>
    image: Image
}

type Image = {
    id: number
    filename: string
    directory: string
    public: boolean
}

type Instruction = {
    id: number
    instruction: string
}

/** @todo Refactor API */
type Ingredient = {
    id: number
    name: string
    quantity_value: string
    quantity_unit: string
    storage: { id: number } /** @todo */
    position: number
    checked: boolean
    editable?: boolean
}

/** @todo Refactor API */
type Meal = {
    id: number
    meal_category: MealCategory
    recipe: Recipe
    user_group: UserGroup
}

type Day = {
    id: number
    weekday: string
    title: string
    date: string
    meals: Array<Meal>
}