import {TwingCacheNull} from "../../src/lib/cache/null";
import {MockTemplate} from "./template";

export class MockCache extends TwingCacheNull {
    generateKey(name: string, className: string) {
        return 'key'
    }

    write(key: string, content: string) {

    }

    load(key: string) {
        let templates = new Map([
            [0, MockTemplate]
        ]);

        return () => {
            return templates;
        };
    }

    getTimestamp(key: string) {
        return 0;
    }
}
