// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.DataGrid.Column {
    /**
     * Representantion of a Grid's Column
     */
    export interface IColumn
        extends Interface.IDisposable,
            Interface.ISearchById,
            Interface.IBuilder {
        columnEvents: Event.Column.ColumnEventsManager;
        /** Internal ColumnType */
        columnType: Enum.ColumnType;
        /** The config used to build the column */
        config: Configuration.IConfigurationColumn;
        /** Returns the grid instance where the column is placed */
        grid: Grid.IGrid;
        /** Verifies if this column has associated events */
        hasEvents: boolean;
        /** Verifies if this column is contained inside another */
        hasParentColumn: boolean;
        /** Indicates when the Column is available */
        isReady: boolean;
        /** Stores the uniqueId of the ParentColumn */
        parentColumnId: string;
        /** Stores the reference to the Provider's column instance */
        provider: wijmo.grid.ColumnGroup;
        /** Returns the column index in the provider */
        providerIndex: number;
        /** Gets the provider's column type */
        providerType: wijmo.DataType;
        /** Gets the unique identifier */
        uniqueId: string;
        /** Gets the OS-Widget Id */
        widgetId: string;
        /** Used to change configs properties */
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        changeProperty(propertyName: string, propertyValue: any): void;
        /** Returns the configuration used to build column provider */
        getProviderConfig(): DataGrid.Types.IColumnProviderConfigs;
        /** Look to DOM searching for OS widget index inside the Structures.Grid
         * @returns -1 for no relation
         */
        indexPosition(): number;
        /**
         * Refresh a column object, re-applying its configuration
         */
        refresh(): void;
    }
}
