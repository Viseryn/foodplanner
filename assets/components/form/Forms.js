/********************************
 * ./assets/components/Forms.js *
 ********************************/

/**
 * Global styles
 */
let inputRowStyle       = 'mb-6';
let inputLabelStyle     = 'text-sm font-semibold block mb-2';
let inputWidgetStyle    = 'dark:placeholder-gray-400 dark:bg-[#1D252C] border border-gray-300 dark:border-none rounded-full h-10 px-6 shadow-sm dark:shadow-md w-full transition duration-300 focus:border-blue-600';
let textareaWidgetStyle = 'dark:placeholder-gray-400 dark:bg-[#1D252C] block border border-gray-300 dark:border-none rounded-xl px-4 py-2 shadow-sm dark:shadow-md w-full transition duration-300 focus:border-blue-600';

/**
 * nameFromId
 * 
 * @param {string} id The id of some form field.
 * @returns The name for the corresponding form field.
 * 
 * @example const name = nameFromId('recipe_name'); // 'recipe[name]'
 */
function nameFromId(id) {
    let arr = id?.split("_");
    let str = (arr?.length > 1) ? arr[0] + '[' + arr[1] + ']' : '';

    return str;
}

/** 
 * Export functions and variables
 */
export { nameFromId };
export { inputRowStyle, inputLabelStyle, inputWidgetStyle, textareaWidgetStyle };
