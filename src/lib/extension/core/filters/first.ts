import {TwingEnvironment} from "../../../environment";
import {twingFilterSlice} from "./slice";
import {first} from "../../../helpers/first";

/**
 * Returns the first element of the item.
 *
 * @param {TwingEnvironment} env
 * @param {*} item A variable
 *
 * @returns {*} The first element of the item
 */
export function twingFilterFirst(env: TwingEnvironment, item: any) {
    let elements = twingFilterSlice(env, item, 0, 1, false);

    return typeof elements === 'string' ? elements : first(elements);
}
