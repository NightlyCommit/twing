import {TwingNode} from "./node";
import {TwingNodeExpression} from "./node/expression";

export enum TwingOperatorType {
    UNARY = 'UNARY',
    BINARY = 'BINARY'
}

export enum TwingOperatorAssociativity {
    LEFT = 'LEFT',
    RIGHT = 'RIGHT'
}

type TwingOperatorExpressionFactory = (operands: [TwingNode, TwingNode], lineno: number, columno: number) => TwingNodeExpression;

export class TwingOperator {
    private name:string;
    private type: TwingOperatorType;
    private precedence: number;
    private expressionFactory: TwingOperatorExpressionFactory;
    private associativity: TwingOperatorAssociativity;

    /**
     * @param {string} name
     * @param {TwingOperatorType} type
     * @param {number} precedence
     * @param {TwingOperatorExpressionFactory} expressionFactory
     * @param {TwingOperatorAssociativity} associativity
     */
    constructor(name: string, type: TwingOperatorType, precedence: number, expressionFactory: TwingOperatorExpressionFactory, associativity?: TwingOperatorAssociativity) {
        this.name = name;
        this.type = type;
        this.precedence = precedence;
        this.expressionFactory = expressionFactory;
        this.associativity = type === TwingOperatorType.BINARY ? (associativity || TwingOperatorAssociativity.LEFT) : null;
    }

    getName(): string {
        return this.name;
    }

    getType(): TwingOperatorType {
        return this.type;
    }

    getPrecedence(): number {
        return this.precedence;
    }

    getAssociativity(): TwingOperatorAssociativity {
        return this.associativity;
    }

    getExpressionFactory(): TwingOperatorExpressionFactory {
        return this.expressionFactory;
    }
}
