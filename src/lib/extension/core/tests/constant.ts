import {constant as constantFunction} from "../functions/constant";
import {TwingEnvironment} from "../../../environment";

/**
 * @param {TwingEnvironment} env
 * @param {*} value
 * @param {string} name
 * @param {*} object
 *
 * @return *
 */
export function constant(env: TwingEnvironment, value: any, name: string, object: any): boolean {
    return value === constantFunction(env, name, object);
}
