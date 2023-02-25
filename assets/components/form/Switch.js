
/**************************************
 * ./assets/components/form/Switch.js *
 **************************************/

import React from "react";

/**
 * Switch
 * 
 * A component that renders a switch.
 * Does NOT render a label or input field around.
 * 
 * @component
 * 
 * @example
 * <label htmlFor="switchId" className="inline-flex items-center relative cursor-pointer">
 *     <input type="checkbox" value={...} id="switchId" name="switchId" className="sr-only peer" />
 *     <Switch />
 *     <span className="ml-3 text-sm font-semibold">
 *         Label text
 *     </span>
 * </label>
 * 
 * @deprecated Use Switch/SwitchWidget or Switch/SwitchRow instead.
 */
export default function Switch() {
    return (
        <div 
            className="w-11 h-6 bg-[#e0e4d6] dark:bg-[#43483e] peer-focus:outline-none rounded-full peer 
            peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute 
            after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full 
            after:h-5 after:w-5 after:transition-all transition duration-300 dark:border-gray-600 
            peer-checked:bg-primary-100 dark:peer-checked:bg-primary-dark-200"
        ></div>
    );
}
