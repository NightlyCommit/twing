import {TwingCacheInterface} from "../cache-interface";
import {TwingTemplatesModule} from "../environment";
import {stat, writeFile, rename, unlink} from "fs";
import {dirname, join, resolve as resolvePath, extname} from "path";
import {ensureDir} from "fs-extra";

let {tmpName} = require('tmp');

const sha256 = require('crypto-js/sha256');
const hex = require('crypto-js/enc-hex');

/**
 * Implements a cache on the filesystem.
 *
 * @author Eric MORAND <eric.morand@gmail.com>
 */
export class TwingCacheFilesystem implements TwingCacheInterface {
    private directory: string;

    /**
     * @param {string} directory The root cache directory
     */
    constructor(directory: string) {
        this.directory = directory;
    }

    generateKey(name: string, className: string): Promise<string> {
        let hash: string = hex.stringify(sha256(className));

        return Promise.resolve(join(
            this.directory,
            hash[0] + hash[1],
            hash + '.js'
        ));
    }

    load(key: string): Promise<TwingTemplatesModule> {
        let modulePath: string = resolvePath(key);

        return new Promise((resolve) => {
            stat(modulePath, (err) => {
                if (err) {
                    resolve(() => new Map);
                } else {
                    let cache = require.cache;

                    delete cache[modulePath];

                    resolve(require(modulePath));
                }
            })
        });
    }

    write(key: string, content: string): Promise<void> {
        let directory = dirname(key);

        return ensureDir(directory).then(() => {
            return new Promise((resolve, reject) => {
                tmpName({
                    dir: directory,
                    postfix: extname(key)
                }, (err: any, tmpFile: string) => {
                    writeFile(tmpFile, content, (err) => {
                        let error = new Error(`Failed to write cache file "${key}".`);

                        if (err) {
                            reject(error);
                        } else {
                            rename(tmpFile, key, (err) => {
                                if (err) {
                                    unlink(tmpFile, () => {
                                        reject(error);
                                    })
                                } else {
                                    resolve();
                                }
                            })
                        }
                    });
                })
            });
        });
    }

    getTimestamp(key: string): Promise<number> {
        return new Promise<number>((resolve) => {
            stat(key, (err, stats) => {
                if (err) {
                    resolve(0);
                } else {
                    resolve(stats.mtimeMs);
                }
            });
        });
    }
}
