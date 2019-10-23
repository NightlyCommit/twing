import {iteratorToMap} from "../../../helpers/iterator-to-map";

export function reduce(map: any, callback: Function, initial: any = null): Promise<string> {
    map = iteratorToMap(map);

    let values: any[] = Array.from(map.values());

    return Promise.resolve(values.reduce((previousValue: any, currentValue: any): any => {
        return callback(previousValue, currentValue);
    }, initial));
}
