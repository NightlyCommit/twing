import {TwingTemplate} from "../template";
import {isMap} from "./is-map";
import {TwingErrorRuntime} from "../error/runtime";
import {examineObject} from "./examine-object";
import {TwingEnvironment} from "../environment";
import {isPlainObject} from "./is-plain-object";
import {get} from "./get";

const isBool = require('locutus/php/var/is_bool');
const isFloat = require('locutus/php/var/is_float');
const isObject = require('isobject');

/**
 * Returns the attribute value for a given array/object.
 *
 * @param {TwingEnvironment} env
 * @param {*} object The object or array from where to get the item
 * @param {*} item The item to get from the array or object
 * @param {Map<any, any>} _arguments A map of arguments to pass if the item is an object method
 * @param {string} type The type of attribute (@see Twig_Template constants)
 * @param {boolean} isDefinedTest Whether this is only a defined check
 * @param {boolean} ignoreStrictCheck Whether to ignore the strict attribute check or not
 * @param {boolean} sandboxed
 *
 * @return {Promise<any>} The attribute value, or a boolean when isDefinedTest is true, or null when the attribute is not set and ignoreStrictCheck is true
 *
 * @throw {TwingErrorRuntime} if the attribute does not exist and Twing is running in strict mode and isDefinedTest is false
 */
export const getAttribute = (env: TwingEnvironment, object: any, item: any, _arguments: Map<any, any> = new Map(), type: string = TwingTemplate.ANY_CALL, isDefinedTest: boolean = false, ignoreStrictCheck: boolean = false, sandboxed: boolean = false): Promise<any> => {
    let _do = (): any => {
        let message: string;

        // ANY_CALL or ARRAY_CALL
        if (type !== TwingTemplate.METHOD_CALL) {
            let arrayItem;

            if (isBool(item)) {
                arrayItem = item ? 1 : 0;
            } else if (isFloat(item)) {
                arrayItem = parseInt(item);
            } else {
                arrayItem = item;
            }

            if (object) {
                if ((isMap(object) && (object as Map<any, any>).has(arrayItem)) || (isPlainObject(object) && Reflect.has(object, arrayItem))) {
                    if (isDefinedTest) {
                        return true;
                    }

                    return get(object, arrayItem);
                }
            }

            if ((type === TwingTemplate.ARRAY_CALL) || (isMap(object)) || (object === null) || (typeof object !== 'object')) {
                if (isDefinedTest) {
                    return false;
                }

                if (ignoreStrictCheck || !env.isStrictVariables()) {
                    return;
                }

                if (isMap(object)) {
                    if ((object as Map<any, any>).size < 1) {
                        message = `Index "${arrayItem}" is out of bounds as the array is empty.`;
                    } else {
                        message = `Index "${arrayItem}" is out of bounds for array [${[...(object as Map<any, any>).values()]}].`;
                    }
                } else if (type === TwingTemplate.ARRAY_CALL) {
                    // object is another kind of object
                    if (object === null) {
                        message = `Impossible to access a key ("${item}") on a null variable.`;
                    } else {
                        message = `Impossible to access a key ("${item}") on a ${typeof object} variable ("${object.toString()}").`;
                    }
                } else if (object === null) {
                    // object is null
                    message = `Impossible to access an attribute ("${item}") on a null variable.`;
                } else {
                    // object is a primitive
                    message = `Impossible to access an attribute ("${item}") on a ${typeof object} variable ("${object}").`;
                }

                throw new TwingErrorRuntime(message);
            }
        }

        // ANY_CALL or METHOD_CALL
        if ((object === null) || (!isObject(object)) || (isMap(object))) {
            if (isDefinedTest) {
                return false;
            }

            if (ignoreStrictCheck || !env.isStrictVariables()) {
                return;
            }

            if (object === null) {
                message = `Impossible to invoke a method ("${item}") on a null variable.`;
            } else if (isMap(object)) {
                message = `Impossible to invoke a method ("${item}") on an array.`;
            } else {
                message = `Impossible to invoke a method ("${item}") on a ${typeof object} variable ("${object}").`;
            }

            throw new TwingErrorRuntime(message);
        }

        if (object instanceof TwingTemplate) {
            throw new TwingErrorRuntime('Accessing TwingTemplate attributes is forbidden.');
        }

        // object property
        if (type !== TwingTemplate.METHOD_CALL) {
            if (Reflect.has(object, item) && (typeof object[item] !== 'function')) {
                if (isDefinedTest) {
                    return true;
                }

                if (sandboxed) {
                    env.checkPropertyAllowed(object, item);
                }

                return get(object, item);
            }
        }

        // object method
        // precedence: getXxx() > isXxx() > hasXxx()
        let methods: Array<string> = [];

        for (let property of examineObject(object)) {
            let candidate = object[property];

            if (typeof candidate === 'function') {
                methods.push(property);
            }
        }

        methods.sort();

        let lcMethods: Array<string> = methods.map((method) => {
            return method.toLowerCase();
        });

        let candidates = new Map();

        for (let i = 0; i < methods.length; i++) {
            let method: string = methods[i];
            let lcName: string = lcMethods[i];

            candidates.set(method, method);
            candidates.set(lcName, method);

            let name: string;

            if (lcName[0] === 'g' && lcName.indexOf('get') === 0) {
                name = method.substr(3);
                lcName = lcName.substr(3);
            } else if (lcName[0] === 'i' && lcName.indexOf('is') === 0) {
                name = method.substr(2);
                lcName = lcName.substr(2);
            } else if (lcName[0] === 'h' && lcName.indexOf('has') === 0) {
                name = method.substr(3);
                lcName = lcName.substr(3);

                if (lcMethods.includes('is' + lcName)) {
                    continue;
                }
            } else {
                continue;
            }

            // skip get() and is() methods (in which case, name is empty)
            if (name) {
                if (!candidates.has(name)) {
                    candidates.set(name, method);
                }

                if (!candidates.has(lcName)) {
                    candidates.set(lcName, method);
                }
            }
        }

        let itemAsString: string = item as string;
        let method: string = null;
        let lcItem: string;

        if (candidates.has(item)) {
            method = candidates.get(item);
        } else if (candidates.has(lcItem = itemAsString.toLowerCase())) {
            method = candidates.get(lcItem);
        } else {
            if (isDefinedTest) {
                return false;
            }

            if (ignoreStrictCheck || !env.isStrictVariables()) {
                return;
            }

            throw new TwingErrorRuntime(`Neither the property "${item}" nor one of the methods ${item}()" or "get${item}()"/"is${item}()"/"has${item}()" exist and have public access in class "${object.constructor.name}".`);
        }

        if (isDefinedTest) {
            return true;
        }

        if (sandboxed) {
            env.checkMethodAllowed(object, method);
        }

        return get(object, method).apply(object, [..._arguments.values()]);
    };

    try {
        return Promise.resolve(_do());
    } catch (e) {
        return Promise.reject(e);
    }
};
