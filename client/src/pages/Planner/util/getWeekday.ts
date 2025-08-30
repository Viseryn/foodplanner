/**
 * @param date
 * @param short If set to true, the weekday string will be shortened.
 */
export const getWeekday = (date: Date, short?: boolean): string => {
    return date.toLocaleString(window.navigator.language, {
        weekday: short ? 'short' : 'long',
    })
}
