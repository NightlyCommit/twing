import TwingErrorRuntime from "../error/runtime";

const round = require('locutus/php/math/round')
const ceil = require('locutus/php/math/ceil')
const floor = require('locutus/php/math/floor')

export default function twingRound(value: any, precision = 0, method = 'common') {
    if (method === 'common') {
        return round(value, precision);
    }

    if (method !== 'ceil' && method !== 'floor') {
        throw new TwingErrorRuntime('The round filter only supports the "common", "ceil", and "floor" methods.');
    }

    let intermediateValue = value * Math.pow(10, precision);
    let intermediateDivider = Math.pow(10, precision);

    switch (method) {
        case 'ceil':
            return ceil(intermediateValue) / intermediateDivider;
        default:
            return floor(intermediateValue) / intermediateDivider;
    }
}