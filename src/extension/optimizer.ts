import TwingExtension from "../extension";
import TwingNodeVisitorInterface from "../node-visitor-interface";
import TwingNodeVisitorOptimizer from "../node-visitor/optimizer";

export class TwingExtensionOptimizer extends TwingExtension {
    private optimizers: number;

    constructor(optimizers: number = -1) {
        super();

        this.optimizers = optimizers;
    }

    getNodeVisitors(): TwingNodeVisitorInterface[] {
        return [
            new TwingNodeVisitorOptimizer(this.optimizers)
        ];
    }
}

export default TwingExtensionOptimizer;