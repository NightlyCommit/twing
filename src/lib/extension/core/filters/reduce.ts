import {iteratorToMap} from "../../../helpers/iterator-to-map";

export function reduce(map: any, callback: (accumulator: any, currentValue: any) => any, initial: any = null): Promise<string> {
    map = iteratorToMap(map);

    let values: any[] = [...map.values()];

    return Promise.resolve(values.reduce((previousValue: any, currentValue: any): any => {
        return (async () => callback(await previousValue, currentValue))();
    }, initial));
}
