import TwingEnvironment from "../environment";
import TwingSource from "../source";
import TwingTemplate from "../template";
import TwingErrorRuntime from "../error/runtime";

const capitalize = require('capitalize');

export default function twingGetAttribute(env: TwingEnvironment, source: TwingSource, object: any, item: any, _arguments: Array<any> = [], type: string = TwingTemplate.ANY_CALL, isDefinedTest: boolean = false, ignoreStrictCheck: boolean = false) {
    // console.warn('twingGetAttribute', arguments);


    let message: string;

    let isFloat = function (data: any) {
        return !isNaN(data) && !Number.isInteger(data);
    };

    // ANY_CALL or ARRAY_CALL
    if (type !== TwingTemplate.METHOD_CALL) {
        let arrayItem;

        if (typeof item === 'boolean') {
            arrayItem = item ? 1 : 0;
        }
        else if (isFloat(item)) {
            arrayItem = parseInt(item);
        }
        else {
            arrayItem = item;
        }

        if (object) {
            if (Array.isArray(object) && object[arrayItem]) {
                if (isDefinedTest) {
                    return true;
                }

                return object[arrayItem];
            }
            else if (object instanceof Map && object.has(item)) {
                if (isDefinedTest) {
                    return true;
                }

                return object.get(item);
            }
            else if (typeof object === 'object' && Reflect.has(object, item) && (typeof Reflect.get(object, item) !== 'function')) {
                if (isDefinedTest) {
                    return true;
                }

                return Reflect.get(object, item);
            }
        }

        if ((type === TwingTemplate.ARRAY_CALL) || (Array.isArray(object)) || (object instanceof Map) || (object === null) || (typeof object !== 'object')) {
            if (isDefinedTest) {
                return false;
            }

            if (ignoreStrictCheck || !env.isStrictVariables()) {
                return;
            }

            if (Array.isArray(object)) {
                // object is an array
                if (object.length < 1) {
                    message = `Index "${arrayItem}" is out of bounds as the array is empty.`;
                }
                else {
                    message = `Index "${arrayItem}" is out of bounds for array [${object}].`;

                }
            }
            else if (object instanceof Map) {
                // object is a map
                if (object === null) {
                    message = `Impossible to access a key ("${item}") on a null variable.`;
                }
                else {
                    message = `Impossible to access a key ("${item}") on a ${typeof object} variable ("${object.toString()}").`;
                }
            }
            else if (type === TwingTemplate.ARRAY_CALL) {
                // object is another kind of object
                if (object === null) {
                    message = `Impossible to access a key ("${item}") on a null variable.`;
                }
                else {
                    message = `Impossible to access a key ("${item}") on a ${typeof object} variable ("${object.toString()}").`;
                }
            }
            else if (object === null) {
                // object is null
                message = `Impossible to access an attribute ("${item}") on a null variable.`;
            }
            else {
                // object is a primitive
                message = `Impossible to access an attribute ("${item}") on a ${typeof object} variable ("${object.toString()}").`;
            }

            throw new TwingErrorRuntime(message, -1, source);
        }
    }

    // ANY_CALL or METHOD_CALL
    if ((object === null) || (typeof object !== 'object')) {
        // object is a primitive
        if (isDefinedTest) {
            return false;
        }

        if (ignoreStrictCheck || !env.isStrictVariables()) {
            return;
        }

        if (object === null) {
            message = `Impossible to invoke a method ("${item}") on a null variable.`;
        }
        else {
            message = `Impossible to invoke a method ("${item}") on a ${typeof object} variable ("${object}").`;
        }

        throw new TwingErrorRuntime(message, -1, source);
    }

    // object method
    // precedence: getXxx() > isXxx() > hasXxx()
    let functionName;
    let getFallback = `get${capitalize(item)}`;
    let isFallback = `is${capitalize(item)}`;
    let hasFallback = `has${capitalize(item)}`;

    if (Reflect.has(object, item)) {
        functionName = item;
    }
    else if (Reflect.has(object, getFallback)) {
        functionName = getFallback;
    }
    else if (Reflect.has(object, isFallback)) {
        functionName = isFallback;
    }
    else if (Reflect.has(object, hasFallback)) {
        functionName = hasFallback;
    }
    else if (Reflect.has(object, '__call')) {
        functionName = '__call';

        _arguments.unshift(item);
    }
    else {
        if (isDefinedTest) {
            return false;
        }

        if (ignoreStrictCheck || !env.isStrictVariables()) {
            return;
        }

        throw new TwingErrorRuntime(`Neither the property "${item}" nor one of the methods ${item}()", "${getFallback}()", "${isFallback}()" or "${hasFallback}()" or "__call()" exist in class "${object.constructor.name}".`, -1, source);
    }

    if (isDefinedTest) {
        return true;
    }

    return Reflect.get(object, functionName).apply(object, _arguments);
};