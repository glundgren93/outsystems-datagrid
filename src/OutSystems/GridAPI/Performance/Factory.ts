/// <reference path="PerformanceDebugMode.ts" />
/// <reference path="PerformanceProdMode.ts" />

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OutSystems.GridAPI.Performance {
    export namespace Factory {
        export function MakePerformance(isDebug: boolean): IPerformance {
            if (isDebug) {
                return new PerformanceDebugMode();
            }
            return new PerformanceProdMode();
        }
    }
}
