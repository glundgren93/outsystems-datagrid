// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace Providers.DataGrid.Wijmo.Grid {
    export namespace GridFactory {
        export function MakeGrid(
            type: OSFramework.DataGrid.Enum.GridType,
            gridID: string,
            configs: OSFramework.DataGrid.Configuration.IConfiguration<OSFramework.DataGrid.Types.IGridProviderConfigs>
        ): OSFramework.DataGrid.Grid.IGrid {
            switch (type) {
                case OSFramework.DataGrid.Enum.GridType.FlexGrid:
                    return new FlexGrid(gridID, configs);
                default:
                    throw `There is no factory for this type of grid (${type})`;
            }
        }
    }
}
