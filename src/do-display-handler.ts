import TwingMap from "./map";
import TwingTemplate from "./template";
import TwingNode from "./node";

/**
 * @param {TwingTemplate} template
 * @param {{}} context
 * @param {TwingMap<string, TwingNodeBlock>} blocks
 */
// type DoDisplayHandler = (template: TwingTemplate, context: any, blocks: TwingMap<string, Array<any>>) => any;

type DoDisplayHandler = {
    (template: TwingTemplate, context?: any, blocks?: TwingMap<string, Array<any>>): any;
    node?: TwingNode;
}

export default DoDisplayHandler;