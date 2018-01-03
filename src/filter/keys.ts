import TwingFilter from "../filter";
import TwingEnvironment = require("../environment");

const ensureTraversable = require('../ensure-traversable');

class TwingFilterKeys extends TwingFilter {
    constructor(name: string) {
        let callable = function(value: any) {
            let traversable = ensureTraversable(value);

            return [...traversable.keys()];
        };

        super(name, callable);
    }
}

export = TwingFilterKeys;