/***********************************
 * ./assets/pages/Pantry/Pantry.js *
 ***********************************/

import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';

import generateDisplayName from '../../util/generateDisplayName';

import AddItemInputWidget from './components/AddItemInputWidget'
import Heading from '../../components/ui/Heading';
import Spinner from '../../components/ui/Spinner';
import IconButton from '../../components/ui/IconButton';
import Button from '../../components/ui/Buttons';

/**
 * Pantry
 * 
 * A component for showing the pantry.
 * Contains an input widget for adding new 
 * items to the list.
 * 
 * The list is kept synchronized with the 
 * database. An Ingredient object is considered
 * part of the pantry if it has 
 * storageId = 1, and if it has no recipeId.
 * 
 * @component
 * @property {function} setSidebarActiveItem
 * @property {function} setSidebarActionButton
 * @property {arr} pantry 
 * @property {function} setPantry
 * @property {boolean} isLoadingPantry
 * @property {function} setLoadingPantry
 */
export default function Pantry(props) {
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
        let newList = [...props.pantry];

        // Find index of the item that will be changed
        const itemIndex = findItemById(id);

        // Change properties of selected item
        Object.keys(properties).forEach(key => {
            newList[itemIndex][key] = properties[key];
        });

        // Set new item list to the state variable
        props.setPantry(newList);
    }

    /**
     * findItemById
     * 
     * @param {int} id 
     * @return Returns the index of the item with the given ID in the items state variable or -1 if item does not exist.
     */
    const findItemById = (id) => {
        let returnVal = -1;

        props.pantry.forEach((item, index) => {
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
        let list = [...props.pantry];  // Working copy of item list
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
                    // Check whether a quantity value is '1/2' and convert to 0.5
                    if (origItem.quantity_value === '1/2') origItem.quantity_value = 0.5;
                    if (item.quantity_value === '1/2') item.quantity_value = 0.5;

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
        props.setPantry(appearedItems);
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
            setTimeout(() => {}, 200);
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
        props.pantry.forEach(item => {
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
                name: event.target.value,
                editable: false,
            })
        }
    };

    /**
     * handlePositionChange
     * 
     * Moves the given item up or down in the pantry.
     * 
     * @param {number} id The id of the given item.
     * @param {number} direction Possible values are -1 (up) and 1 (down).
     */
    const handlePositionChange = (id, direction) => {
        let items = [...props.pantry];

        const index = findItemById(id);
        const oldPosition = items[index].position;
        const newPosition = items[index + direction]?.position;

        // Move item up only when it is not the first item and 
        // move item down only when it is not the last item.
        if (
            (direction === -1 && index !== 0)
            || (direction === 1 && index !== props.pantry.length - 1)
        ) {
            items[index].position = newPosition;
            items[index + direction].position = oldPosition;

            [items[index], items[index + direction]] = [items[index + direction], items[index]];
    
            // Update list
            props.setPantry(items);
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
                props.setPantry([]);
            }
        });
    }

    /**
     * Load sidebar
     */ 
    useEffect(() => {
        props.setSidebarActiveItem('pantry');
        props.setSidebarActionButton();

        // Scroll to top
        window.scrollTo(0, 0);
    }, []);

    /**
     * Update pantry items from state to database
     */
    useEffect(() => {
        // Do not make an AJAX request on the first time (items init)
        if (first.current) {
            first.current = false;
            return;
        }

        // Send items data to API
        axios.post('/api/pantry/update', JSON.stringify(props.pantry));
    }, [props.pantry]);

    let first = useRef(true);

    /**
     * Render
     */
    return (
        <div className="px-6 pb-24 pt-6 md:pb-6 md:my-6 md:mr-6 w-full min-h-screen md:min-h-fit bg-white dark:bg-[#29353f] md:rounded-3xl md:w-[450px]">
            <div className="flex justify-between items-start">
                <Heading>Vorratskammer</Heading>

                {/* Delete and update buttons */}
                <div>
                    <IconButton onClick={handleDeleteAll}>delete_forever</IconButton>
                    <IconButton onClick={() => props.setLoadingPantry(true)}>sync</IconButton>
                </div>
            </div>
            
            <AddItemInputWidget
                items={props.pantry}
                {...props}
            />

            {props.isLoadingPantry ? (
                <Spinner /> /** @todo Add Skeleton here */
            ) : (
                <>
                    <div className="space-y-2 max-w-[400px] justify-center">
                        {props.pantry.length === 0 &&
                            <div className="rounded-full p-2 h-14 flex justify-between items-center transition duration-300 hover:bg-gray-100 dark:hover:bg-[#252f38]">
                                <div className="pl-4 flex items-center">
                                    <span className="material-symbols-rounded outlined mr-4">info</span>
                                    Die Vorratskammer ist leer.
                                </div>
                            </div>
                        }

                        {props.pantry.map(item =>
                            <div key={item.id} className="rounded-full p-2 flex justify-between items-center transition duration-300 hover:bg-gray-100 dark:hover:bg-[#252f38]">
                                <div className="pl-4 flex items-center">
                                    <div 
                                        className={'md:max-w-[220px] break-words' + (item.checked ? ' line-through text-gray-400' : '')} 
                                        onClick={event => handleItemClick(event, item.id, item.editable)} /** @todo Move that to parent */
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
                    
                    {props.pantry.length > 1 &&
                        <div className="flex justify-end gap-4 mt-6">
                            <Button
                                onClick={handleCombine}
                                label="Zusammenfassen"
                                icon="low_priority"
                                elevated={true}
                            />
                        </div>
                    }
                </>
            )}
        </div>
    );
}
