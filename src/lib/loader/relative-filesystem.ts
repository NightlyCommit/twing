import {TwingLoaderInterface} from "../loader-interface";
import {TwingSource} from "../source";
import {TwingErrorLoader} from "../error/loader";
import {Stats} from "fs";

const path = require('path');
const fs = require('fs');

/**
 * Loads template from the filesystem.
 *
 * @author Fabien Potencier <fabien@symfony.com>
 * @author Eric MORAND <eric.morand@gmail.com>
 */
export class TwingLoaderRelativeFilesystem implements TwingLoaderInterface {
    TwingLoaderInterfaceImpl: TwingLoaderInterface;

    protected cache: Map<string, string> = new Map();
    protected errorCache: Map<string, string> = new Map();

    constructor() {
        this.TwingLoaderInterfaceImpl = this;
    }

    getSourceContext(name: string, from: TwingSource): TwingSource {
        let path = this.findTemplate(name, true, from);

        return new TwingSource(fs.readFileSync(path).toString(), path, path);
    }

    getCacheKey(name: string, from: TwingSource): string {
        let _path = this.findTemplate(name, true, from);

        return _path;
    }

    exists(name: string, from: TwingSource): boolean {
        name = this.normalizeName(this.resolvePath(name, from));

        if (this.cache.has(name)) {
            return true;
        }

        return this.findTemplate(name, false, from) !== null;
    }

    isFresh(name: string, time: number, from: TwingSource): boolean {
        let stat = fs.statSync(this.findTemplate(name, true, from));

        return stat.mtime.getTime() < time;
    }

    /**
     * Checks if the template can be found.
     *
     * @param {string} name  The template name
     * @param {boolean} throw_ Whether to throw an exception when an error occurs
     * @param {TwingSource} from The source that initiated the template loading
     *
     * @returns {string} The template name or null
     */
    protected findTemplate(name: string, throw_: boolean = true, from: TwingSource = null): string {
        name = this.normalizeName(this.resolvePath(name, from));

        if (this.cache.has(name)) {
            return this.cache.get(name);
        }

        if (this.errorCache.has(name)) {
            if (!throw_) {
                return null;
            }

            throw new TwingErrorLoader(this.errorCache.get(name));
        }

        this.validateName(name);

        try {
            let stat: Stats = fs.statSync(name);

            if (stat.isFile()) {
                this.cache.set(name, path.resolve(name));

                return this.cache.get(name);
            }
        }
        catch (e) {
            // noop, we'll throw later if needed
        }

        this.errorCache.set(name, `Unable to find template "${name}".`);

        if (!throw_) {
            return null;
        }

        throw new TwingErrorLoader(this.errorCache.get(name));
    }

    protected normalizeName(name: string) {
        if (name === null) {
            return '';
        }

        return name.replace(/\\/g, '/').replace(/\/{2,}/g, '/')
    }

    protected validateName(name: string) {
        if (name.indexOf(`\0`) > -1) {
            throw new TwingErrorLoader('A template name cannot contain NUL bytes.');
        }
    }

    resolve(name: string, from: TwingSource): string {
        return this.findTemplate(name, false, from);
    }

    private resolvePath(name: string, from: TwingSource): string {
        if (name && from && !path.isAbsolute(name)) {
            name = path.join(path.dirname(from.getPath()), name);
        }

        return name;
    }
}
