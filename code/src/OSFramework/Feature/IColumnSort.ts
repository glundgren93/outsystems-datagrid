// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.Feature {
    export interface IColumnSort
        extends Interface.IValidation,
            Interface.IProviderConfig<boolean>,
            IView {
        isGridSorted: boolean;
        clear(): void;
        isColumnSorted(columnID: string): boolean;
        sortColumn(columnID: string, ascending: OSStructure.Sorting): void;
    }
}
