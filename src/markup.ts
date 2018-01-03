class TwingMarkup {
    private content: string;
    private charset: string;

    constructor(content: string, charset: string) {
        this.content = content;
        this.charset = charset;
    }

    toString() {
        return this.content;
    }

    count(): number {
        // return mb_strlen($this->content, $this->charset);
        return this.content.length;
    }

    toJSON() {
        return JSON.stringify(this.content);
    }
}

export = TwingMarkup;