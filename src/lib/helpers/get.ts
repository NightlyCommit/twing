import {iteratorToMap} from "./iterator-to-map";
import {isMap} from "./is-map";

/**
 * Return the value of a property of an object, providing array to Map conversion.
 *
 * @param {any} object
 * @param {any} property
 */
export function get(object: any, property: any): any {
    let result: any;

    if (isMap(object) && (object as Map<any, any>).has(property)) {
        result = object.get(property);
    }
    else {
        result = object[property];
    }

    if (Array.isArray(result)) {
        result = iteratorToMap(result);
    }

    return result;
}
