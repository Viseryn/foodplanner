/********************************
 * ./assets/components/Forms.js *
 ********************************/

/**
 * Global styles
 */
const inputRowStyle    = 'mb-6';
const inputLabelStyle  = 'text-sm font-semibold block mb-2';
const inputWidgetStyle = 'dark:placeholder-secondary-dark-900 dark:bg-secondary-dark-200 border border-gray-300 dark:border-none rounded-md h-14 px-6 w-full transition duration-300 focus:border-primary-100';

/**
 * nameFromId
 * 
 * @param {string} id The id of some form field.
 * @returns The name for the corresponding Symfony form field.
 * 
 * @example const name = nameFromId('user_group_name'); // 'user_group[name]'
 */
function nameFromId(id) {
    const index = id?.lastIndexOf('_');
    const prefix = id?.slice(0, index);
    const name = id?.slice(index + 1);
    
    return prefix + '[' + name + ']';
}

/** 
 * Export functions and variables
 */
export { nameFromId };
export { inputRowStyle, inputLabelStyle, inputWidgetStyle };
