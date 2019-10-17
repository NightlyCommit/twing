import {first as firstHelper} from "../../../helpers/first";
import {slice as sliceFilter} from "./slice";

/**
 * Returns the first element of the item.
 *
 * @param {any} item
 *
 * @returns {Promise<any>} The first element of the item
 */
export function first(item: any): Promise<any> {
    return sliceFilter(item, 0, 1, false).then((elements) => {
        return typeof elements === 'string' ? elements : firstHelper(elements);
    });
}
