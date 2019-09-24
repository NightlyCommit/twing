import {TwingEnvironment} from "../../../environment";

/**
 * Provides the ability to get constants from instances as well as class/global constants.
 *
 * Constant function makes no sense in JavaScript. To emulate the expected behavior, it is assumed that
 * so-called constants are keys of the environment constructor or the passed object constructor.
 *
 * @param {TwingEnvironment} env The environment
 * @param {string} name The name of the constant
 * @param object The object to get the constant from
 *
 * @returns {any}
 */
export function constant(env: TwingEnvironment, name: string, object: any = null): any {
    let candidate: any;

    if (object) {
        candidate = object;
    } else {
        candidate = env;
    }

    return candidate.constructor[name];
}
