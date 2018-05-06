import {TwingExtension} from "../extension";
import {TwingSourceMapNodeVisitor} from "../source-map/node-visitor";
import {Mapping, SourceMapGenerator} from "source-map";
import {TwingTemplate} from "../template";
import {TwingOutputBuffering} from "../output-buffering";

export class TwingExtensionSourceMap extends TwingExtension {
    private generator: SourceMapGenerator;

    constructor() {
        super();

        this.generator = new SourceMapGenerator();
    }

    getNodeVisitors() {
        return [new TwingSourceMapNodeVisitor()];
    }

    addMapping(mapping: Mapping) {
        this.generator.addMapping(mapping);
    }

    getSourceMap() {
        console.warn(this.generator.toJSON());

        return this.generator.toString();
    }

    log(template: TwingTemplate, sourceLine: number, sourceColumn: number) {
        let content = TwingOutputBuffering.obGetContents();
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

        this.generator.addMapping({
            source: template.getSourceContext().getName(),
            original: {
                line: sourceLine, // 1-based
                column: sourceColumn // 0-based
            },
            generated: {
                line: line, // 1-based
                column: column // 0-based
            }
        });

        console.warn({
            source: template.getSourceContext().getName(),
            original: {
                line: sourceLine, // 1-based
                column: sourceColumn // 0-based
            },
            generated: {
                line: line, // 1-based
                column: column // 0-based
            }
        });
    }
}
