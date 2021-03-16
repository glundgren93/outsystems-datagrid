// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace Features {
    type _ErrorMessage = { code: number; message: string };

    /**
     * Exposed methods for manipulating rows
     */
    export interface IRows {
        /**
         * Add a CSS class to a specific row from the grid.
         */
        addClass(rowNumber: number, className: string);
        /**
         * Add new rows to the grid. If there is a selection it will add as many rows as selected. If not, it will add a row at the top.
         */
        addNewRows(): void;
        /**
         * Clears all the metadata associated to the cssClasses from the row
         */
        clear(): void;
        /**
         * Clear all classes from a specific row.
         */
        clearClasses(rowNumber: number): void;
        /**
         * Remove a single class from a specific row.
         */
        removeClass(rowNumber: number, className: string);
        /**
         * Remove the rows that are selected.
         */
        removeSelectedRows(): void;
        /**
         * Set the private newItem to be used when a new row is added.
         */
        setNewItem(item: unknown): void;
    }

    class CssClass {
        /**
         * Contains all CSS classes from a specific row.
         */
        public cssClass: Array<string>;

        constructor() {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            this.cssClass = new Array<string>();
        }
    }

    class GridInsertRowAction extends wijmo.undo.UndoableAction {
        constructor(
            grid: wijmo.grid.FlexGrid,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            undoableItems: { datasourceIdx: number; items: any[] }
        ) {
            super(grid);
            this._oldState = { action: 'remove', ...undoableItems };
            this._newState = undoableItems;
            const cv = grid.itemsSource;
            cv.trackChanges && cv.itemsAdded.push(...undoableItems.items);
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        public applyState(state: any) {
            const cv = this._target.itemsSource;
            if (cv) {
                if (state.action === 'remove') {
                    //undo
                    state.items.forEach((item) => {
                        cv.remove(item);
                        cv.trackChanges && cv.itemsAdded.remove(item);
                    });
                } else {
                    //redo
                    cv.sourceCollection.splice(
                        state.datasourceIdx,
                        0,
                        ...state.items
                    );
                    cv.trackChanges && cv.itemsAdded.push(...state.items);
                }
                cv.refresh();
                cv.moveCurrentToPosition(state.datasourceIdx);
                this._target.focus();
            }
        }
    }

    export class Rows implements IBuilder, IRows {
        private _grid: Grid.IGridWijmo;

        private readonly _internalLabel = '__cssClass';

        private _metadata: Grid.IRowMetadata;

        // newItem will be set during grid's setData
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        private _newItem: any;

        constructor(grid: Grid.IGridWijmo) {
            this._grid = grid;
            this._metadata = this._grid.rowMetadata;
        }

        /**
         * Check if it is possible to add rows to the grid.
         * @returns Boolean indicating if it is possible to add rows to the grid.
         */
        private _canAddRows(): boolean {
            return (
                !this._grid.features.sort.isGridSorted &&
                !this._grid.features.groupPanel.isGridGrouped &&
                !this._grid.features.filter.isGridFiltered
            );
        }

        /**
         * Check if it is possible to remove rows from the grid.
         * @returns Boolean indicating if it is possible to remove rows from the grid.
         */
        private _canRemoveRows(): boolean {
            return (
                !this._grid.features.sort.isGridSorted &&
                !this._grid.features.groupPanel.isGridGrouped &&
                !this._grid.features.filter.isGridFiltered
            );
        }

        /**
         * Handler for the formatItems event
         */
        private _formatItems(
            grid: wijmo.grid.FlexGrid,
            e: wijmo.grid.FormatItemEventArgs
        ) {
            if (
                e.panel.cellType === wijmo.grid.CellType.Cell &&
                this.getMetadata(e.row).cssClass.length > 0
            ) {
                wijmo.addClass(
                    e.cell,
                    this.getMetadata(e.row).cssClass.join(' ')
                );
            }
        }

        /**
         * Get all the rows from the grid, including rows from other pages.
         * @returns Sum of rows from all the pages from the grid.
         */
        private _getRowsCount(): number {
            return this._grid.features.pagination.rowTotal;
        }

        /**
         * Get the index of the row from the top of the current selection.
         * @returns Index of the top row from the current selection.
         */
        private _getTopRow(): number {
            const topRow = Math.min(
                ...this._grid.features.selection
                    .getAllSelections()
                    .map((cellRange) => cellRange.topRowIndex)
            );
            // Consider the topRow 0 if there is no selection.
            return topRow === Infinity ? 0 : topRow;
        }

        /**
         * Add a CSS class to a specific row from the grid.
         * @param rowNumber Number of the row in which the class is going to be added.
         * @param className CSS class to add to the row.
         */
        public addClass(rowNumber: number, className: string): void {
            if (
                this.getMetadata(rowNumber).cssClass.indexOf(className) === -1
            ) {
                // If the className is not on the array of classes from the row, than push it to the array.
                this.getMetadata(rowNumber).cssClass.push(className);
            }
        }

        /**
         * Add a new row to the grid with all cells empty.
         * @returns ErrorMessage containing the resulting code from the adding rows and the error message in case of failure.
         */
        public addNewRows(): _ErrorMessage {
            if (!this._canAddRows()) {
                // Return error
                return {
                    code: 201,
                    message:
                        'It seems that you have an active filter, group or sort on your columns. Remove them and try again.'
                };
            }

            if (!this._newItem) {
                return {
                    code: 400,
                    message:
                        "If you use auto generated columns and JSONSerialize, you can't add new rows. Also, if you are using columns, JSONSerialize and the grid has no data, you can't add new rows."
                };
            }

            const providerGrid = this._grid.provider;
            const dataSource = providerGrid.collectionView;
            const topRowIndex = this._getTopRow();
            // The datasource index of the selection's top row. Requires the page index and the page size.
            const dsTopRowIndex =
                topRowIndex + this._grid.features.pagination.rowStart - 1;
            // Consider the quantity 1 if there is no selection.
            const quantity =
                this._grid.features.selection.getSelectedRowsCountByCellRange() ||
                1;
            const expectedRowCount = this._getRowsCount() + quantity;
            const items = [];

            providerGrid.focus(); // In case of Undo action, the user will not need to click on the grid to undo.

            for (let i = quantity; i > 0; i--) {
                const _newItem = _.cloneDeep(this._newItem);

                dataSource.deferUpdate(() => {
                    dataSource.sourceCollection.splice(
                        dsTopRowIndex,
                        0,
                        _newItem
                    );
                });
                // Push a new item to the items list to pass it later to the Undoable action.
                items.push(_newItem);
                // Trigger the method responsible for setting the row as new in the metadata of the row
                this._grid.addedRows.trigger(topRowIndex);
            }

            // Makes sure the first cell from the recently added top row is selected.
            this._grid.features.selection.selectAndFocusFirstCell(topRowIndex);

            // Take care of the undoable action Add new rows.
            const undoableItems = { datasourceIdx: dsTopRowIndex, items };
            this._grid.features.undoStack.pushAction(
                new GridInsertRowAction(providerGrid, undoableItems)
            );

            // Make sure the count of rows is correct after adding rows.
            if (this._getRowsCount() === expectedRowCount) {
                // Return success
                return { code: 200, message: 'Success' };
            } else {
                return { code: 400, message: 'Error' };
            }
        }

        public build(): void {
            this._grid.provider.formatItem.addHandler(
                this._formatItems.bind(this)
            );
        }

        /** Clears all the cssClass metadata associated to the rows */
        public clear(): void {
            this._metadata.clearProperty(this._internalLabel);
            this._grid.provider.invalidate(); //Mark to be refreshed
        }

        /**
         * Clear all CSS classes from a specific row on the grid.
         * @param rowNumber Number of the row in which the class is going to be removed.
         */
        public clearClasses(rowNumber: number): void {
            this.getMetadata(rowNumber).cssClass = [];
            this._grid.provider.invalidate(); //Mark to be refreshed
        }

        /**
         * Gets the metadata associated to the cssClasses for a specific row.
         * @param rowNumber Number of the row to check if there is any metadata associated to the cssClasses.
         * @returns CssClass of the row specified.
         */
        public getMetadata(row: number): CssClass {
            if (!this.hasMetadata(row))
                this._metadata.setMetadata(
                    row,
                    this._internalLabel,
                    new CssClass()
                );

            return this._metadata.getMetadata(
                row,
                this._internalLabel
            ) as CssClass;
        }

        /**
         * Indicates if a specific row has any metadata associated to the cssClasses.
         * @param rowNumber Number of the row to check if there is any metadata associated to the cssClasses.
         * @returns Boolean that indicates whether a specific row has metadata associated to the cssClasses.
         */
        public hasMetadata(row: number): boolean {
            return this._metadata.hasOwnProperty(row, this._internalLabel);
        }

        /**
         * Remove a CSS class from a specific row on the grid.
         * @param rowNumber Number of the row in which all CSS classes are going to be removed.
         * @param className CSS class to remove from the row.
         */
        public removeClass(rowNumber: number, className: string): void {
            if (
                this.getMetadata(rowNumber).cssClass.indexOf(className) !== -1
            ) {
                this.getMetadata(rowNumber).cssClass.splice(
                    this.getMetadata(rowNumber).cssClass.indexOf(className),
                    1
                );
            }
        }

        /**
         * Remove all selected rows from the grid.
         * @returns ErrorMessage containing the resulting code from the removing rows and the error message in case of failure.
         */
        public removeSelectedRows(): _ErrorMessage {
            if (!this._canRemoveRows()) {
                return {
                    code: 400,
                    message:
                        'It seems that you have an active filter, group or sort on your columns. Remove them and try again.'
                };
            }
            //This will avoid the same row being selected multiple times
            this._grid.features.selection.equalizeSelection();

            const providerGrid = this._grid.provider;
            const dataSource = providerGrid.itemsSource;
            const expectedRowCount =
                this._getRowsCount() -
                this._grid.features.selection.getSelectedRowsCountByCellRange();
            const selRanges = (this._grid.features
                .selection as IProviderSelection).getProviderAllSelections();

            // In case of Undo action, the user will not need to click on the grid to undo.
            providerGrid.focus();

            dataSource.deferUpdate(() => {
                selRanges.forEach((range) => {
                    for (
                        let row = range.bottomRow;
                        row >= range.topRow;
                        row--
                    ) {
                        // Take care of the undoable action of removing rows.
                        providerGrid.onDeletingRow(
                            new wijmo.grid.CellRangeEventArgs(
                                providerGrid.cells,
                                new wijmo.grid.CellRange(row, -1)
                            )
                        );
                        // Remove the data item from the editable collection view.
                        dataSource.remove(providerGrid.rows[row].dataItem);
                    }
                });
            });

            // Resets the selection after removing rows.
            this._grid.features.selection.selectAndFocusFirstCell();

            // Make sure the count of rows is correct after removing rows.
            if (this._getRowsCount() === expectedRowCount) {
                return { code: 200, message: 'Success' };
            } else {
                return { code: 400, message: 'Error' };
            }
        }

        /**
         * Set the new item that is going to be used as a default for the new row's dataItem.
         * @param item Item that is going to be used as a default.
         */
        public setNewItem(item: unknown): void {
            this._newItem = item;
        }
    }
}
