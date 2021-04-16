/**
 * Namespace used to aggregate Columns definition
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace Column {
    /**
     * Base behavior of a Column
     * @description By inheritance each new Column will have base behavior like building the provider.
     * @template T Base configuration type
     * @abstract
     */
    export abstract class AbstractColumn<T extends IConfigurationColumn>
        implements IColumn {
        /** Configuration reference */
        private _configs: T;
        /** Internal reference to Grid component */
        private _grid: Grid.IGrid;
        /** Id reference for the closest OS widget Columns.Group */
        private _parentGroupId: string;
        /** Indicates if the mapping of Ids was already performed */
        private _preBuilt: boolean;
        /** Internal unique value used to identify columns */
        private _uniqueId: string;
        /** Id reference for the OS Column widget */
        private _widgetId: string;
        /** Indicates if the component was built */
        protected _built: boolean;
        /** External events associated to the column */
        protected _columnEvents: ExternalEvents.ColumnEventsManager;
        /** Verifies if the column has associated events */
        abstract hasEvents: boolean;

        /**
         * @param grid Grid where the column is located
         * @param columnID Column UniqueId
         * @param configs Column's configuration definition
         */
        constructor(grid: Grid.IGrid, columnID: string, configs: T) {
            this._grid = grid;
            this._uniqueId = columnID;
            this._configs = configs;
        }

        public get config(): T {
            return this._configs;
        }

        protected get isPreBuilt(): boolean {
            //Columns autogenerated won't need a pre build
            return this.isPreBuilt || this.config.autoGenerated;
        }

        public get grid(): Grid.IGrid {
            return this._grid;
        }

        public get hasParentColumn(): boolean {
            return this._parentGroupId !== undefined;
        }

        public get isReady(): boolean {
            return this._built;
        }

        public get parentColumnId(): string {
            return this._parentGroupId;
        }

        public get uniqueId(): string {
            return this._uniqueId;
        }

        public get widgetId(): string {
            return this._widgetId;
        }

        /**
         * Find the closest Group
         * @param elem the element which the search will be based on
         */
        private _findParentGroup(elem: Element): string {
            const group = elem.closest(Helper.Constants.columnGroupTag);

            if (group !== null) {
                return group.firstElementChild // Consider that the GenericColumn widget is the first element on GroupColumn
                    .querySelector(Helper.Constants.columnUniqueIdCss)
                    .getAttribute('name');
            }

            //Has no parent
            return undefined;
        }

        /**
         * Needs to run before building columns, to map Ids and Groups
         */
        protected _preBuild(): void {
            if (this._preBuilt) return;

            //When the column was autogenerated, there's no OutSystems html for the column, so no need to try to get the widget ID.
            if (!this._configs.autoGenerated) {
                const unique = Helper.GetElementByUniqueId(this._uniqueId);
                let widget = unique.closest(
                    Helper.Constants.outsystemsWidgetTag
                );

                //If available save its Id
                if (this.config.genericColumnId === widget.id) {
                    //Look find the parent data-block of the genericCol
                    widget = widget.parentElement.closest(
                        Helper.Constants.outsystemsWidgetTag
                    );
                }

                this._widgetId = widget.id;
                this._parentGroupId = this._findParentGroup(
                    widget.parentElement
                );
            }

            this._preBuilt = true;
        }

        /**
         * Responsable for building the columns provider
         */
        public build(): void {
            if (this._built) return;
            this._built = true;

            this._configs.dataType = this.providerType;

            this._preBuild();
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
        public changeProperty(propertyName: string, propertyValue: any): void {
            //Update the column's config when the property is available
            if (this.config.hasOwnProperty(propertyName)) {
                this.config[propertyName] = propertyValue;

                if (this.isReady) {
                    this.applyConfigs();
                }
            } else {
                throw new Error(
                    `changeProperty - Property '${propertyName}' can't be changed.`
                );
            }
        }

        public dispose(): void {
            this._built = false;
        }

        public equalsToID(id: string): boolean {
            return (
                id === this._uniqueId ||
                id === this.config.genericColumnId ||
                id === this._widgetId ||
                id === this.config.binding
            );
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        public getProviderConfig(): any {
            return this._configs.getProviderConfig();
        }

        public indexPosition(): number {
            //RGRIDT-574 review after solved
            //Today we are sorting an array of columns on FlexGrid._buildColumns
            //Will be executed N times (N = number of columns) when a grid is builded
            if (this.config.autoGenerated) return -1;

            const gridElement = Helper.GetElementByWidgetId(
                this._grid.widgetId
            );
            const thisColumn = Helper.GetElementByWidgetId(this._widgetId);

            return _.toArray(
                gridElement.querySelectorAll(Helper.Constants.columnCss)
            )
                .map((p) => p.parentNode)
                .indexOf(thisColumn);
        }

        public refresh(): void {
            this.applyConfigs();
        }

        abstract get columnEvents(): ExternalEvents.ColumnEventsManager;

        abstract get columnType(): ColumnType;

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        abstract get provider(): any;

        // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
        abstract set provider(provider: any);

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        abstract get providerType(): any;

        /** Responsable for applying config definitions to the current provider */
        abstract applyConfigs(): void;
    }
}
