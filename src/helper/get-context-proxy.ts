import TwingMap from "../map";

/**
 * This helper is mainly used to support TwingNodeExpressionAssignName incomplete assignment syntax
 *
 * @param {TwingMap<*, *>} context
 * @returns {TwingMap<*, *>}
 */
export function getContextProxy(context: TwingMap<any, any>) {
    return new Proxy(context, {
        get: function(target: any, p: any, value: any) {
            return target.get(p);
        },
        set: function(target: any, p: any, value: any, receiver: any) {
            return target.set(p, value);
        }
    })
}