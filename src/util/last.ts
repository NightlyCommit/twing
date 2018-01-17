import TwingEnvironment from "../environment";

import slice from '../util/slice';

/**
 * Returns the last element of the item.
 *
 * @param {TwingEnvironment} env
 * @param item A variable
 *
 * @returns The last element of the item
 */
export default function twingLast(env: TwingEnvironment, item: any) {
    let elements = slice(env, item, -1, 1, false);

    return typeof elements === 'string' ? elements : elements.first();
}