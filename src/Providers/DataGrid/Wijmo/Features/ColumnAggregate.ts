// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace Providers.DataGrid.Wijmo.Feature {
    // export class Builder extends Validation implements OSFramework.DataGrid.Interface.IBuilder {
    export class ColumnAggregate
        implements
            OSFramework.DataGrid.Feature.IColumnAggregate,
            OSFramework.DataGrid.Interface.IBuilder
    {
        private _aggregateRow: wijmo.grid.GroupRow;
        private _grid: Grid.IGridWijmo;
        private _showAggregateValue: boolean;

        constructor(grid: Grid.IGridWijmo, showAggregateValue: boolean) {
            this._grid = grid;
            this._showAggregateValue = showAggregateValue;
        }
        public build(): void {
            this.setState(this._showAggregateValue);
        }

        /**
         * Function that will add/remove row footer to show aggregate values
         *
         * @param value {boolean} True => Adds aggregate footer , False => Removes aggregate footer
         */
        public setState(value: boolean): void {
            if (value) {
                if (this._aggregateRow === undefined) {
                    this._aggregateRow = new wijmo.grid.GroupRow();
                }
                this._grid.provider.columnFooters.rows.push(this._aggregateRow);
            } else {
                const aggregateRow =
                    this._grid.provider.columnFooters.rows.find(
                        (row) => row.index === this._aggregateRow.index
                    );

                // we only want to remove the row, if it exists
                if (aggregateRow)
                    this._grid.provider.columnFooters.rows.remove(aggregateRow);
            }
        }
    }
}
