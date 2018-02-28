import {iconv} from "./helper/iconv";

/**
 * Marks a content as safe.
 *
 * @author Eric MORAND <eric.morand@gmail.com>
 */
export class TwingMarkup {
    private content: string;
    private charset: string;

    TwingIsSafe: boolean = true;

    constructor(content: string, charset: string) {
        this.content = content;
        this.charset = charset;
    }

    toString() {
        return this.content;
    }

    count(): number {
        let content = iconv(this.charset, 'utf-8', this.content).toString();

        return content.length;
    }

    toJSON() {
        return this.content;
    }
}
