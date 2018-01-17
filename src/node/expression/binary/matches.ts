import TwingNodeExpressionBinary from "../binary";

const regexParser = require("regex-parser");

class TwingNodeExpressionBinaryMatches extends TwingNodeExpressionBinary {
    execute(left: any, right: any): any {
        let regExp = regexParser(right);

        return regExp.test(left);
    }
}

export default TwingNodeExpressionBinaryMatches;