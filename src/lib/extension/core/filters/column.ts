import {isTraversable} from "../../../helpers/is-traversable";
import {iteratorToMap} from "../../../helpers/iterator-to-map";
import {TwingErrorRuntime} from "../../../error/runtime";
import {isPlainObject} from "../../../helpers/is-plain-object";

/**
 * Return the values from a single column in the input array.
 *
 * <pre>
 *  {% set items = [{ 'fruit' : 'apple'}, {'fruit' : 'orange' }] %}
 *
 *  {% set fruits = items|column('fruit') %}
 *
 *  {# fruits now contains ['apple', 'orange'] #}
 * </pre>
 *
 * @param {*} thing An iterable
 * @param {*} columnKey The column key
 *
 * @return {Promise<Array<any>>} The array of values
 */
export function column(thing: any, columnKey: any): Promise<Array<any>> {
    let map: Map<any, any>;

    if (!isTraversable(thing) || isPlainObject(thing)) {
        throw new TwingErrorRuntime(`The column filter only works with arrays or "Traversable", got "${typeof thing}" as first argument.`);
    } else {
        map = iteratorToMap(thing);
    }

    let result: any[] = [];

    for (let value of map.values()) {
        let valueAsMap: Map<any, any> = iteratorToMap(value);

        for (let [key, value] of valueAsMap) {
            if (key === columnKey) {
                result.push(value);
            }
        }
    }

    return Promise.resolve(result);
}
