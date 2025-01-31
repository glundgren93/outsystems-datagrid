// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.DataGrid.Enum {
    /**
     * Available messages indicating wheter an action was not successful or not
     */
    export enum ErrorMessages {
        AddRowErrorMessage = 'An error occurred while trying to add a new row.',
        AddRowExceedingPageSize = "You can't add this amount of rows on the selected row, because this client action only works with the visible page. You can either change the NumberOfRows amount or select another row.",
        AddRowGreaterThanPageSize = 'It seems that you are trying to add an invalid amount of rows. The NumberOfRows must be less or equal to the RowsPerPage.',
        AddRowLowerThanOne = 'It seems that you are trying to add an invalid amount of rows. The NumberOfRows must greater than 0.',
        AddRowWithActiveFilterOrSort = 'It seems that you have an active filter, group or sort on your columns. Remove them and try again.',
        Aggregate_NotFound = 'The aggregate you have passed does not exist.',
        Column_NotFound = 'Column not found',
        CustomizeExportingMessageEmptyString = 'It seems you are passing an empty message. Please pass a valid message.',
        FreezeColumnPositiveNumberExpected = 'Unable to freeze column. Please use a positive number.',
        Grid_NotFound = 'Grid not found.',
        InvalidColumnIdentifier = 'It seems you are not passing a valid column.',
        ReorderRowOnGridWithCheckbox = 'It seems you are trying to reorder rows on a grid with checkboxes. This is not allowed',
        ReorderRowWithActiveSort = "It seems you are trying to reorder rows when grid is sorted. Grid can't be sorted.",
        Row_EmptyList = 'Rows list is empty.',
        Row_InvalidRowDataKey = 'The data key is invalid.',
        Row_InvalidStartingRowHeader = 'The starting row header is invalid.',
        Row_ListEmptyValues = 'Rows list has empty values.',
        Row_NotFound = 'Row not found.',
        SetRowAsSelected = 'Grids with RowCheckbox as RowHeader has this capability disabled.',
        SuccessMessage = 'Success',
        UnableToAddRow = 'Unable to add row. Please use ArrangeData action to serialize your data.',
        RemoveRowErrorMessage = 'An error occurred while trying to remove rows.'
    }
}
