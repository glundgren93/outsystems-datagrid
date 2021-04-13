// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace Grid {
    export namespace GridFactory {
        export function MakeGrid(
            type: GridType,
            gridID: string,
            configs: IConfiguration
        ): IGrid {
            switch (type) {
                case GridType.FlexGrid:
                    console.log('Im testing pipeline');
                    return new FlexGrid(gridID, configs as FlexGridConfig);
                default:
                    throw `There is no factory for this type of grid (${type})`;
            }
        }
    }
}
