import TwingFilter from "../filter";

const sprintf = require('locutus/php/strings/sprintf');

class TwingFilterFormat extends TwingFilter {
    constructor(name: string) {
        let callable = sprintf;

        super(name, callable);
    }
}

export = TwingFilterFormat;