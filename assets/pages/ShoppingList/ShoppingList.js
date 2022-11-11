/***********************************************
 * ./assets/pages/ShoppingList/ShoppingList.js *
 ***********************************************/

import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';

import AddItemInputWidget from './components/AddItemInputWidget'
import Button from '../../components/ui/Buttons';
import Heading from '../../components/ui/Heading';
import Spinner from '../../components/ui/Spinner';

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
 * 
 * @component
 * @property {function} setSidebarActiveItem
 * @property {function} setSidebarActionButton
 */
export default function ShoppingList(props) {
    /**
     * State variables
     */
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
                let itemsData = JSON.parse(response.data);

                itemsData.forEach(item => {
                    // Save original name of each item
                    item.originalName = item.name;

                    // Add quantity to name field
                    // The Update API will split everything again
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

                itemsData.sort(compareItems);

                // Add list to state
                setItems(itemsData);
                setLoading(false);
            })
        ;
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

    /**
     * handleCombine
     * 
     * Handler for combining items on the list with the same name.
     */
    const handleCombine = () => {
        let list = [...items];  // Working copy of item list
        let appearedItems = []; // A list of "representative" items that all other duplicates are being added to
        let appearedNames = []; // The names of the representative items

        list.forEach(item => {
            if (!appearedNames.includes(item.originalName)) {
                // If item has not been saved as unique 
                // representative, save it now.
                appearedNames.push(item.originalName);
                appearedItems.push(item);
            } else {
                // If item is a duplicate, find the representative
                const index = appearedNames.indexOf(item.originalName);
                let origItem = appearedItems[index];

                if (origItem.quantity_unit === item.quantity_unit 
                    && !origItem.checked && !item.checked) {
                    // If the representative has the same unit 
                    // and both are not checked, add them up.
                    origItem.quantity_value = +origItem.quantity_value + +item.quantity_value;
                } else {
                    // If either item is checked or units do not match, 
                    // add the "duplicate" to the representative list.
                    appearedNames.push(item.originalName);
                    appearedItems.push(item);
                }
            }
        });

        // In the list of representative items, generate the display names.
        appearedItems.forEach(item => {
            item.name = generateDisplayName(item.quantity_value, item.quantity_unit, item.originalName);
        });

        // Update the state variable
        setItems(appearedItems);
    };

    /**
     * handleNewItemKeyDown
     * 
     * Handler for "enter" presses when the AddItemInputWidget
     * component is focused. Adds the input value as a new item 
     * and clears the input field.
     * 
     * @param {*} event
     */ 
    const handleNewItemKeyDown = (event) => {
        if (event.key === 'Enter' && inputValue !== '') {
            const newItem = {
                name: inputValue,
            };

            // Send new item to database and reload list
            axios
                .post('/api/shoppinglist/ingredient', newItem)
                .then(response => {
                    getShoppingList();
                    setInputValue('');
                })
            ;
        }
    };

    /**
     * handleCheckboxChange
     * 
     * Toggle the checked status of the given item.
     * Makes the selected item non-editable.
     * 
     * @param {number} id The id of the given item.
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
     * 
     * @param {*} event
     * @param {number} id The id of the given item.
     * @param {boolean} editable Whether the item is editable.
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
     * 
     * @param {number} id The id of the given item.
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
     * 
     * @param {*} event
     * @param {number} id The id of the given item.
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
     * handlePositionDown
     * 
     * Swaps the position of the selected item 
     * with the next item (if existent).
     * 
     * @param {number} id The id of the given item.
     */
    const handlePositionDown = (id) => {
        const index = findItemById(id);

        if (items.length !== index + 1) {
            let newItems = [...items];
            const oldPosition = newItems[index].position;
            const newPosition = newItems[index + 1].position;

            newItems[index].position = newPosition;
            newItems[index + 1].position = oldPosition;

            [newItems[index], newItems[index + 1]] = [newItems[index + 1], newItems[index]];

            setItems(newItems);
        }
    };

    /**
     * handlePositionUp
     * 
     * Swaps the position of the selected item 
     * with the previous item (if existent).
     * 
     * @param {number} id The id of the given item.
     */
    const handlePositionUp = (id) => {
        const index = findItemById(id);

        if (index !== 0) {
            let newItems = [...items];
            const oldPosition = newItems[index].position;
            const newPosition = newItems[index - 1].position;

            newItems[index].position = newPosition;
            newItems[index - 1].position = oldPosition;

            [newItems[index], newItems[index - 1]] = [newItems[index - 1], newItems[index]];

            setItems(newItems);
        }
    };

    /**
     * handleDeleteAll
     * 
     * Deletes all items on the list after confirming
     * a SweetAlert.
     */
    const handleDeleteAll = () => {
        swal({
            dangerMode: true,
            icon: 'error',
            title: 'Alle Einträge löschen?',
            text: 'Gelöschte Inhalte können nicht wiederhergestellt werden.',
            buttons: {
                cancel: 'Abbrechen',
                confirm: 'Löschen',
            },
        }).then((confirm) => {
            if (confirm) {
                setItems([]);
            }
        });
    }

    /**
     * Load sidebar and shopping list
     */ 
    useEffect(() => {
        props.setSidebarActiveItem('shoppinglist');
        props.setSidebarActionButton();

        getShoppingList();
    }, []);

    useEffect(() => {
        props.setSidebarActionButton({
            visible: true, 
            icon: 'low_priority', 
            label: 'Zusammenfassen',
            onClickHandler: handleCombine,
        });
    }, [items]);

    /**
     * Update shopping list items from state to database
     */
    useEffect(() => {
        // Do not make an AJAX request on the first and second time (items init)
        if (first.current || second.current) {
            if (!first.current) {
                second.current = false;
            }

            first.current = false;
            return;
        }

        // Send items data to API
        axios.post('/api/shoppinglist/update', JSON.stringify(items));
    }, [items]);

    let first = useRef(true);
    let second = useRef(true);

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
                        onClick={handleDeleteAll}
                    >
                        delete_forever
                    </span>

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
                items={items}
                inputValue={inputValue}
                setInputValue={setInputValue}
                handleNewItemKeyDown={handleNewItemKeyDown}
            />

            {isLoading ? (
                <Spinner />
            ) : (
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
                            <div className="transition duration-200 ml-4 text-gray-900 dark:text-gray-300 grow select-none flex justify-between items-center group">
                                <div 
                                    className={'grow' + (item.checked ? ' line-through text-gray-400' : '')} 
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

                                <div className="flex items-center">
                                    <span className="material-symbols-rounded" onClick={() => handlePositionUp(item.id)}>expand_less</span>
                                    <span className="material-symbols-rounded" onClick={() => handlePositionDown(item.id)}>expand_more</span>
                                </div>
                            </div>
                        </div>
                        )}
                    </div>
            )}
        </div>
    );
}
