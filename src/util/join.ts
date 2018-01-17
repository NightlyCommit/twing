import ensureTraversable from '../util/ensure-iterable';
import TwingCompiler from "../compiler";

export default function twingJoin(value: Array<any>, glue: string = '') {
    let compiler = new TwingCompiler(null);

    return ensureTraversable(compiler.repr(value)).join(glue);
}