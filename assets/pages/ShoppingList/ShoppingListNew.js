/***********************************************
 * ./assets/pages/ShoppingList/ShoppingList.js *
 ***********************************************/

export default function ShoppingList({ shoppingList, ...props }) {
    /**
     * handleCheckboxChange
     * 
     * Checks or unchecks an item.
     */
    const handleCheckboxChange = (item) => {
        // Make a copy of shoppingList.data and find item
        let newItemList = [...shoppingList.data]
        const index = newItemList.indexOf(item)

        // Check or uncheck the item and set new shoppingList
        newItemList[index].checked = !newItemList[index].checked
        shoppingList.setData(newItemList)
        
        // API call
        axios.post('/api/shoppinglist/check-ingredient', item.id)
    }

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
                axios.get('/api/shoppinglist/delete-all')
                shoppingList.setLoading(true)
            }
        })
    }

    /**
     * Load layout
     */ 
    useEffect(() => {
        // Load sidebar
        props.setSidebar('shoppinglist')

        // Load topbar
        props.setTopbar({
            title: 'Einkaufsliste',
            actionButtons: [
                { icon: 'delete_forever', onClick: handleDeleteAll },
            ],
            style: 'md:w-[450px]',
        })

        // Scroll to top
        window.scrollTo(0, 0)
    }, [])

    /**
     * Render ShoppingList
     */
    return (
        <div className="pb-24 md:pb-4 w-full md:w-[450px]">
            <Spacer height="6" />
            
            <div className="mx-4 md:mx-0">
                <AddItemInputWidget
                    inputValue={inputValue}
                    setInputValue={setInputValue}
                />
            </div>

            <Spacer height="10" />

            {shoppingList.isLoading ? (
                <Spinner />
            ) : (
                <>
                    <Card style="mx-4 md:mx-0">
                        <div className="space-y-2 justify-center">
                            {shoppingList.data?.length === 0 &&
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center">
                                        <span className="material-symbols-rounded outlined mr-4">info</span>
                                        Die Einkaufsliste ist leer.
                                    </div>
                                </div>
                            }

                            {shoppingList.data?.map(item =>
                                <div key={item.id} className="flex justify-between items-center" >
                                    <div className="flex items-center" >
                                        <input 
                                            id={item.id} 
                                            type="checkbox" 
                                            className="w-4 h-4 mr-4 text-primary-100 bg-[#e0e4d6] rounded-sm border-[#c3c8bb] dark:bg-[#43483e] dark:border-[#8d9286] focus:ring-primary-100 focus:ring-2 peer"
                                            onChange={() => handleCheckboxChange(item)} 
                                            checked={item.checked}
                                        />

                                        <div 
                                            className={'break-words' + (item.checked ? ' line-through text-[#74796d]' : '')} 
                                        >
                                            {item.editable ? (
                                                <input 
                                                    className="bg-transparent border rounded-md"
                                                />
                                            ) : (
                                                getFullIngredientName(item)
                                            )}
                                        </div>
                                    </div>

                                </div>
                            )}
                        </div>
                    </Card>
                </>
            )}
        </div>
    )
}
