import {empty} from "../tests/empty";

export function defaultFilter(value: any, defaultValue: any = ''): Promise<any> {
    return empty(value).then((isEmpty) => {
        if (isEmpty) {
            return Promise.resolve(defaultValue);
        } else {
            return Promise.resolve(value);
        }
    });
}
