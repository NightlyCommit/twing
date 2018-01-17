import TwingNodeExpression from "../expression";
import TwingTemplate from "../../template";
import TwingMap from "../../map";
import TwingNode from "../../node";
import TwingErrorSyntax from "../../error/syntax";
import TwingNodeExpressionConstant from "./constant";
import TwingNodeExpressionArray from "./array";
import TwingReflectionParameter from "../../reflection-parameter";
import TwingReflectionFunction from "../../reflection-function";
import TwingCompiler from "../../compiler";
import DoDisplayHandler from "../../do-display-handler";
import TwingErrorRuntime from "../../error/runtime";

const array_merge = require('locutus/php/array/array_merge');
const snakeCase = require('snake-case');

interface TwingNodeExpressionCallReflector {
    r: TwingReflectionFunction;
    callable: Function;
}

abstract class TwingNodeExpressionCall extends TwingNodeExpression {
    private reflector: TwingNodeExpressionCallReflector;

    compileCallable(compiler: TwingCompiler) {
        let callable = this.getAttribute('callable');
        let argumentHandlers = this.compileArguments(compiler);

        return (template: TwingTemplate, context: any, blocks: TwingMap<string, Array<any>>) => {
            let callableArguments = [];

            for (let argumentHandler of argumentHandlers) {
                callableArguments.push(argumentHandler(template, context, blocks));
            }

            try {
                return callable.apply(this, callableArguments);
            }
            catch (e) {
                if (e instanceof TwingErrorRuntime) {
                    if (e.getTemplateLine() === -1) {
                        e.setTemplateLine(this.getTemplateLine());
                    }
                }

                throw e;
            }
        };
    }

    compileArguments(compiler: TwingCompiler): Array<any> {
        let result: Array<DoDisplayHandler> = [];

        if (this.hasAttribute('needs_environment') && this.getAttribute('needs_environment')) {
            result.push(() => {
                return compiler.getEnvironment();
            });
        }

        if (this.hasAttribute('needs_context') && this.getAttribute('needs_context')) {
            result.push((template: TwingTemplate, context: any) => {
                return context;
            });
        }

        if (this.hasAttribute('arguments') && this.getAttribute('arguments')) {
            this.getAttribute('arguments').forEach(function (argument_: any) {
                result.push(() => {
                    return argument_;
                });
            });
        }

        if (this.hasNode('node')) {
            result.push(compiler.subcompile(this.getNode('node')));
        }

        if (this.hasNode('arguments')) {
            let callable = this.getAttribute('callable');
            let arguments_ = this.getArguments(callable, this.getNode('arguments'));

            arguments_.forEach(function (argNode: TwingNode) {
                result.push(compiler.subcompile(argNode));
            });
        }

        return result;
    }

    getArguments(callable: Function = null, argumentsNode: TwingNode): Array<TwingNode> {
        let self = this;

        let callType = this.getAttribute('type');
        let callName = this.getAttribute('name');

        let parameters: TwingMap<string, TwingNode> = new TwingMap();
        let named = false;

        argumentsNode.getNodes().forEach(function (node, name) {
            if (typeof name !== 'number') {
                named = true;
                name = self.normalizeName(name);
            }
            else if (named) {
                throw new TwingErrorSyntax(`Positional arguments cannot be used after named arguments for ${callType} "${callName}".`);
            }

            parameters.set(name, node);
        });

        let isVariadic = this.hasAttribute('is_variadic') && this.getAttribute('is_variadic');

        if (!named && !isVariadic) {
            return [...parameters.values()];
        }

        let message: string;

        if (!callable) {
            if (named) {
                message = `Named arguments are not supported for ${callType} "${callName}".`;
            }
            else {
                message = `Arbitrary positional arguments are not supported for ${callType} "${callName}".`;
            }

            throw new Error(message);
        }

        let callableParameters = this.getCallableParameters(callable, isVariadic);
        let arguments_: Array<TwingNode> = [];

        let names: Array<string> = [];
        let missingArguments: Array<string> = [];
        let optionalArguments: Array<string | TwingNodeExpressionConstant> = [];
        let pos = 0;

        for (let i = 0; i < callableParameters.length; i++) {
            let callableParameter = callableParameters[i];
            let name = '' + self.normalizeName(callableParameter.getName());

            names.push(name);

            if (parameters.has(name)) {
                if (parameters.has(pos)) {
                    throw new TwingErrorSyntax(`Argument "${name}" is defined twice for ${callType} "${callName}".`);
                }

                if (missingArguments.length) {
                    throw new TwingErrorSyntax(`Argument "${name}" could not be assigned for ${callType} "${callName}(${names.join(', ')})" because it is mapped to an internal PHP function which cannot determine default value for optional argument${missingArguments.length > 1 ? 's' : ''} "${missingArguments.join(', ')}".`);
                }

                arguments_ = array_merge(arguments_, optionalArguments);
                arguments_.push(parameters.get(name));
                parameters.delete(name);
                optionalArguments = [];
            }
            else if (parameters.has(pos)) {
                arguments_ = array_merge(arguments_, optionalArguments);
                arguments_.push(parameters.get(pos));
                parameters.delete(pos);
                optionalArguments = [];
                ++pos;
            }
            else if (callableParameter.isDefaultValueAvailable()) {
                optionalArguments.push(new TwingNodeExpressionConstant(undefined, -1));
            }
            else if (callableParameter.isOptional()) {
                if (parameters.size < 1) {
                    break;
                }
                else {
                    missingArguments.push(name);
                }
            }
            else {
                throw new TwingErrorSyntax(`Value for argument "${name}" is required for ${callType} "${callName}".`);
            }
        }

        if (isVariadic) {
            let arbitraryArguments = new TwingNodeExpressionArray(new TwingMap(), -1);
            let resolvedKeys: Array<any> = [];

            parameters.forEach(function (value, key) {
                if (Number.isInteger(key)) {
                    arbitraryArguments.addElement(value);
                }
                else {
                    arbitraryArguments.addElement(value, new TwingNodeExpressionConstant(key, -1));
                }

                resolvedKeys.push(key);
            });

            resolvedKeys.forEach(function (key) {
                parameters.delete(key);
            });

            if (arbitraryArguments.count()) {
                arguments_ = array_merge(arguments_, optionalArguments);
                arguments_.push(arbitraryArguments);
            }
        }

        if (parameters.size > 0) {
            let unknownParameter = [...parameters.values()].find(function (parameter) {
                return parameter instanceof TwingNode;
            });

            throw new TwingErrorSyntax(`Unknown argument${parameters.size > 1 ? 's' : ''} "${[...parameters.keys()].join(', ')}" for ${callType} "${callName}(${names.join(', ')})".`, unknownParameter ? unknownParameter.getTemplateLine() : -1, self.getTemplateName());
        }

        return arguments_;
    }

    normalizeName(name: string) {
        return snakeCase(name).toLowerCase();
    }

    getCallableParameters(callable: Function, isVariadic: boolean): Array<TwingReflectionParameter> {
        let r = this.reflectCallable(callable).r;

        if (!r) {
            return [];
        }

        let parameters = r.getParameters();

        if (this.hasNode('node')) {
            parameters.shift();
        }

        if (this.hasAttribute('needs_environment') && this.getAttribute('needs_environment')) {
            parameters.shift();
        }

        if (this.hasAttribute('needs_context') && this.getAttribute('needs_context')) {
            parameters.shift();
        }

        if (this.hasAttribute('arguments') && this.getAttribute('arguments')) {
            this.getAttribute('arguments').forEach(function () {
                parameters.shift();
            });
        }

        if (isVariadic) {
            let argument_ = parameters[parameters.length - 1];

            if (argument_ && argument_.isArray() && argument_.isDefaultValueAvailable() && argument_.getDefaultValue() === []) {
                parameters.pop();
            }
            else {
                let callableName = r.getName();

                // todo: should we support this?
                // if (r instanceof ReflectionMethod) {
                //     $callableName = $r->getDeclaringClass()->name.'::'.$callableName;
                // }

                throw new Error(`The last parameter of "${callableName}" for ${this.getAttribute('type')} "${this.getAttribute('name')}" must be an array with default value, eg. "array $arg = array()".`);
            }
        }

        return parameters;
    }

    private reflectCallable(callable: Function) {
        let r: TwingReflectionFunction;

        if (this.reflector) {
            return this.reflector;
        }

        // if (is_array($callable)) {
        //     if (!method_exists($callable[0], $callable[1])) {
        //         // __call()
        //         return array(null, array());
        //     }
        //     $r = new ReflectionMethod($callable[0], $callable[1]);
        // }
        // else if (is_object($callable) && !$callable instanceof Closure) {
        //     $r = new ReflectionObject($callable);
        //     $r = $r->getMethod('__invoke');
        //     $callable = array($callable, '__invoke');
        // }
        // else if (is_string($callable) && false !== $pos = strpos($callable, '::')) {
        //     $class = substr($callable, 0, $pos);
        //     $method = substr($callable, $pos + 2);
        //     if (!method_exists($class, $method)) {
        //         // __staticCall()
        //         return array(null, array());
        //     }
        //     $r = new ReflectionMethod($callable);
        //     $callable = array($class, $method);
        // }
        // else {
        r = new TwingReflectionFunction(callable);
        // }

        this.reflector = {
            r: r,
            callable: callable
        };

        return this.reflector;
    }
}

export default TwingNodeExpressionCall;

