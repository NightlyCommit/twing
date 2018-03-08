import {TwingProfilerDumperBase} from "./base";
import {TwingProfilerProfile} from "../profile";

/**
 * @author Eric MORAND <eric.morand@gmail.com>
 */
export class TwingProfilerDumperText extends TwingProfilerDumperBase {
    protected formatTemplate(profile: TwingProfilerProfile, prefix: string) {
        return `${prefix}└ ${profile.getTemplate()}`;
    }

    protected formatNonTemplate(profile: TwingProfilerProfile, prefix: string) {
        return `${prefix}└ ${profile.getTemplate()}::${profile.getType()}(${profile.getName()})`;
    }

    protected formatTime(profile: TwingProfilerProfile, percent: number) {
        return `${(profile.getDuration() * 1000).toFixed(2)}ms/${percent}%`;
    }
}
