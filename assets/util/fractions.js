/******************************
 * ./assets/util/fractions.js *
 ******************************/

/**
 * fractionToFloat
 * 
 * Converts a fraction string into a number.
 * Mixed fractions like '1 1/2' are also allowed.
 * 
 * @example
 * fractionToFloat('1 3/4') === 1.75
 * fractionToFloat('2/5') === 0.4
 * fractionToFloat('3') === 3
 * 
 * @param {string} fraction A fraction string, e.g. '1 1/2' or '3/4'.
 * @returns {number} Returns the number value of the fraction.
 */
export const fractionToFloat = (fraction) => {
    let integerValue = 0;
    let decimalValue = 0;

    const decimalSplit = fraction.split('/');

    if (decimalSplit.length > 1) {
        // Check if fraction is mixed
        const whitespaceSplit = decimalSplit[0].split(' ');

        // If there was a whitespace, the fraction is mixed
        if (whitespaceSplit.length > 1) {
            integerValue = +whitespaceSplit[0];

            // Compute decimal value
            decimalValue = +whitespaceSplit[1] / +decimalSplit[1];
        } else {
            // Compute decimal value
            decimalValue = +whitespaceSplit[0] / +decimalSplit[1];
        }

        return integerValue + decimalValue;
    } else {
        // If there is no fraction symbol, just return the argument
        return +fraction;
    }
};

/**
 * floatToFraction
 * 
 * Converts a number into a fraction string.
 * 
 * @example
 * floatToFraction(0.5) === '1/2'
 * floatToFraction(7.25) === '7 1/4'
 * floatToFraction(5) === '5'
 * 
 * @param {number} float A numerical value.
 * @returns {string} Returns a fraction string for the corresponding float value. 
 */
export const floatToFraction = (float) => {
    // If float is zero, just return empty string
    if (float === 0) {
        return '';
    }

    // Retreive the integer and decimal parts of the number.
    const integerPart = Math.trunc(float);
    const decimalPart = float - integerPart;

    // The standard return value is just the argument converted to a string.
    let returnValue = float + '';

    // Set the mapping between floats and fractions.
    const fractionMap = [
        [0.5, '1/2'], 
        [0.25, '1/4'],
        [0.75, '3/4'],
        [0.125, '1/8'],
        [0.375, '3/8'],
        [0.625, '5/8'],
        [0.875, '7/8'],
        [0.0625, '1/16'],
    ];

    // If the decimal part matches with one of the mappings,
    // add the fraction to the integer part.
    fractionMap.forEach(mapping => {
        if (decimalPart == mapping[0]) {
            returnValue = (integerPart || '') + ' ' + mapping[1];
        }
    });

    // Return either the default or the composed result.
    return returnValue;
};