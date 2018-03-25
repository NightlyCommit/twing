import {iconv} from "./helper/iconv";

/**
 * Marks a content as safe.
 *
 * @author Eric MORAND <eric.morand@gmail.com>
 */
export class TwingMarkup {
    private content: Buffer;
    private charset: string;

    constructor(content: string, charset: string) {
        this.content = new Buffer(content);
        this.charset = charset;
    }

    toString() {
        return this.content.toString();
    }

    count(): number {
        let content = iconv(this.charset, 'utf-8', this.content).toString();

        return content.length;
    }

    toJSON() {
        return this.content.toString();
    }
}
