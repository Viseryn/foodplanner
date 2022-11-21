/**************************************
 * ./assets/util/parseShoppingList.js *
 **************************************/

import generateDisplayName from "./generateDisplayName";

/**
 * parseShoppingList
 * 
 * Given a "raw" list of shopping list items, e.g. through the 
 * ShoppingList API, generates the displayed name of each item
 * and sorts the list by the position value.
 * 
 * @param {arr} items An array of shopping list items, e.g. from the ShoppingList API.
 */
const parseShoppingList = (items) => {
    // Loop through each item
    items.forEach(item => {
        // Save original name of each item
        item.originalName = item.name;

        // Add quantity to the name field, which will be displayed.
        // The Shopping List Update API will split everything later.
        item.name = generateDisplayName(
            item.quantity_value, 
            item.quantity_unit, 
            item.originalName
        );
    });

    // Order list by position
    const compareItems = (a, b) => {
        if (a.position < b.position) return -1;
        if (a.position > b.position) return 1;
        return 0;
    }

    items.sort(compareItems);
};

export default parseShoppingList;
