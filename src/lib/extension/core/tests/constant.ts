import {constant} from "../functions/constant";
import {TwingEnvironment} from "../../../environment";

/**
 * @param {TwingEnvironment} env
 * @param {*} value
 * @param {string} name
 * @param {*} object
 *
 * @return *
 */
export function twingTestConstant(env: TwingEnvironment, value: any, name: string, object: any): boolean {
    return value === constant(env, name, object);
}
