/**
 *
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace GridAPI.Filter {
    /**
     * Function that returns a boolean if the grid has data visible
     *
     * @export
     * @param {string} gridID ID of the Grid that is to be to check from results.
     * @returns {*}  {boolean} true if there are visible results.
     */
    export function HasResults(gridID: string): boolean {
        if (!OSFramework.Helper.IsGridReady(gridID)) return;
        const grid = GridManager.GetGridById(gridID);
        return grid.hasResults();
    }

    /**
     *
     *
     * @export
     * @param {string} gridID
     * @param {string} searchedValue
     * @returns {*}  {string}
     */
    export function Search(gridID: string, searchedValue: string): string {
        PerformanceAPI.SetMark('Filter.search');

        let returnMessage = {
            isSuccess: true,
            message: 'Success',
            code: OSFramework.Enum.ErrorCodes.GRID_SUCCESS
        };

        if (!OSFramework.Helper.IsGridReady(gridID)) {
            returnMessage = {
                isSuccess: false,
                message: 'Grid not found',
                code: OSFramework.Enum.ErrorCodes.CFG_GridNotFound
            };
            return JSON.stringify(returnMessage);
        }
        try {
            const grid = GridManager.GetGridById(gridID);

            //The method below can be removed after the implementation of wijmo.grid.search
            grid.dataSource.search(searchedValue);

            if (grid.features.selection.hasValidSelection() === false) {
                if (grid.hasResults()) {
                    grid.features.selection.selectAndFocusFirstCell();
                }
            }

            grid.gridEvents.trigger(
                OSFramework.Event.Grid.GridEventType.SearchEnded,
                grid
            );
        } catch (error) {
            returnMessage = {
                isSuccess: false,
                message: 'Error',
                code: OSFramework.Enum.ErrorCodes.API_FailedFilterSearch
            };
        }

        PerformanceAPI.SetMark('Filter.search-end');
        PerformanceAPI.GetMeasure(
            '@datagrid-Filter.search',
            'Filter.search',
            'Filter.search-end'
        );

        return JSON.stringify(returnMessage);
    }

    /**
     * Function that activates filter of a given column
     *
     * @export
     * @param {string} gridID ID of the Grid that is to be to check from results.
     * @param {string} columnID ID of the column that will have filter activated.
     * @returns {*}  {void}
     */
    export function Activate(gridID: string, columnID: string): void {
        PerformanceAPI.SetMark('Filter.activate');
        if (!OSFramework.Helper.IsGridReady(gridID)) return;
        const grid = GridManager.GetGridById(gridID);

        grid.features.filter.activate(columnID);

        PerformanceAPI.SetMark('Filter.activate-end');
        PerformanceAPI.GetMeasure(
            '@datagrid-Filter.activate',
            'Filter.activate',
            'Filter.activate-end'
        );
    }

    /**
     * Function that clears filter of a given column
     *
     * @export
     * @param {string} gridID ID of the Grid that is to be to check from results.
     * @param {string} columnID ID of the column that will have filter cleared.
     * @returns {*}  {void}
     */
    export function Clear(gridID: string, columnID: string): void {
        PerformanceAPI.SetMark('Filter.clear');
        if (!OSFramework.Helper.IsGridReady(gridID)) return;
        const grid = GridManager.GetGridById(gridID);

        grid.features.filter.clear(columnID);

        PerformanceAPI.SetMark('Filter.clear-end');
        PerformanceAPI.GetMeasure(
            '@datagrid-Filter.clear',
            'Filter.clear',
            'Filter.clear-end'
        );
    }
    /**
     * Function that deactivates filter of a given column
     *
     * @export
     * @param {string} gridID ID of the Grid that is to be to check from results.
     * @param {string} columnID ID of the column that will have filter deactivated.
     * @returns {*}  {void}
     */
    export function Deactivate(gridID: string, columnID: string): void {
        PerformanceAPI.SetMark('Filter.deactivate');

        if (!OSFramework.Helper.IsGridReady(gridID)) return;
        const grid = GridManager.GetGridById(gridID);
        grid.features.filter.deactivate(columnID);

        PerformanceAPI.SetMark('Filter.deactivate-end');
        PerformanceAPI.GetMeasure(
            '@datagrid-Filter.deactivate',
            'Filter.deactivate',
            'Filter.deactivate-end'
        );
    }

    /**
     * Function that filters a column by condition
     *
     * @export
     * @param {string} gridID ID of the Grid that is to be to check from results.
     * @param {string} columnID ID of the column that will be filtered.
     * @param {string} values Values on which the column will be filtered by.
     * @returns {*}  {void}
     */
    export function ByCondition(
        gridID: string,
        columnID: string,
        values: string
    ): void {
        PerformanceAPI.SetMark('Filter.ByCondition');

        if (!OSFramework.Helper.IsGridReady(gridID)) return;
        const grid = GridManager.GetGridById(gridID);

        grid.features.filter.byCondition(columnID, JSON.parse(values));

        PerformanceAPI.SetMark('Filter.ByCondition-end');
        PerformanceAPI.GetMeasure(
            '@datagrid-Filter.ByCondition',
            'Filter.ByCondition',
            'Filter.ByCondition-end'
        );
    }

    /**
     * Function that filters a column by value
     *
     * @export
     * @param {string} gridID ID of the Grid that is to be to check from results.
     * @param {string} columnID ID of the column that will be filtered.
     * @param {string} values Values on which the column will be filtered by.
     * @returns {*}  {void}
     */
    export function ByValue(
        gridID: string,
        columnID: string,
        values: string
    ): void {
        PerformanceAPI.SetMark('Filter.ByValue');

        if (!OSFramework.Helper.IsGridReady(gridID)) return;
        const grid = GridManager.GetGridById(gridID);

        grid.features.filter.byValue(columnID, JSON.parse(values));

        PerformanceAPI.SetMark('Filter.ByValue-end');
        PerformanceAPI.GetMeasure(
            '@datagrid-Filter.ByValue',
            'Filter.ByValue',
            'Filter.ByValue-end'
        );
    }

    /**
     * Function that sets column filter options
     *
     * @export
     * @param {string} gridID ID of the Grid block.
     * @param {string} columnID ID of the column block where the filter options will be set.
     * @param {string} options  Values that will be used on filter by value list.
     * @param {number} maxVisibleOptions Maximum number of elements on the filter list of display values.
     * @returns {*}  {void}
     */
    export function SetColumnFilterOptions(
        gridID: string,
        columnID: string,
        options: string,
        maxVisibleOptions?: number
    ): void {
        PerformanceAPI.SetMark('Filter.SetColumnFilterOptions');

        if (!OSFramework.Helper.IsGridReady(gridID)) return;
        const grid = GridManager.GetGridById(gridID);

        grid.features.filter.setColumnFilterOptions(
            columnID,
            JSON.parse(options),
            maxVisibleOptions
        );

        PerformanceAPI.SetMark('Filter.SetColumnFilterOptions-end');
        PerformanceAPI.GetMeasure(
            '@datagrid-Filter.SetColumnFilterOptions',
            'Filter.SetColumnFilterOptions',
            'Filter.SetColumnFilterOptions-end'
        );
    }
}
