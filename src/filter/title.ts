import TwingFilter from "../filter";
import TwingEnvironment = require("../environment");

const ucwords = require('locutus/php/strings/ucwords');

class TwingFilterTitle extends TwingFilter {
    constructor(name: string) {
        let callable = function(env: TwingEnvironment, value: string) {
            return ucwords(value.toLowerCase());
        };

        super(name, callable, {
            needs_environment: true
        });
    }
}

export = TwingFilterTitle;