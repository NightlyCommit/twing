import TwingCacheInterface = require("../cache-interface");

const createHash = require('sha.js');
const fs = require('fs-extra');
const path = require('path');
const tmp = require('tmp');

class TwingCacheFilesystem implements TwingCacheInterface {
    // const FORCE_BYTECODE_INVALIDATION = 1;

    private directory: string;
    private options: number;

    /**
     * @param {string} directory The root cache directory
     * @param {number} options   A set of options
     */
    constructor(directory: string, options: number = 0) {
        this.directory = directory;
        this.options = options;
    }

    generateKey(name: string, className: string): string {
        let hash = createHash('sha256').update(className).digest('hex');

        return path.join(
            this.directory,
            hash[0] + hash[1],
            hash + '.js'
        );
    }

    write(key: string, content: string): string {
        console.log('WRITE', key);

        let dir = path.dirname(key);

        fs.ensureDirSync(dir);

        let tmpFile = tmp.fileSync({
            dir: dir,
            postfix: path.basename(key),
            //keep: true
        });

        console.log('WRITE', tmpFile);


        fs.writeFileSync(tmpFile.name, content);

        return path.resolve(tmpFile.name);
    }

    load(key: string): void {
        if (this.exists(key)) {
            require(key);
        }
    }

    getTimestamp(key: string): number {
        let stat = this.exists(key);

        if (!stat) {
            return 0;
        }

        return new Date(stat.mtime).getTime();
    }

    /**
     *
     * @param {string} key
     * @returns {any}
     */
    protected exists(key: string) {
        try {
            return fs.statSync(key);
        }
        catch (e) {
            return false;
        }
    }
}

export = TwingCacheFilesystem;