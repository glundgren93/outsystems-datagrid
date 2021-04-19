namespace OSFramework.Configuration {
    /**
     * Used to translate configurations from OS to Provider
     * Defines the basic structure for grid objects
     */
    export interface IConfigurationGrid extends IConfiguration {
        /**
         * Represents the identifier created on OS and used as reference to find objects on screen
         */
        uniqueId: string;
    }
}
