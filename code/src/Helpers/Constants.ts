/**
 * Used to store the tags used to find DOM elements
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace Helper.Constants {
    /** Tag used to find Columns */
    export const columnCss = '.datagrid-column';
    /** Tag used to find ColumnGroups */
    export const columnGroupTag = '[data-block="Columns.GroupColumn"]';
    /** Tag used to find Column's uniqueId element */
    export const columnUniqueIdCss = '.datagrid-column-uniqueId';
    /** Tag used to find ContextMenus */
    export const contextMenuCss = '.context-menu';
    /** Tag used to find the parent MenuItem */
    export const contextSubMenuCss = '.context-menu-submenu';
    /** Tag used to find the container where the MenuItem's uniqueId was defined */
    export const contextMenuItemUniqueIdCss = '.context-menu-option';
    /** Tag used to find Grid */
    export const gridTag = '[data-block="Structures.Grid"]';
    /** Tag used to find the container where the Grid's uniqueId was defined */
    export const gridUniqueIdCss = '.datagrid-runtime';
    /** Tag used to find a generic widget */
    export const outsystemsWidgetTag = '[data-block]';
    /** Tag used to find the uniqueId property of a DOM element */
    export const uniqueIdAttribute = 'name';
}