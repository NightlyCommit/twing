import TwingReflectionParameter from "./reflection-parameter";

const parseFunction = require('parse-function');

class TwingReflectionFunction {
    private name: string;
    private parameters: Array<TwingReflectionParameter>;

    constructor(callable: Function) {
        let parser = parseFunction();

        let functionDefinition = parser.parse(this.cleanFunction(callable));

        // name
        this.name = functionDefinition.name;

        // args
        this.parameters = [];

        for (let k in functionDefinition.defaults) {
            let defaultValue = functionDefinition.defaults[k];

            let reflectionParameter = new TwingReflectionParameter(k, defaultValue);

            this.parameters.push(reflectionParameter);
        }
    }

    getName(): string {
        return this.name;
    }

    getParameters(): Array<TwingReflectionParameter> {
        return this.parameters;
    }

    cleanFunction(callable: Function) {
        // remove istanbul instrumentation
        return callable.toString().replace(/\(cov_(?:.+?),(.+?)\)/g, '$1');
    }
}

export default TwingReflectionFunction;