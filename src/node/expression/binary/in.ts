import TwingNodeExpressionBinary from "../binary";
import twingIn from '../../../util/in';

const isNumber = require('is-number');

class TwingNodeExpressionBinaryIn extends TwingNodeExpressionBinary {
    execute(value: any, compare: any): any {
        let result = twingIn(value, compare);

        return result;
    }
}

export default TwingNodeExpressionBinaryIn;