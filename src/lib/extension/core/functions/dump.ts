import {iterate} from "../../../helpers/iterate";
import {isTraversable} from "../../../helpers/is-traversable";
import {iteratorToHash} from "../../../helpers/iterator-to-hash";
import {count} from "../../../helpers/count";

/**
 * Adapted from https://github.com/kvz/locutus/blob/master/src/php/var/var_dump.js
 */
let varDump = function (...args: any[]): string {
    let padChar = ' ';
    let padVal = 4;
    let length = 0;

    let getInnerVal = function _getInnerVal(val: any) {
        let result = '';

        if (val === null || typeof val === 'undefined') {
            result = 'NULL';
        } else if (typeof val === 'boolean') {
            result = 'bool(' + val + ')';
        } else if (typeof val === 'number') {
            if (parseFloat('' + val) === parseInt('' + val, 10)) {
                result = 'int(' + val + ')';
            } else {
                result = 'float(' + val + ')';
            }
        } else if (typeof val === 'function') {
            result = 'object(Closure) (0) {}';
        } else {
            result = 'string(' + val.length + ') "' + val + '"';
        }

        return result;
    };

    let formatArray = (obj: any, curDepth: number, padVal: number, padChar: string) => {
        if (isTraversable(obj)) {
            obj = iteratorToHash(obj);
        }

        if (curDepth > 0) {
            curDepth++;
        }

        let baseCount = padVal * (curDepth - 1);
        let thickCount = padVal * (curDepth + 1);

        let basePad = padChar.repeat(baseCount > 0 ? baseCount : 0);
        let thickPad = padChar.repeat(thickCount);
        let str: string = '';
        let val: string;

        if (typeof obj === 'object' && obj !== null) {
            length = count(obj);

            str += 'array(' + length + ') {\n';

            for (let key in obj) {
                let objVal = obj[key];

                if ((typeof objVal === 'object') && (objVal !== null) && !(objVal instanceof Date)) {
                    str += thickPad;
                    str += '[';
                    str += key;
                    str += '] =>\n';
                    str += thickPad;
                    str += formatArray(objVal, curDepth + 1, padVal, padChar);
                } else {
                    val = getInnerVal(objVal);
                    str += thickPad;
                    str += '[';
                    str += key;
                    str += '] =>\n';
                    str += thickPad;
                    str += val;
                    str += '\n';
                }
            }

            str += basePad + '}\n';
        } else {
            str = getInnerVal(obj) + '\n';
        }

        return str;
    };

    let output: string[] = [];

    for (let arg of args) {
        output.push(formatArray(arg, 0, padVal, padChar));
    }

    return output.join('');
};

export function dump(context: any, ...vars: Array<any>): Promise<string> {
    if (vars.length < 1) {
        let vars_: Map<any, any> = new Map();

        return iterate(context, (key: any, value: any): Promise<void> => {
            vars_.set(key, value);

            return;
        }).then(() => {
            return varDump(vars_);
        });
    }

    return Promise.resolve(varDump(...vars));
}
