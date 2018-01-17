import TwingNodeExpressionBinary from "../binary";

import twingCompare from '../../../util/compare';

class TwingNodeExpressionBinaryEqual extends TwingNodeExpressionBinary {
    execute(left: any, right: any): any {
        return twingCompare(left, right);
    }
}

export default TwingNodeExpressionBinaryEqual;