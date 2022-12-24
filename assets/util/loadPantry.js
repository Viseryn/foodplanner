/*******************************
 * ./assets/util/loadPantry.js *
 *******************************/

import axios from "axios";
import parseShoppingList from "./parseShoppingList";

/**
 * loadPantry
 * 
 * Calls the Pantry API and parses the pantry.
 * After loading, an optional cleanup function can be called
 * that receives the item list as argument.
 * 
 * @param {function} setPantry The setter function of the global pantry state variable.
 * @param {function} callback An optional cleanup function which the updated pantry items are passed to.
 */
const loadPantry = (setPantry, callback = () => {}) => {
    axios
        .get('/api/pantry')
        .then(response => {
            // Parse pantry
            let items = JSON.parse(response.data);
            parseShoppingList(items);

            // Set state
            setPantry(items);

            // Execute cleanup function
            callback(items);
        })
    ;
};

export default loadPantry;
