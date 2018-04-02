/**
 * @author Eric MORAND <eric.morand@gmail.com>
 */
import {TwingProfilerProfile} from "../profile";

export abstract class TwingProfilerDumperBase {
    private root: number;

    dump(profile: TwingProfilerProfile) {
        return this.dumpProfile(profile);
    }

    protected abstract formatTemplate(profile: TwingProfilerProfile, prefix: string): string;

    protected abstract formatNonTemplate(profile: TwingProfilerProfile, prefix: string): string;

    protected abstract formatTime(profile: TwingProfilerProfile, prefix: number): string;

    private dumpProfile(profile: TwingProfilerProfile, prefix: string = '', sibling: boolean = false) {
        let start: string;

        if (profile.isRoot()) {
            this.root = profile.getDuration();
            start = profile.getName();
        }
        else {
            if (profile.isTemplate()) {
                start = this.formatTemplate(profile, prefix);
            }
            else {
                start = this.formatNonTemplate(profile, prefix);
            }

            prefix += sibling ? '│ ' : '  ';
        }

        let percent: number = this.root ? profile.getDuration() / this.root * 100 : 0;
        let str: string;

        if (profile.getDuration() * 1000 < 1) {
            str = start + '\n';
        }
        else {
            str = `${start} ${this.formatTime(profile, percent)}\n`;
        }

        let nCount = profile.getProfiles().length;

        let i: number = 0;

        for (let p of profile.getProfiles()) {
            str += this.dumpProfile(p, prefix, i + 1 !== nCount);
            i++;
        }

        return str;
    }
}
