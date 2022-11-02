/***************************************
 * ./assets/components/ShoppingList.js *
 ***************************************/

import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';

import Heading from './Heading';
import Spinner from './Util';
import Button from './Buttons';

/**
 * ShoppingList
 * 
 * A component for showing a shopping list.
 * Contains an input widget for adding new 
 * items to the list, as well as a delete button 
 * to remove all checked items.
 * 
 * The list is kept synchronized with the 
 * database. An Ingredient object is considered
 * part of the shopping list if it has 
 * storageId = 2, and if it has no recipeId.
 */
export default function ShoppingList(props) {
    // State variables
    const [items, setItems] = useState([]);
    const [isLoading, setLoading] = useState(true);
    const [inputValue, setInputValue] = useState('');

    /**
     * getShoppingList
     * 
     * Calls the ShoppingList API. Adds additional 
     * properties to each item and passes the list 
     * of item to the state variable.
     */ 
    const getShoppingList = () => {
        axios
            .get('/api/shoppinglist')
            .then(response => {
                let itemsData = JSON.parse(response.data)

                // Add quantity to name field.
                // The Update API will split everything again.
                itemsData.forEach(item => {
                    let quantity = item.quantity_value + ' ' + item.quantity_unit;
                    item.name = (quantity !== ' ' ? quantity + ' ' : '') + item.name;
                });

                // Order list by position
                const compareItems = (a, b) => {
                    if (a.position < b.position) {
                        return -1;
                    }

                    if (a.position > b.position) {
                        return 1;
                    }

                    return 0;
                }

                itemsData.sort(compareItems);

                // Add list to state
                setItems(itemsData);
                setLoading(false);
            });
    };

    /**
     * updateItem
     * 
     * Updates one item with the given ID in the items state variable.
     * The properties that should be changed, as well as their values,
     * can be passed as an optional parameter.
     * 
     * @param {int} id The ID of the item that should be changed.
     * @param {Object} props The properties that should be changed and their values.
     */
    const updateItem = (id, props = {}) => {
        // Create a new list of items
        let newList = [...items];

        // Find index of the item that will be changed
        const itemIndex = findItemById(id);

        // Change properties of selected item
        Object.keys(props).forEach(key => {
            newList[itemIndex][key] = props[key];
        });

        // Set new item list to the state variable
        setItems(newList);
    }

    /**
     * findItemById
     * 
     * @param {int} id 
     * @return Returns the index of the item with the given ID in the items state variable or -1 if item does not exist.
     */
    const findItemById = (id) => {
        let returnVal = -1;

        items.forEach((item, index) => {
            if (item.id === id) {
                returnVal = index;
            } 
        });

        return returnVal;
    };

    /**
     * handleNewItemKeyDown
     * 
     * Handler for "enter" presses when the AddItemInputWidget
     * component is focused. Adds the input value as a new item 
     * and clears the input field.
     */ 
    const handleNewItemKeyDown = (event) => {
        if (event.key === 'Enter' && inputValue !== '') {
            const newItem = {
                id: items.length, // TODO : MIGHT NOT BE UNIQUE!
                name: inputValue,
                position: (items.length > 0 ? items[items.length - 1].position + 1 : 1),
                checked: false,
                editable: false,
            };

            setItems([...items, newItem]);
            setInputValue('');
        }
    };

    /**
     * handleCheckboxChange
     * 
     * Toggle the checked status of the given item.
     * Makes the selected item non-editable.
     */ 
    const handleCheckboxChange = (id) => {
        updateItem(id, {
            'checked': !items[findItemById(id)].checked,
            'editable': false,
        });
    };

    /**
     * handleDeleteButtonClicked
     * 
     * A handler for onClick events of the delete button.
     * When clicked, filters out all items that are checked.
     */
    const handleDeleteButtonClicked = () => {
        const newList = items.filter(item => {
            return !item.checked;
        })

        setItems(newList);
    };

    /**
     * handleItemClick
     * 
     * Handler for click events on list items.
     * Differentiates single and double clicks.
     * On a single click, it toggles the checked status of an item.
     * On a double click, it toggles the editable status of an item.
     */
    const handleItemClick = (event, id, editable = false) => {
        if (event.detail === 2) {
            // Double click action
            handleItemEdit(id);

            // When a double click is registered, the 
            // actions for a single click should be prevented.
            preventSingleClick = true;

            // After a certain delay, allow registering single clicks again.
            setTimeout(() => preventSingleClick = false, 200);
        } else {
            // Only do the single click action if after a short 
            // delay no double click was registered. Also, do not 
            // do the single click action if the item is editable.
            setTimeout(() => {
                if (!preventSingleClick && !editable) {
                    handleCheckboxChange(id);
                }
            }, 200);
        }
    };

    let preventSingleClick = false;

    /**
     * handleItemEdit
     * 
     * Makes the selected item editable and 
     * all the others non-editable.
     */
    const handleItemEdit = (id) => {
        // Make all items non-editable
        items.forEach(item => {
            updateItem(item.id, {
                'editable': false,
            });
        })

        // Make the selected item editable
        updateItem(id, {
            'editable': true,
            'checked': false,
        });
    };

    /**
     * handleItemNameChange
     * 
     * Changes the name of an item and makes 
     * it non-editable. Is called after enter 
     * presses and focus lost.
     */
    const handleItemNameChange = (event, id) => {
        if (event.target.value !== '') {
            updateItem(id, {
                name: event.target.value,
                editable: false,
            })
        }
    };

    /**
     * Load sidebar and shopping list
     */ 
    useEffect(() => {
        props.setSidebarActiveItem('shoppinglist');
        props.setSidebarActionButton();

        getShoppingList();
    }, []);

    /**
     * Update shopping list items from state to database
     */
    useEffect(() => {
        // Do not make an AJAX request on the first time (items init)
        if (init.current) {
            init.current = false;
            return;
        }

        // Send items data to API
        axios.post('/api/shoppinglist/update', JSON.stringify(items));
    }, [items]);

    let init = useRef(true);

    /**
     * Render
     */
    return (
        <div className="px-6 pb-24 pt-6 md:pb-6 md:my-6 md:mr-6 w-full min-h-screen md:min-h-fit bg-white dark:bg-[#29353f] md:rounded-3xl md:w-[450px]">
            <div className="flex justify-between items-start">
                <Heading>Einkaufsliste</Heading>

                {/* Delete and update buttons */}
                <div>
                    <span 
                        className="material-symbols-rounded ml-2 cursor-pointer transition duration-300 hover:bg-gray-200 dark:hover:bg-[#232325] p-2 rounded-full"
                        onClick={handleDeleteButtonClicked}
                    >
                        delete_sweep
                    </span>

                    <span 
                        className="material-symbols-rounded ml-2 cursor-pointer transition duration-300 hover:bg-gray-200 dark:hover:bg-[#232325] p-2 rounded-full"
                        onClick={getShoppingList}
                    >
                        sync
                    </span>
                </div>
            </div>
            
            <AddItemInputWidget
                inputValue={inputValue}
                setInputValue={setInputValue}
                handleNewItemKeyDown={handleNewItemKeyDown}
            />

            {isLoading ? (
                <Spinner />
            ) : (
                <>
                    <div className="space-y-2">
                        {items.map(item => 
                            <div key={item.id} className="flex items-center w-full h-10 rounded-full px-4 transition duration-300 hover:bg-gray-100 dark:hover:bg-[#1D252C]">
                                <input 
                                    id={item.id} 
                                    type="checkbox" 
                                    className="w-4 h-4 text-blue-600 bg-gray-100 rounded-full border-gray-300 dark:bg-gray-700 dark:border-gray-600 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 peer"
                                    onChange={() => handleCheckboxChange(item.id)} 
                                    checked={item.checked}
                                />
                                <div 
                                    className={
                                        'transition duration-200 ml-4 text-gray-900 dark:text-gray-300 grow select-none' 
                                        + (item.checked ? ' line-through text-gray-400' : '')
                                    }
                                    onClick={event => handleItemClick(event, item.id, item.editable)}
                                >
                                    {item.editable ? (
                                        <input 
                                            className="bg-transparent"
                                            defaultValue={item.name}
                                            onBlur={event => handleItemNameChange(event, item.id)}
                                            onKeyDown={event => { 
                                                if (event.key === 'Enter') {
                                                    handleItemNameChange(event, item.id);
                                                }
                                            }}
                                        />
                                    ) : (
                                        item.name
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
    );
}

/**
 * AddItemInputWidget
 * 
 * An input widget component for adding a new item 
 * to the shopping list. The input value is always 
 * monitored in the state variable inputValue. When 
 * the inputValue is non-empty, shows a little cross 
 * icon in the right to delete the current input.
 * When the enter key is pressed, calls the 
 * handleNewItemKeyDown function.
 */
function AddItemInputWidget(props) {
    return (
        <div className="mb-10 rounded-full bg-white border border-gray-100 dark:border-none dark:bg-[#1D252C] shadow-md h-16 flex items-center pl-6 pr-4">
            <span className="material-symbols-rounded mr-2 cursor-default">add</span>

            <input 
                className="dark:bg-[#1D252C] dark:placeholder-gray-400 w-full border-transparent focus:border-transparent focus:ring-0"
                placeholder="Tippe eine neue Zutat ein ..."
                type="text"
                value={props.inputValue}
                onChange={e => {props.setInputValue(e.target.value)}} 
                onKeyDown={props.handleNewItemKeyDown}
            />

            {props.inputValue !== '' &&
                <span 
                    className="material-symbols-rounded ml-2 cursor-pointer transition duration-300 hover:bg-gray-200 dark:hover:bg-[#29353f] p-2 rounded-full"
                    onClick={() => props.setInputValue('')}
                >
                    close
                </span>
            }
        </div>
    );
}
