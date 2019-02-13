import {TwingCacheInterface} from "../cache-interface";
import {TwingTemplate} from "../template";
import {TwingEnvironment} from "../environment";

let fs = require('fs-extra');
let path = require('path');
let tmp = require('tmp');

const sha256 = require('crypto-js/sha256');
const hex = require('crypto-js/enc-hex');

/**
 * Implements a cache on the filesystem.
 *
 * @author Andrew Tch <andrew@noop.lv>
 */
export class TwingCacheFilesystem implements TwingCacheInterface {
    TwingCacheInterfaceImpl: TwingCacheInterface;

    private directory: string;
    private options: number;

    /**
     * @param directory {string} The root cache directory
     * @param options {number} A set of options
     */
    constructor(directory: string, options: number = 0) {
        this.directory = directory;
        this.options = options;
        this.TwingCacheInterfaceImpl = this;
    }

    generateKey(name: string, className: string) {
        let hash: string = hex.stringify(sha256(className));

        return path.join(
            this.directory,
            hash[0] + hash[1],
            hash + '.js'
        );
    }

    load(key: string): (Runtime: any) => { [s: string]: new(e: TwingEnvironment) => TwingTemplate } {
        let result;
        let modulePath: string = path.resolve(key);

        if (fs.pathExistsSync(modulePath)) {
            let cache = require.cache;

            delete cache[modulePath];

            result = require(modulePath);
        }
        else {
            result = () => {
                return {};
            };
        }

        return result;
    }

    write(key: string, content: string) {
        let dir = path.dirname(key);

        fs.ensureDirSync(dir);

        let tmpFile = tmp.tmpNameSync({
            dir: dir,
            postfix: path.extname(key)
        });

        try {
            fs.writeFileSync(tmpFile, content);
            fs.renameSync(tmpFile, key);

            return;
        }
        catch (e) {
            throw new Error(`Failed to write cache file "${key}".`);
        }
    }

    getTimestamp(key: string) {
        if (!fs.pathExistsSync(key)) {
            return 0;
        }

        let stat = fs.statSync(key);

        return stat.mtimeMs;
    }
}
