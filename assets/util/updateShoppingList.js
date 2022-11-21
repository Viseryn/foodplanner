/***************************************
 * ./assets/util/updateShoppingList.js *
 ***************************************/

import axios from "axios";
import parseShoppingList from "./parseShoppingList";

/**
 * updateShoppingList
 * 
 * Calls the ShoppingList API and parses the ShoppingList.
 * After loading, an optional cleanup function can be called
 * that receives the item list as argument.
 * 
 * @param {function} setShoppingList The setter function of the global shopping list state variable.
 * @param {function} callback An optional cleanup function which the updated shopping list items are passed to.
 */
const updateShoppingList = (setShoppingList, callback = () => {}) => {
    axios
        .get('/api/shoppinglist')
        .then(response => {
            // Parse shopping list
            let items = JSON.parse(response.data);
            parseShoppingList(items);

            // Set state
            setShoppingList(items);

            // Execute cleanup function
            callback(items);
        })
    ;
};

export default updateShoppingList;
