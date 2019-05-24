import {TwingNodeExpression} from "../expression";

import {TwingNode} from "../../node";
import {TwingErrorSyntax} from "../../error/syntax";
import {TwingNodeExpressionConstant} from "./constant";
import {TwingNodeExpressionArray} from "./array";
import {TwingReflectionParameter} from "../../reflection-parameter";
import {TwingReflectionMethod} from "../../reflection-method";
import {TwingCompiler} from "../../compiler";
import {TwingEnvironment} from "../../environment";

const array_merge = require('locutus/php/array/array_merge');
const snakeCase = require('snake-case');
const capitalize = require('capitalize');

type TwingNodeExpressionCallReflector = {
    r: TwingReflectionMethod;
    callable: Function;
}

export abstract class TwingNodeExpressionCall extends TwingNodeExpression {
    private reflector: TwingNodeExpressionCallReflector;

    protected compileCallable(compiler: TwingCompiler) {
        let callable = this.getAttribute('callable');

        if (typeof callable === 'string' && callable.indexOf('::') < 0) {
            compiler
                .raw(callable)
                .raw('(...')
            ;
        }
        else {
            let [r, callable_] = this.reflectCallable(callable, compiler.getEnvironment());

            if (r instanceof TwingReflectionMethod && typeof callable_[0] === 'string') {
                compiler.raw(`this.env.getRuntime('${callable_[0]}').${callable_[1]}(...`);
            }
            else {
                compiler.raw(`this.env.get${capitalize(this.getAttribute('type'))}('${this.getAttribute('name')}').traceableCallable(${this.getTemplateLine()}, this.getSourceContext())(...`);
            }
        }

        this.compileArguments(compiler);

        compiler.raw(')');
    }

    protected compileArguments(compiler: TwingCompiler) {
        compiler.raw('[');

        let first = true;

        if (this.hasAttribute('needs_environment') && this.getAttribute('needs_environment')) {
            compiler.raw('this.env');

            first = false;
        }

        if (this.hasAttribute('needs_context') && this.getAttribute('needs_context')) {
            if (!first) {
                compiler.raw(', ');
            }

            compiler.raw('context');

            first = false;
        }

        if (this.hasAttribute('needs_source') && this.getAttribute('needs_source')) {
            if (!first) {
                compiler.raw(', ');
            }

            compiler.raw('this.source');

            first = false;
        }

        if (this.hasAttribute('arguments')) {
            for (let argument_ of this.getAttribute('arguments')) {
                if (!first) {
                    compiler.raw(', ');
                }

                compiler.string(argument_);

                first = false;
            }
        }

        if (this.hasNode('node')) {
            if (!first) {
                compiler.raw(', ');
            }

            compiler.subcompile(this.getNode('node'));

            first = false;
        }

        if (this.hasNode('arguments')) {
            let callable = this.getAttribute('callable');
            let arguments_ = this.getArguments(callable, this.getNode('arguments'), compiler.getEnvironment());

            for (let node of arguments_) {
                if (!first) {
                    compiler.raw(', ');
                }

                compiler.subcompile(node);

                first = false;
            }
        }

        compiler.raw(']');
    }

    protected getArguments(callable: Function, argumentsNode: TwingNode, env: TwingEnvironment): Array<TwingNode> {
        let self = this;
        let callType = this.getAttribute('type');
        let callName = this.getAttribute('name');

        let parameters: Map<string | number, TwingNode> = new Map();
        let named = false;

        for (let [name, node] of argumentsNode.getNodes()) {
            if (typeof name !== 'number') {
                named = true;
                name = self.normalizeName(name);
            }
            else if (named) {
                throw new TwingErrorSyntax(`Positional arguments cannot be used after named arguments for ${callType} "${callName}".`, this.getTemplateLine());
            }

            parameters.set(name, node);
        }

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

        let callableParameters = this.getCallableParameters(callable, isVariadic, env);
        let arguments_: Array<TwingNode> = [];

        let names: Array<string> = [];
        let optionalArguments: Array<string | TwingNodeExpressionConstant> = [];
        let pos = 0;

        for (let callableParameter of callableParameters) {
            let name = '' + self.normalizeName(callableParameter.getName());

            names.push(name);

            if (parameters.has(name)) {
                if (parameters.has(pos)) {
                    throw new TwingErrorSyntax(`Argument "${name}" is defined twice for ${callType} "${callName}".`, this.getTemplateLine());
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
                optionalArguments.push(new TwingNodeExpressionConstant(callableParameter.getDefaultValue(), -1, -1));
            }
            else {
                throw new TwingErrorSyntax(`Value for argument "${name}" is required for ${callType} "${callName}".`, this.getTemplateLine());
            }
        }

        if (isVariadic) {
            let arbitraryArguments = new TwingNodeExpressionArray(new Map(), -1, -1);
            let resolvedKeys: Array<any> = [];

            for (let [key, value] of parameters) {
                if (Number.isInteger(key as number)) {
                    arbitraryArguments.addElement(value);
                }
                else {
                    arbitraryArguments.addElement(value, new TwingNodeExpressionConstant(key, -1, -1));
                }

                resolvedKeys.push(key);
            }

            for (let key of resolvedKeys) {
                parameters.delete(key);
            }

            if (arbitraryArguments.count()) {
                arguments_ = array_merge(arguments_, optionalArguments);
                arguments_.push(arbitraryArguments);
            }
        }

        if (parameters.size > 0) {
            let unknownParameter = [...parameters.values()].find(function (parameter) {
                // todo: what other type of data can parameter be?
                return parameter instanceof TwingNode;
            });

            throw new TwingErrorSyntax(`Unknown argument${parameters.size > 1 ? 's' : ''} "${[...parameters.keys()].join('", "')}" for ${callType} "${callName}(${names.join(', ')})".`, unknownParameter ? unknownParameter.getTemplateLine() : this.getTemplateLine(), self.getTemplateName());
        }

        return arguments_;
    }

    protected normalizeName(name: string) {
        return snakeCase(name).toLowerCase();
    }

    private getCallableParameters(callable: Function, isVariadic: boolean, env: TwingEnvironment): Array<TwingReflectionParameter> {
        let r = this.reflectCallable(callable, env)[0];

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

        if (this.hasAttribute('needs_source') && this.getAttribute('needs_source')) {
            parameters.shift();
        }

        if (this.hasAttribute('arguments') && this.getAttribute('arguments')) {
            for (let v of this.getAttribute('arguments')) {
                parameters.shift();
            }
        }

        if (isVariadic) {
            let argument_ = parameters[parameters.length - 1];

            if (argument_ && argument_.isArray() && argument_.isDefaultValueAvailable() && (argument_.getDefaultValue().length === 0)) {
                parameters.pop();
            }
            else {
                let callableName = r.getName();

                throw new Error(`The last parameter of "${callableName}" for ${this.getAttribute('type')} "${this.getAttribute('name')}" must be an array with default value, eg. "arg = []".`);
            }
        }

        return parameters;
    }

    private reflectCallable(callable: Function | any, env: TwingEnvironment): [TwingReflectionMethod, any] {
        let r: TwingReflectionMethod;
        let name: string;
        let pos: number;

        if (Array.isArray(callable)) {
            let runtime = env.getRuntime(callable[0]);

            if (typeof runtime[callable[1]] !== 'function') {
                return [null, []];
            }

            r = new TwingReflectionMethod(runtime[callable[1]], callable[1]);
        }
        else if (typeof callable === 'object' && Reflect.has(callable, '__invoke')) {
            name = `${callable.constructor.name}::__invoke`;

            callable = Reflect.get(callable, '__invoke');

            r = new TwingReflectionMethod(callable, name);
        }
        else if (typeof callable === 'string' && ((pos = callable.indexOf('::')) > -1)) {
            let class_ = callable.substr(0, pos);
            let method = callable.substr(pos + 2);

            let runtime = env.getRuntime(class_);

            if (typeof runtime[method] !== 'function') {
                return [null, []];
            }

            r = new TwingReflectionMethod(runtime[method], callable);

            callable = [class_, method];
        }
        else {
            r = new TwingReflectionMethod(callable, name);
        }

        this.reflector = {
            r: r,
            callable: callable
        };

        return [r, callable];
    }
}
