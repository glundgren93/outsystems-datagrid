namespace OutSystems.GridAPI.Export {
    /**
     * Customize the exporting message of grid
     * @param gridID Grid ID
     * @param exportingMessage The message that will be shown in the grid when data is being exported.
     * @param showMessage Set to True to show a custom message when data is being exported. By default, the message shown in “Your data is being exported.”
     * @returns A JSON representing whether the operation was succesfull or not
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    export function CustomizeExportingMessage(
        gridID: string,
        exportingMessage: string,
        showMessage: boolean
    ): string {
        Performance.SetMark('Export.CustomizeExportingMessage');

        const responseObj = {
            isSuccess: true,
            message: OSFramework.DataGrid.Enum.ErrorMessages.SuccessMessage,
            code: OSFramework.DataGrid.Enum.ErrorCodes.GRID_SUCCESS
        };

        if (!OSFramework.DataGrid.Helper.IsGridReady(gridID)) {
            responseObj.isSuccess = false;
            responseObj.message =
                OSFramework.DataGrid.Enum.ErrorMessages.Grid_NotFound;
            responseObj.code =
                OSFramework.DataGrid.Enum.ErrorCodes.CFG_GridNotFound;
            return JSON.stringify(responseObj);
        }
        try {
            const grid = GridManager.GetGridById(gridID);

            grid.features.export.customizeExportingMessage(
                exportingMessage,
                showMessage
            );
        } catch (error) {
            responseObj.isSuccess = false;
            responseObj.message = error.message;
            responseObj.code =
                OSFramework.DataGrid.Enum.ErrorCodes.API_FailedCustomizeExportingMessage;
        }

        Performance.SetMark('Export.CustomizeExportingMessage-end');
        Performance.GetMeasure(
            '@datagrid-Export.CustomizeExportingMessage',
            'Export.CustomizeExportingMessage',
            'Export.CustomizeExportingMessage-end'
        );

        return JSON.stringify(responseObj);
    }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace GridAPI {
    /**
     * API used to Configure exporting behavior
     */
    export namespace Export {
        /**
         * Customize the exporting message of grid
         * @param gridID Grid ID
         * @param exportingMessage The message that will be shown in the grid when data is being exported.
         * @param showMessage Set to True to show a custom message when data is being exported. By default, the message shown in “Your data is being exported.”
         * @returns A JSON representing whether the operation was succesfull or not
         */
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        export function CustomizeExportingMessage(
            gridID: string,
            exportingMessage: string,
            showMessage: boolean
        ): string {
            OSFramework.DataGrid.Helper.LogWarningMessage(
                `${OSFramework.DataGrid.Helper.warningMessage} 'OutSystems.GridAPI.Export.CustomizeExportingMessage()'`
            );
            return OutSystems.GridAPI.Export.CustomizeExportingMessage(
                gridID,
                exportingMessage,
                showMessage
            );
        }
    }
}
