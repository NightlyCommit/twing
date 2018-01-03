import TwingFilter from "../filter";
import TwingEnvironment = require("../environment");
import TwingNode from "../node";
import TwingNodeExpressionConstant from "../node/expression/constant";
import TwingNodeExpressionFilterDefault = require("../node/expression/filter/default");

const ensureTraversable = require('../ensure-traversable');

class TwingFilterDefault extends TwingFilter {
    constructor(name: string) {
        let callable = function(value: any, defaultValue: any = '') {
            if (!value) {
                return defaultValue;
            }

            return value;
        };

        super(name, callable, {
            expression_factory: function(node: TwingNode, filterName: TwingNodeExpressionConstant, methodArguments: TwingNode, lineno: number, tag: string = null) {
                return new TwingNodeExpressionFilterDefault(node, filterName, methodArguments, lineno, tag);
            }
        });
    }
}

export = TwingFilterDefault;