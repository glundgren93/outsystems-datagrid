// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.DataGrid.Configuration.Column {
    /**
     * Defines the configuration for Date and Datetime custom editors
     */
    export class EditorConfigDate extends AbstractEditorConfig {
        public defaultFormat: string;
        public format: string;
        public max: Date;
        public min: Date;

        // eslint-disable-next-line
        constructor(config: DataGrid.Types.IDateColumnExtraConfigs, isDateTime: boolean) {
            super(config);
            this.defaultFormat = `${OutSystems.GridAPI.dateFormat}${
                isDateTime ? ' HH:mm' : ''
            }`;

            this.format = this.format || this.defaultFormat;
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        public getProviderConfig(): DataGrid.Types.IDateEditorProviderConfigs {
            // eslint-disable-next-line prefer-const
            let provider = {
                format: this.format,
                isRequired: this.required,
                min: this.min,
                max: this.max
            };

            //Cleanning undefined properties
            Object.keys(provider).forEach(
                (key) => provider[key] === undefined && delete provider[key]
            );

            return provider;
        }
    }
}
