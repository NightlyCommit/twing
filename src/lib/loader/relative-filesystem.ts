import {TwingSource} from "../source";
import {TwingErrorLoader} from "../error/loader";
import {Stats} from "fs";
import {TwingLoaderInterface} from "../loader-interface";
import {isAbsolute as isAbsolutePath, join as joinPath, dirname, resolve as resolvePath} from "path";
import {stat as fsStat, statSync, readFile} from "fs";

/**
 * Loads template from the filesystem relatively to the template that initiated the load.
 *
 * @author Eric MORAND <eric.morand@gmail.com>
 */
export class TwingLoaderRelativeFilesystem implements TwingLoaderInterface {
    protected cache: Map<string, string> = new Map();
    protected errorCache: Map<string, string> = new Map();

    getSourceContext(name: string, from: TwingSource): Promise<TwingSource> {
        return this.findTemplate(name, true, from).then((path) => {
            return new Promise((resolve, reject) => {
                readFile(path, 'UTF-8', (err, data) => {
                    resolve(new TwingSource(data, name, path))
                })
            });
        });
    }

    getCacheKey(name: string, from: TwingSource): Promise<string> {
        return this.findTemplate(name, true, from);
    }

    exists(name: string, from: TwingSource): Promise<boolean> {
        name = this.normalizeName(this.resolvePath(name, from));

        if (this.cache.has(name)) {
            return Promise.resolve(true);
        }

        return this.findTemplate(name, false, from).then((name) => {
            return name !== null;
        });
    }

    isFresh(name: string, time: number, from: TwingSource): Promise<boolean> {
        return this.findTemplate(name, true, from).then((name) => {
            return new Promise((resolve) => {
                fsStat(name, (err, stat) => {
                    resolve(stat.mtime.getTime() < time);
                });
            });
        });
    }

    /**
     * Checks if the template can be found.
     *
     * @param {string} name  The template name
     * @param {boolean} throw_ Whether to throw an exception when an error occurs
     * @param {TwingSource} from The source that initiated the template loading
     *
     * @returns {Promise<string>} The template name or null
     */
    protected findTemplate(name: string, throw_: boolean = true, from: TwingSource = null): Promise<string> {
        let _do = (): string => {
            name = this.normalizeName(this.resolvePath(name, from));

            if (this.cache.has(name)) {
                return this.cache.get(name);
            }

            if (this.errorCache.has(name)) {
                if (!throw_) {
                    return null;
                }

                throw new TwingErrorLoader(this.errorCache.get(name), -1, from);
            }

            try {
                this.validateName(name, from);
            } catch (e) {
                if (!throw_) {
                    return null;
                }

                throw e;
            }

            try {
                let stat: Stats = statSync(name);

                if (stat.isFile()) {
                    this.cache.set(name, resolvePath(name));

                    return this.cache.get(name);
                }
            } catch (e) {
                // noop, we'll throw later if needed
            }

            this.errorCache.set(name, `Unable to find template "${name}".`);

            if (!throw_) {
                return null;
            }

            throw new TwingErrorLoader(this.errorCache.get(name), -1, from);
        };

        return Promise.resolve(_do());
    }

    protected normalizeName(name: string) {
        if (name === null) {
            return '';
        }

        return name.replace(/\\/g, '/').replace(/\/{2,}/g, '/')
    }

    protected validateName(name: string, from: TwingSource) {
        if (name.indexOf(`\0`) > -1) {
            throw new TwingErrorLoader('A template name cannot contain NUL bytes.', -1, from);
        }
    }

    resolve(name: string, from: TwingSource, shouldThrow: boolean = false): Promise<string> {
        return this.findTemplate(name, shouldThrow, from);
    }

    private resolvePath(name: string, from: TwingSource): string {
        if (name && from && !isAbsolutePath(name)) {
            name = joinPath(dirname(from.getFQN()), name);
        }

        return name;
    }
}
