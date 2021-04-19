// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace WijmoProvider.Column {
    export class DropdownColumn extends AbstractProviderColumn<OSFramework.Configuration.Column.ColumnConfigDropdown> {
        constructor(
            grid: OSFramework.Grid.IGrid,
            columnID: string,
            configs: JSON,
            extraConfig: JSON
        ) {
            super(
                grid,
                columnID,
                new OSFramework.Configuration.Column.ColumnConfigDropdown(
                    configs,
                    extraConfig
                )
            );
            this.config.dataMap = new wijmo.grid.DataMap([], 'key', 'text');
            this._columnEvents = new OSFramework.Event.Column.ColumnEventsManager(
                this
            );
        }

        /** Returns all the events associated to the column */
        public get columnEvents(): OSFramework.Event.Column.ColumnEventsManager {
            return this._columnEvents;
        }

        public get columnType(): OSFramework.Enum.ColumnType {
            return OSFramework.Enum.ColumnType.Dropdown;
        }

        public get providerType(): wijmo.DataType {
            return wijmo.DataType.String;
        }

        public applyConfigs(): void {
            if (this.isReady) {
                const providerConfig = this.getProviderConfig();
                delete providerConfig.dataMap;

                wijmo.copy(this.provider, providerConfig);
            } else {
                console.log('applyConfigs - Column needs to be build');
            }
        }

        public build(): void {
            (this.config
                .dataMap as wijmo.grid.DataMap).collectionView.sourceCollection = this.config.dropdownOptions;
            this.config.dataMapEditor = wijmo.grid.DataMapEditor.DropDownList;

            super.build();
        }

        // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
        public changeProperty(propertyName: string, propertyValue: any): void {
            switch (propertyName) {
                case 'dropdownOptions':
                    // eslint-disable-next-line
                    const dataMap = this.config.dataMap as wijmo.grid.DataMap;
                    // eslint-disable-next-line
                    const values = JSON.parse(propertyValue) as [];
                    this.config.dropdownOptions = values;
                    dataMap.collectionView.sourceCollection = values;
                    dataMap.collectionView.refresh();
                    break;
                default:
                    super.changeProperty(propertyName, propertyValue);
            }
        }
    }
}
