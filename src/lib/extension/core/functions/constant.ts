import {TwingEnvironment} from "../../../environment";

/**
 * Provides the ability to get constants from instances as well as class/global constants.
 *
 * Constant function makes no sense in JavaScript. To emulate the expected behavior, it is assumed that
 * so-called constants are keys of the TwingEnvironment.globals property.
 *
 * @param {TwingEnvironment} env The environment
 * @param {string} name The name of the constant
 * @param object The object to get the constant from
 *
 * @returns {string}
 */
export function constant(env: TwingEnvironment, name: string, object: any) {
    let globals: any = env.getGlobals();
    let bucket: any;

    if (object && typeof object === 'object') {
        let className = object.constructor.name;

        bucket = globals.get(className);
    } else {
        bucket = globals;
    }

    return bucket.get(name);
}
