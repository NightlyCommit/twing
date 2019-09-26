import {TwingEnvironment} from "../../../environment";
import {slice} from "./slice";
import {first as firstHelper} from "../../../helpers/first";

/**
 * Returns the first element of the item.
 *
 * @param {TwingEnvironment} env
 * @param {*} item A variable
 *
 * @returns {*} The first element of the item
 */
export function first(env: TwingEnvironment, item: any) {
    let elements = slice(env, item, 0, 1, false);

    return typeof elements === 'string' ? elements : firstHelper(elements);
}
