// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace Providers.DataGrid.Wijmo.Feature {
    export class ColumnFreeze
        implements
            OSFramework.DataGrid.Feature.IColumnFreeze,
            OSFramework.DataGrid.Interface.IBuilder
    {
        private _grid: Grid.IGridWijmo;

        constructor(grid: Grid.IGridWijmo) {
            this._grid = grid;
        }

        public get isFrozen(): boolean {
            return this._grid.provider.frozenColumns !== 0;
        }

        public build(): void {
            // Implementing interface
        }

        public byActiveSelection(): void {
            this.leftColumns();
        }

        public bySelection(
            cell: OSFramework.DataGrid.OSStructure.CellRange
        ): void {
            this.leftColumns(cell.topRowIndex);
        }

        public firstColumn(): void {
            this.leftColumns(1);
        }

        public leftColumns(n?: number): void {
            if (n !== undefined) {
                if (n < 0) {
                    throw new Error(
                        OSFramework.DataGrid.Enum.ErrorMessages.FreezeColumnPositiveNumberExpected
                    );
                }
                this._grid.provider.frozenColumns = n;
            } else {
                const activeCell =
                    this._grid.features.selection.getActiveCell();

                if (activeCell !== undefined) {
                    this._grid.provider.frozenColumns =
                        activeCell.leftColumnIndex + 1;
                }
            }
        }

        public unfreeze(): void {
            this.leftColumns(0);
        }
    }
}
