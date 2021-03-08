/**
 * Defines the interface for buildable objects
 */
/* eslint-disable @typescript-eslint/no-unused-vars */
interface IBuilder {
    /**
     * Build object, instantiating dependencies, and maniulating DOM when necessary
     */
    build(): void;
}

/**
 * Defines the interface for disposable objects
 */
interface IDisposable {
    /**
     * Dispose object and free up its used resources
     */
    dispose(): void;
}

/**
 * Defines the interface for objects with multiple DOM identifiers
 */
interface ISearchById {
    /**
     * Validates if object matched with the given id
     */
    equalsToID(id: string): boolean;
}

interface IValidation {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    validateAction(action: InternalEvents.Actions, ctx: any): string;
}

/**
 * Used to configure a feature. For example turnning on and off
 */
interface IProviderConfig<T> {
    /**
     * Set the Feature state
     * @param value The new state state of a feature
     */
    setState(value: T): void;
}

/**
 * Used to translate configurations from OS to Provider
 * Defines the basic structure for all config objects
 */
interface IConfiguration {
    /**
     * Method responsable for the translation of configuration from OS to Provider
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    getProviderConfig(): any;
}

/**
 * Used to translate configurations from OS to Provider
 * Defines the basic structure for grid objects
 */
interface IConfigurationGrid extends IConfiguration {
    /**
     * Represents the identifier created on OS and used as reference to find objects on screen
     */
    uniqueId: string;
}

/**
 * Used to translate configurations from OS to Provider
 * Defines the basic structure for column objects
 */
interface IConfigurationColumn extends IConfiguration {
    /** Defines how data should be aligned */
    align: string;
    /** Indicates when a column was autoGenerated */
    autoGenerated: boolean;
    /** The datasource property used to print values on the column */
    binding: string;
    /** A provider value!
     * This defines the type of the column */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    dataType: any;
    /** A provider value!
     * A reference to the class used to instantiate the editor */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    editor: any;
    /** The format used to print data on screen.
     * This property is used only for data visualization.
     * @example Date fields can be DD/MM/YYYY
     */
    format: string;
    /** Id reference for the internal GenericColumn widget */
    genericColumnId: string;
    /** The header of a column */
    header: string;
    /** Defines when the column can or not be empty */
    required: boolean;
    /**
     * Represents the identifier created on OS and used as reference to find objects on screen
     */
    uniqueId: string;
}

/**
 * Defines a basic interface for Custom column Editors
 */
interface IConfigurationColumnEditor extends IConfiguration {
    /** The format used to print data on screen.
     * This property is used only for data visualization.
     * @example Date fields can be DD/MM/YYYY
     */
    format: string;
    /** Defines when the column can or not be empty */
    required: boolean;
}

/**
 * Define signature for OS communications
 * This method should be defined wherever need a JSON.stringify
 *
 * @example GridAPI.Selection.getAllSelectionsDataSource
 */
interface ISerializable {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    serialize(): any;
}

/**
 * Interface for saving and loaging grid view
 */
interface IView {
    /**
     * Get the current view
     */
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
    getViewConfig(): any;
    /**
     * Load the given view
     * @param view A JSON representing a previous saved visualization
     */
    setViewConfig(view: any): void;
}
