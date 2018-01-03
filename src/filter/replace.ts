import TwingFilter from "../filter";

const strtr = require('locutus/php/strings/strtr');

class TwingFilterReplace extends TwingFilter {
    constructor(name: string) {
        let callable = strtr;

        super(name, callable);
    }
}

export = TwingFilterReplace;