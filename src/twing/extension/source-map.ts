import {TwingExtension} from "../extension";
import {Mapping, SourceMapGenerator} from "source-map";
import {TwingOutputBuffering} from "../output-buffering";

class UnitOfWork {
    private name: string;
    private source: string;
    private cursor: number;
    private originalLine: number;
    private originalColumn: number;
    private level: number;
    private parent: UnitOfWork;
    private children: UnitOfWork[];
    private content: string;

    constructor(name: string = null, source: string = null, line: number = 0, column: number = 0, level: number = 1) {
        this.name = name;
        this.source = source;
        this.originalLine = line;
        this.originalColumn = column;
        this.level = level;
        this.cursor = 0;
        this.content = '';

        this.children = [];
    }

    getName(): string {
        return this.name;
    }

    getSource(): string {
        return this.source;
    }

    getOriginalLine(): number {
        return this.originalLine;
    }

    getOriginalColumn(): number {
        return this.originalColumn;
    }

    getLevel(): number {
        return this.level;
    }

    addChild(child: UnitOfWork) {
        child.setParent(this);

        if (child.getLevel() === this.getLevel()) {
            child.setCursor(this.cursor);
        }
        else {
            child.setCursor(0);
        }

        this.children.push(child);
    }

    getChildren() {
        return this.children;
    }

    setContent(content: string | false) {
        if (content !== false) {
            this.content = content;
        }
    }

    getContent() {
        return this.content;
    }

    setCursor(cursor: number) {
        this.cursor = cursor;
    }

    getCursor(): number {
        return this.cursor;
    }

    setParent(parent: UnitOfWork) {
        this.parent = parent;
    }

    getParent() {
        return this.parent;
    }
}

export class TwingExtensionSourceMap extends TwingExtension {
    private mappings: Mapping[];
    private cursor: number;
    private column: number;
    private line: number;
    private unitOfWork: UnitOfWork;

    constructor() {
        super();

        this.mappings = [];
        this.cursor = 0;
        this.column = 0;
        this.line = 0;

        // root unit of work
        this.unitOfWork = new UnitOfWork();
    }

    getGenerator(): SourceMapGenerator {
        let generator = new SourceMapGenerator();

        let lineno: number = 0;
        let columnno: number = 0;

        let proceedUnitOfWork = (unitOfWork: UnitOfWork) => {
            if (unitOfWork !== this.unitOfWork) {
                let lines = unitOfWork.getContent().split('\n');

                console.warn('LINES', lines);

                for (let i = 0; i < lines.length; i++) {
                    let line = lines[i];

                    if (i > 0) {
                        lineno++;
                        columnno = 0;
                    }

                    // skip empty last line
                    if ((i < (lines.length - 1)) || (line.length > 0)) {
                        generator.addMapping({
                            name: unitOfWork.getName(),
                            source: unitOfWork.getSource(),
                            original: {
                                line: unitOfWork.getOriginalLine(),
                                column: unitOfWork.getOriginalColumn()
                            },
                            generated: {
                                line: lineno + 1, // 1-based,
                                column: columnno
                            }
                        });

                        columnno += line.length;
                    }
                }
            }

            for (let child of unitOfWork.getChildren()) {
                proceedUnitOfWork(child);
            }
        };

        console.warn(this.unitOfWork);

        proceedUnitOfWork(this.unitOfWork);

        return generator;
    }

    /**
     *
     * @param {number} line 0-based
     * @param {number} column 1-based
     * @param {string} name
     * @param {string} source
     */
    enter(line: number, column: number, name: string, source: string) {
        console.warn('ENTER', name);

        TwingOutputBuffering.obStart();

        let unitOfWork = new UnitOfWork(name, source, line, column - 1, TwingOutputBuffering.obGetLevel());

        this.unitOfWork.addChild(unitOfWork);

        this.unitOfWork = unitOfWork;
    }

    leave() {
        console.warn('> LEAVE', this.unitOfWork.getName(), 'level', this.unitOfWork.getLevel());

        this.unitOfWork.setContent(TwingOutputBuffering.obGetFlush());

        console.warn('< LEAVE', this.unitOfWork, TwingOutputBuffering.obGetContents());

        this.unitOfWork = this.unitOfWork.getParent();
    }
}
