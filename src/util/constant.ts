import TwingEnvironment from "../environment";

/**
 * Provides the ability to get constants from instances as well as class/global constants.
 *
 * Global or class constants make no sense in JavaScript. To emulate the expected behavior, it is assumed that
 * so-called constants are keys of the TwingEnvironment::globals property.
 *
 * @param {TwingEnvironment} env The environment
 * @param {string} constant The name of the constant
 * @param object The object to get the constant from
 *
 * @returns {string}
 */
export default function twingConstant(env: TwingEnvironment, constant: string, object: any) {
    let globals: any = env.getGlobals();
    let bucket: any;

    if (object && typeof object === 'object') {
        let className = object.constructor.name;

        bucket = globals[className];
    }
    else {
        bucket = globals;
    }

    if (bucket) {
        return bucket[constant];
    }

    return null;
}