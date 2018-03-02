import {TwingExtension} from "../extension";
import {TwingProfilerProfile} from "../profiler/profile";
import {TwingProfilerNodeVisitorProfiler} from "../profiler/node-visitor/profiler";
import {TwingMap} from "../map";

export class TwingExtensionProfiler extends TwingExtension {
    static context: TwingMap<any, any> = new TwingMap();

    actives: Array<TwingProfilerProfile> = [];

    constructor(profile: TwingProfilerProfile) {
        super();

        this.actives.push(profile);
    }

    enter(profile: TwingProfilerProfile) {
        this.actives[0].addProfile(profile);
        this.actives.unshift(profile);
    }

    leave(profile: TwingProfilerProfile) {
        profile.leave();

        this.actives.shift();

        if (this.actives.length === 1) {
            this.actives[0].leave();
        }
    }

    getNodeVisitors() {
        return [new TwingProfilerNodeVisitorProfiler(this.constructor.name)];
    }
}

