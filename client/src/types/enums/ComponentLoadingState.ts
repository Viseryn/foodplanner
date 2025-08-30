/**
 * This enum can be used to describe a simple loading state of a component.
 * The states are:
 * - `ComponentLoadingState.WAITING`: A neutral state. Can be used when user input is awaited.
 * - `ComponentLoadingState.LOADING`: A loading state. Can be used for showing a `Spinner` component while something (e.g. a REST request) is loading.
 *
 * @see `PageState` is a more versatile state enum.
 */
export enum ComponentLoadingState {
    WAITING, LOADING
}
