import {first} from "../../../helpers/first";
import {slice as sliceFilter} from "./slice";

/**
 * Returns the last element of the item.
 *
 * @param item A variable
 *
 * @returns The last element of the item
 */
export function last(item: any): Promise<any> {
    return sliceFilter(item, -1, 1, false).then((elements) => {
        return typeof elements === 'string' ? elements : first(elements);
    });
}
