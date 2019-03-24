class Playground {
    constructor($el) {
        this.$el = $el;
        this.init();
    }

    init() {
        this.twing = new Twing.TwingEnvironment();
        this.initLayout();
        this.initCodeMirror();
        this.render();
    }

    initLayout() {
        this.$leftCol = document.createElement('div');
        this.$leftCol.classList.add('left-col');

        this.$rightCol = document.createElement('div');
        this.$rightCol.classList.add('right-col');

        const $input = document.createElement('div');
        const $inputTitle = document.createElement('h3');
        $inputTitle.textContent = 'Input';
        $input.appendChild($inputTitle);
        this.$leftCol.appendChild($input);

        this.$tokens = document.createElement('div');
        const $tokensTitle = document.createElement('h3');
        $tokensTitle.textContent = 'Tokens';
        this.$tokens.appendChild($tokensTitle);
        this.$rightCol.appendChild(this.$tokens);

        this.$ast = document.createElement('div');
        const $astTitle = document.createElement('h3');
        $astTitle.textContent = 'Abstract Syntax Tree';
        this.$ast.appendChild($astTitle);
        this.$rightCol.appendChild(this.$ast);

        this.$el.appendChild(this.$leftCol);
        this.$el.appendChild(this.$rightCol);
    }

    initCodeMirror() {
        const initialValue = this.$el.dataset.initialValue;

        // Input
        const $cmInput = document.createElement('div');
        this.$leftCol.appendChild($cmInput);

        this.cmInput = new CodeMirror($cmInput, {
            value: initialValue,
            lineNumbers: true,
            mode: 'twig',
        });

        this.cmInput.on('change', this.render.bind(this));

        // Output tokens
        this.cmOutputTokens = new CodeMirror(this.$tokens, {
            mode: {name: 'javascript', json: true},
            readOnly: true,
            lineNumbers: true,
            foldGutter: true,
            gutters: ['CodeMirror-linenumbers', 'CodeMirror-foldgutter'],
        });

        // Output AST
        this.cmOutputAST = new CodeMirror(this.$ast, {
            mode: {name: 'javascript', json: true},
            readOnly: true,
            lineNumbers: true,
            foldGutter: true,
            gutters: ['CodeMirror-linenumbers', 'CodeMirror-foldgutter'],
        });
    }

    render() {
        const updateCm = function (cm, value) {
            let info = cm.getScrollInfo();
            cm.setValue(stringify(value, null, 2));
            cm.scrollTo(info.left, info.top);
        };

        try {
            const source = new Twing.TwingSource(this.cmInput.getValue());
            const tokens = this.twing.tokenize(source);
            const ast = this.twing.parse(tokens);

            updateCm(this.cmOutputTokens, tokens);
            updateCm(this.cmOutputAST, ast);
        } catch (error) {
            console.log(error)
            this.cmOutputTokens.setValue(error.message);
            this.cmOutputAST.setValue(error.message);
        }
    }
}
