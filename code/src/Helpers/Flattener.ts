// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace Helper {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    export function Flatten(obj: JSON): any {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let keys: any;
        // eslint-disable-next-line prefer-const
        let transformedObj = {};
        Object.keys(obj).forEach((lineCol) => {
            keys = Object.keys(obj[lineCol]);

            if (typeof obj[lineCol] === 'string' || keys.length === 0) {
                transformedObj[lineCol] = obj[lineCol];
            } else {
                keys.forEach((prop) => {
                    let proname = prop;
                    if (transformedObj.hasOwnProperty(prop))
                        proname = lineCol + '.' + prop;
                    transformedObj[proname] = obj[lineCol][prop];
                });
            }
        });
        return transformedObj;
    }

    export function FlattenArray(dataArray: [JSON]): JSON[] {
        const returnDataArray = [];
        dataArray.forEach((item) => {
            returnDataArray.push(Flatten(item));
        });

        return returnDataArray;
    }
}
