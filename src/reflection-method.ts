import TwingReflectionParameter from "./reflection-parameter";

const parseFunction = require('parse-function');

class TwingReflectionMethod {
    private name: string;
    private parameters: Array<TwingReflectionParameter>;
    private callable: Function;

    constructor(callable: Function) {
        let parser = parseFunction();

        if (typeof callable === 'string') {
            callable = Reflect.get(global, callable as string);
        }

        this.callable = callable;

        try {
            let functionDefinition = parser.parse(this.cleanCallable());

            // name
            this.name = functionDefinition.name;

            // args
            this.parameters = [];

            for (let k in functionDefinition.defaults) {
                // @see https://stackoverflow.com/questions/3360356/why-the-open-quote-and-bracket-for-eval-jsonstring-when-parsing-json
                let defaultValue = eval('(' + functionDefinition.defaults[k] + ')');

                let reflectionParameter = new TwingReflectionParameter(k, defaultValue);

                this.parameters.push(reflectionParameter);
            }
        }
        catch (e) {
            throw new Error(`Method "${callable}" is not parsable.`);
        }
    }

    getName(): string {
        return this.name;
    }

    getParameters(): Array<TwingReflectionParameter> {
        return this.parameters;
    }

    cleanCallable() {
        // remove istanbul instrumentation
        return this.callable.toString().replace(/\(cov_(?:.+?),(.+?)\)/g, '$1');
    }

    isStatic() {
        return false;
    }

    invokeArgs(scope: any, ...args: Array<any>): any {
        return this.callable.apply(scope, args);
    }
}

export default TwingReflectionMethod;