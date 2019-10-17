import {TwingCacheNull} from "../../src/lib/cache/null";
import {MockTemplate} from "./template";

export class MockCache extends TwingCacheNull {
    generateKey(name: string, className: string) {
        return Promise.resolve('key');
    }

    write(key: string, content: string) {
        return Promise.resolve();
    }

    load(key: string) {
        let templates = new Map([
            [0, MockTemplate]
        ]);

        return Promise.resolve(() => {
            return templates;
        });
    }

    getTimestamp(key: string) {
        return Promise.resolve(0);
    }
}
