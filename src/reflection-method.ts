import {TwingReflectionParameter} from "./reflection-parameter";

const parseFunction = require('parse-function');

export class TwingReflectionMethod {
    private name: string;
    private parameters: Array<TwingReflectionParameter>;
    private callable: Function;

    constructor(callable: Function, name: string) {
        this.name = name;

        let parser = parseFunction();

        if (typeof callable === 'string') {
            callable = Reflect.get(global, callable as string);
        }

        this.callable = callable;

        try {
            let functionDefinition = parser.parse(this.callable);

            // name
            if (this.name === undefined) {
                this.name = functionDefinition.name;
            }

            // args
            this.parameters = [];

            for (let k in functionDefinition.defaults) {
                // @see https://stackoverflow.com/questions/3360356/why-the-open-quote-and-bracket-for-eval-jsonstring-when-parsing-json
                let defaultValue = eval('(' + functionDefinition.defaults[k] + ')');

                let reflectionParameter = new TwingReflectionParameter(k, defaultValue);

                this.parameters.push(reflectionParameter);
            }

            // second pass to find optional parameters
            for (let [i, parameter] of this.parameters.entries()) {
                // a parameter is optional if it has a default value and all subsequent parameters also have one
                let tail = this.parameters.slice(i);

                parameter.setOptional(tail.every(function (element) {
                    return element.isDefaultValueAvailable();
                }));
            }
        }
        catch (e) {
            throw new Error(`Method "${callable}" is not parsable ${e}.`);
        }
    }

    getName(): string {
        return this.name;
    }

    getParameters(): Array<TwingReflectionParameter> {
        return this.parameters;
    }

    isStatic() {
        return false;
    }

    invokeArgs(scope: any, ...args: Array<any>): any {
        return this.callable.apply(scope, args);
    }
}
