/**
 * Each page can have a `PageState` to determine what elements may be rendered.
 * The following states can be used:
 * - `PageState.WAITING`: A neutral state. Can be used when user input is awaited.
 * - `PageState.LOADING`: A loading state. Can be used for showing a `Spinner` component while dependencies are loading.
 * - `PageState.SUCCESS`: Can be used to show a success message, e.g. after submitting a form.
 * - `PageState.ERROR`: Can be used to show an error message, e.g. after submitting a form.
 */
export enum PageState {
    WAITING, LOADING, SUCCESS, ERROR
}
