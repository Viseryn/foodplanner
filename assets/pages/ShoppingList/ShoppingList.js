/***********************************************
 * ./assets/pages/ShoppingList/ShoppingList.js *
 ***********************************************/

import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';

import generateDisplayName from '../../util/generateDisplayName';

import AddItemInputWidget from './components/AddItemInputWidget'
import Heading from '../../components/ui/Heading';
import Spinner from '../../components/ui/Spinner';
import IconButton from '../../components/ui/Buttons/IconButton';
import Button from '../../components/ui/Buttons/Button';
import { floatToFraction, fractionToFloat } from '../../util/fractions';
import Spacer from '../../components/ui/Spacer';
import Card from '../../components/ui/Card';

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
 * @property {arr} shoppingList 
 * @property {function} setShoppingList
 * @property {boolean} isLoadingShoppingList
 * @property {function} setLoadingShoppingList
 */
export default function ShoppingList(props) {
    /**
     * updateItem
     * 
     * Updates one item with the given ID in the items state variable.
     * The properties that should be changed, as well as their values,
     * can be passed as an optional parameter.
     * 
     * @param {int} id The ID of the item that should be changed.
     * @param {Object} properties The properties that should be changed and their values.
     */
    const updateItem = (id, properties = {}) => {
        // Create a new list of items
        let newList = [...props.shoppingList];

        // Find index of the item that will be changed
        const itemIndex = findItemById(id);

        // Change properties of selected item
        Object.keys(properties).forEach(key => {
            newList[itemIndex][key] = properties[key];
        });

        // Set new item list to the state variable
        props.setShoppingList(newList);
    }

    /**
     * findItemById
     * 
     * @param {int} id 
     * @return Returns the index of the item with the given ID in the items state variable or -1 if item does not exist.
     */
    const findItemById = (id) => {
        let returnVal = -1;

        props.shoppingList.forEach((item, index) => {
            if (item.id === id) {
                returnVal = index;
            } 
        });

        return returnVal;
    };

    /**
     * handleCombine
     * 
     * Handler for combining items on the list with the same name.
     */
    const handleCombine = () => {
        let list = [...props.shoppingList];  // Working copy of item list
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
                    // Convert fractions to floats
                    origItem.quantity_value = fractionToFloat(origItem.quantity_value);
                    item.quantity_value = fractionToFloat(item.quantity_value);

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
            item.name = generateDisplayName(
                floatToFraction(item.quantity_value), 
                item.quantity_unit, 
                item.originalName
            );
        });

        // Update the state variable
        props.setShoppingList(appearedItems);
                
        // Refresh Data Timestamp
        axios.get('/api/refresh-data-timestamp/set')
    };

    /**
     * handlePantryCombine
     */
    const handlePantryCombine = () => {
        let pantry = JSON.parse(JSON.stringify(props.pantry));

        // Give each pantry item negative quantity value
        pantry.forEach(item => {
            // Quantity value can be a (mixed) fraction, so take care
            item.quantity_value = '-' + item.quantity_value;
        });

        // Combine ShoppingList and Pantry into one list
        let list = [...props.shoppingList, ...pantry];

        // Now we do the same as in handleCombine, with the difference
        // that we remove each item that has non-positive quantity afterwards.
        // This will only leave the original shopping list items or less,
        // with their new quantity values.

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
                    // Convert fractions to floats
                    origItem.quantity_value = fractionToFloat(origItem.quantity_value);
                    item.quantity_value = fractionToFloat(item.quantity_value);

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
            item.name = generateDisplayName(
                floatToFraction(item.quantity_value), 
                item.quantity_unit, 
                item.originalName
            );
        });

        // Filter all items that have negative quantity value
        appearedItems = appearedItems.filter(item => item.quantity_value > 0 || !item.quantity_value && item.quantity_value !== 0);

        // Update the state variable
        props.setShoppingList(appearedItems);
                
        // Refresh Data Timestamp
        axios.get('/api/refresh-data-timestamp/set')
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
            'checked': !props.shoppingList[findItemById(id)].checked,
            'editable': false,
        });
                
        // WORKAROUND FOR @todo IN CONTROLLER
        axios.get('/api/refresh-data-timestamp/set')
    };

    /**
     * handleDeleteChecked
     * 
     * A handler for onClick events of the delete button.
     * When clicked, filters out all items that are checked.
     */
    const handleDeleteChecked = () => {
        const newList = props.shoppingList.filter(item => {
            return !item.checked;
        })

        props.setShoppingList(newList);
                
        // WORKAROUND FOR @todo IN CONTROLLER
        axios.get('/api/refresh-data-timestamp/set')
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
        props.shoppingList.forEach(item => {
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
        if (event.target.value.replace(/\s/g, '').length) {
            updateItem(id, {
                name: event.target.value.trim(),
                editable: false,
            })
                
            // Refresh Data Timestamp
            axios.get('/api/refresh-data-timestamp/set')
        }
    };

    /**
     * handlePositionChange
     * 
     * Moves the given item up or down in the Shopping List.
     * 
     * @param {number} id The id of the given item.
     * @param {number} direction Possible values are -1 (up) and 1 (down).
     */
    const handlePositionChange = (id, direction) => {
        let items = [...props.shoppingList];

        const index = findItemById(id);
        const oldPosition = items[index].position;
        const newPosition = items[index + direction]?.position;

        // Move item up only when it is not the first item and 
        // move item down only when it is not the last item.
        if (
            (direction === -1 && index !== 0)
            || (direction === 1 && index !== props.shoppingList.length - 1)
        ) {
            items[index].position = newPosition;
            items[index + direction].position = oldPosition;

            [items[index], items[index + direction]] = [items[index + direction], items[index]];
    
            // Update list
            props.setShoppingList(items);
                
            // Refresh Data Timestamp
            axios.get('/api/refresh-data-timestamp/set')
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
            title: 'Wirklich alle Zutaten löschen?',
            buttons: {
                cancel: 'Abbrechen',
                confirm: 'Löschen',
            },
        }).then((confirm) => {
            if (confirm) {
                props.setShoppingList([]);
                
                // Refresh Data Timestamp
                axios.get('/api/refresh-data-timestamp/set')
            }
        });
    }

    /**
     * Load sidebar
     */ 
    useEffect(() => {
        props.setSidebarActiveItem('shoppinglist');
        props.setSidebarActionButton();

        // Scroll to top
        window.scrollTo(0, 0);
    }, []);

    useEffect(() => {
        props.setSidebarActionButton({
            visible: true, 
            icon: 'remove_done', 
            label: 'Erledigte löschen',
            onClickHandler: handleDeleteChecked,
        });
    }, [props.shoppingList]);

    /**
     * Update shopping list items from state to database
     */
    useEffect(() => {
        // Do not make an AJAX request on the first time (items init)
        if (first.current) {
            first.current = false;
            return;
        }

        // Send items data to API
        axios.post('/api/shoppinglist/update', JSON.stringify(props.shoppingList));
    }, [props.shoppingList]);

    let first = useRef(true);

    /**
     * Render
     */
    return (
        <div className="pb-[6.5rem] pt-4 md:pt-9 w-full md:w-[450px]">
            <div className="flex justify-between items-start pr-4 md:pr-0">
                <Heading style="px-6 md:px-4">Einkaufsliste</Heading>

                {/* Delete and update buttons */}
                <div>
                    {props.shoppingList.length > 0 && 
                        <IconButton onClick={handleDeleteAll}>delete_forever</IconButton>
                    }
                    <IconButton onClick={() => props.setLoadingShoppingList(true)}>sync</IconButton>
                </div>
            </div>

            <Spacer height="10" />
            
            <div className="mx-4 md:mx-0">
                <AddItemInputWidget
                    items={props.shoppingList}
                    {...props}
                />
            </div>

            <Spacer height="10" />

            {props.isLoadingShoppingList ? (
                <Spinner />
            ) : (
                <>
                    <Card style="mx-4 md:mx-0">
                        <div className="space-y-2 justify-center">
                            {props.shoppingList.length === 0 &&
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center">
                                        <span className="material-symbols-rounded outlined mr-4">info</span>
                                        Die Einkaufsliste ist leer.
                                    </div>
                                </div>
                            }

                            {props.shoppingList.map(item =>
                                <div key={item.id} className="flex justify-between items-center" >
                                    <div className="flex items-center" >
                                        <input 
                                            id={item.id} 
                                            type="checkbox" 
                                            className="w-4 h-4 mr-4 text-primary-100 bg-[#e0e4d6] rounded-sm border-[#c3c8bb] dark:bg-[#43483e] dark:border-[#8d9286] focus:ring-primary-100 focus:ring-2 peer"
                                            onChange={() => handleCheckboxChange(item.id)} 
                                            checked={item.checked}
                                        />

                                        <div 
                                            className={'break-words' + (item.checked ? ' line-through text-[#74796d]' : '')} 
                                            onClick={event => handleItemClick(event, item.id, item.editable)}
                                        >
                                            {item.editable ? (
                                                <input 
                                                    className="bg-transparent border rounded-md"
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

                                    <div className="flex gap-2">
                                        <IconButton onClick={() => handlePositionChange(item.id, -1)}>expand_less</IconButton>
                                        <IconButton onClick={() => handlePositionChange(item.id, 1)}>expand_more</IconButton>
                                    </div>
                                </div>
                            )}
                        </div>
                    </Card>

                    {props.shoppingList.length >= 1 &&
                        <div className="flex flex-col items-end justify-end gap-4 pt-6 pb-20 md:pb-0 mx-4 md:mx-0">
                            {props.settings.showPantry && props.pantry.length > 0 &&
                                <Button
                                    onClick={handlePantryCombine}
                                    label="Vorräte verrechnen"
                                    icon="cell_merge"
                                    role="tertiary"
                                    small={true}
                                />
                            }
                            <Button
                                onClick={handleCombine}
                                icon="low_priority"
                                label="Zutaten zusammenfassen"
                                role="tertiary"
                                small={true}
                            />
                        </div>
                    }
                </>
            )}
        </div>
    );
}
