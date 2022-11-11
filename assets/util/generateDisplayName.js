/****************************************
 * ./assets/util/generateDisplayName.js *
 ****************************************/

/**
 * generateDisplayName
 * 
 * Generates the displayed name of a shopping list item,
 * which includes the quantity of the ingredient.
 * 
 * @param {string} quantity_value
 * @param {string} quantity_unit
 * @param {string} originalName
 * @return Returns the display name of an item.
 */
const generateDisplayName = (quantity_value, quantity_unit, originalName) => {
    let quantity = quantity_value;

    if (quantity && quantity_unit) {
        quantity += ' ' + quantity_unit;
    } else if (quantity_unit) {
        quantity += quantity_unit;
    }

    const displayName = (quantity ? quantity + ' ' : '') + originalName;

    return displayName;
};

export default generateDisplayName;
