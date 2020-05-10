import {TwingEnvironment} from "../../src/lib/environment";
import {MockEnvironment} from "./environment";
import {TwingTemplate} from "../../src/lib/template";
import {MockLoader} from "./loader";
import {TwingOutputBuffer} from "../../src/lib/output-buffer";
import {TwingSource} from "../../src/lib/source";

export class MockTemplate extends TwingTemplate {
    protected _mySource: TwingSource;

    constructor(env?: TwingEnvironment, source?: TwingSource) {
        if (!env) {
            env = new MockEnvironment(new MockLoader());
        }

        super(env);

        if (!source) {
            source = new TwingSource('', 'foo.html.twig');
        }

        this._mySource = source;
    }

    get source() {
        return this._mySource;
    }

    doDisplay(context: {}, outputBuffer: TwingOutputBuffer, blocks: Map<string, Array<any>>): Promise<void> {
        return Promise.resolve();
    }
}
