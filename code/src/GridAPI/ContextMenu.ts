// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace GridAPI.ContextMenu {
    /**
     * Map a MenuItem.UniqueId to its Grid.UniqueId
     * Help us to know where to add/remove items
     */
    const _menuItemsToGridId = new Map<string, string>(); //menuOption.uniqueId -> grid.uniqueId

    /**
     * Returns the GridId based on the menuItemId
     * @param menuItemId UniqueId of our MenuItem
     * @param lookUpDOM Search in DOM by the parent Grid
     */
    export function GetGridByMenuId(
        menuItemId: string,
        lookUpDOM = true
    ): string {
        //Try to find in DOM only if not present on Map
        if (lookUpDOM && !_menuItemsToGridId.has(menuItemId)) {
            const menuOptionElement = OSFramework.Helper.GetElementByUniqueId(
                menuItemId
            );
            const grid = OSFramework.Helper.GetClosestGrid(menuOptionElement);

            if (grid) {
                _menuItemsToGridId.set(menuItemId, grid.uniqueId);
            }
        }

        return _menuItemsToGridId.get(menuItemId);
    }

    /**
     * Responsible for adding menu items
     * @param menuItemId UniqueId defined on OS side
     * @param label Label presented on menu
     * @param enabled Flag used to enable the menu item
     * @param clickEvent Function executed by the menu item
     */
    export function AddItem(
        menuItemId: string,
        label: string,
        enabled: boolean,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        clickEvent: OSFramework.Callbacks.ContextMenu.OSClickEvent
    ): void {
        const gridID = GetGridByMenuId(menuItemId);

        if (gridID !== undefined) {
            const grid = GridManager.GetGridById(gridID);

            if (grid !== undefined) {
                GridManager.Events.Subscribe(
                    gridID,
                    OSFramework.Event.Grid.GridEventType.Initialized,
                    (gridId: string, gridObj: OSFramework.Grid.IGrid) => {
                        gridObj.features.contextMenu.addMenuItem(
                            menuItemId,
                            label,
                            enabled,
                            clickEvent
                        );
                    }
                );
            } else {
                //the grid was not found
                throw `The context menu item ${label} is being placed in a grid that doesn't exist`;
            }
        } else {
            //the block is put uncorrectly outside the grid
            throw `The context menu item ${label} is not placed correctly in the grid`;
        }
    }

    export function AddSeparator(menuItemId: string): void {
        const gridID = GetGridByMenuId(menuItemId);

        if (gridID !== undefined) {
            const grid = GridManager.GetGridById(gridID);

            if (grid !== undefined) {
                GridManager.Events.Subscribe(
                    gridID,
                    OSFramework.Event.Grid.GridEventType.Initialized,
                    (gridId: string, gridObj: OSFramework.Grid.IGrid) => {
                        gridObj.features.contextMenu.addMenuItemSeparator(
                            menuItemId
                        );
                    }
                );
            } else {
                //the grid was not found
                throw "The context menu separator is being placed in a grid that doesn't exist";
            }
        } else {
            throw 'The context menu separator is not placed correctly in the grid';
        }
    }

    export function ChangeProperty(
        menuItemId: string,
        propertyName: string,
        // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
        propertyValue: any
    ): void {
        const gridID = GetGridByMenuId(menuItemId, false);

        if (gridID !== undefined) {
            const grid = GridManager.GetGridById(gridID);

            grid &&
                grid.features.contextMenu.changeProperty(
                    menuItemId,
                    propertyName,
                    propertyValue
                );
        }
    }

    export function RemoveItem(menuItemId: string): void {
        const gridID = GetGridByMenuId(menuItemId, false);

        if (gridID !== undefined) {
            const grid = GridManager.GetGridById(gridID, false);

            grid && grid.features.contextMenu.removeMenuItem(menuItemId);
            _menuItemsToGridId.delete(menuItemId);
        }
    }
}
