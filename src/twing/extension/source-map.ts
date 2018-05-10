import {TwingExtension} from "../extension";
import {TwingSourceMapNodeVisitor} from "../source-map/node-visitor";
import {Mapping, SourceMapGenerator} from "source-map";
import {TwingOutputBuffering} from "../output-buffering";
import {TwingErrorRuntime} from "../error/runtime";

type UnitOfWork = {
    name: string;
    source: string;
    original: {
        line: number;
        column: number;
    };
    generated: {
        line: number;
        column: number;
    };
}

export class TwingExtensionSourceMap extends TwingExtension {
    private generator: SourceMapGenerator;
    private unitOfWorks: UnitOfWork[];
    private mappings: Mapping[];

    constructor() {
        super();

        this.unitOfWorks = [];
        this.mappings = [];
    }

    getNodeVisitors() {
        return [new TwingSourceMapNodeVisitor()];
    }

    getGenerator(): SourceMapGenerator {
        if (!this.generator) {
            this.generator = new SourceMapGenerator();

            console.warn('MAPPINGS', this.mappings);

            for (let mapping of this.mappings.reverse()) {
                this.generator.addMapping(mapping);
            }
        }

        return this.generator;
    }

    startUnitOfWork(line: number, column: number, name: string, source: string) {
        let unitOfWork = {
            source: source,
            name: name,
            original: {
                line: line, // 1-based
                column: column - 1 // 0-based
            },
            generated: this.foo()
        };

        this.unitOfWorks.push(unitOfWork);
    }

    stopUnitOfWork() {
        let unitOfWork = this.unitOfWorks.pop();

        if (!unitOfWork) {
            throw new TwingErrorRuntime('UNIT OF WORK');
        }

        if (!this.mappings.find((item: Mapping): boolean => {
                return item.generated.line === unitOfWork.generated.line
                    && item.generated.column === unitOfWork.generated.column;
            })) {
            this.mappings.push(unitOfWork);
        }
    }

    /**
     *
     * @returns {{line: number, column: number}}
     */
    private foo() {
        let content = TwingOutputBuffering.obGetContents();

        // console.warn('CONTENT "' + content + '"');

        let lines: string[];

        let line: number;
        let column: number;

        if (content) {
            lines = content.split('\n');
        }
        else {
            lines = [''];
        }

        line = lines.length;
        column = lines[line - 1].length;

        return {line: line, column: column};
    }
}
