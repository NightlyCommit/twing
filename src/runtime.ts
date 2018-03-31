import {clone} from "./twing/helper/clone";
import {compare} from "./twing/helper/compare";
import {count} from "./twing/helper/count";
import {each} from "./twing/helper/each";
import {isCountable} from "./twing/helper/is-countable";
import {iteratorToMap} from "./twing/helper/iterator-to-map";
import {merge} from "./twing/helper/merge";
import {regexParser} from "./twing/helper/regex-parser";
import {TwingErrorLoader} from "./twing/error/loader";
import {TwingErrorRuntime} from "./twing/error/runtime";
import {
    twingArrayMerge,
    twingConstant,
    twingEnsureTraversable,
    twingGetAttribute,
    twingInFilter
} from "./twing/extension/core";
import {TwingMarkup} from "./twing/markup";
import {echo, flush, obEndClean, obGetClean, obGetContents, obStart} from "./twing/output-buffering";
import {range} from "./twing/helper/range";
import {TwingSandboxSecurityError} from "./twing/sandbox/security-error";
import {TwingSandboxSecurityNotAllowedFilterError} from "./twing/sandbox/security-not-allowed-filter-error";
import {TwingSandboxSecurityNotAllowedFunctionError} from "./twing/sandbox/security-not-allowed-function-error";
import {TwingSandboxSecurityNotAllowedTagError} from "./twing/sandbox/security-not-allowed-tag-error";
import {TwingSource} from "./twing/source";
import {TwingTemplate} from "./twing/template";
import {TwingProfilerProfile} from "./twing/profiler/profile";

let Twing = {
    clone: clone,
    compare: compare,
    count: count,
    each: each,
    echo: echo,
    flush: flush,
    isCountable: isCountable,
    iteratorToMap: iteratorToMap,
    merge: merge,
    obEndClean: obEndClean,
    obGetClean: obGetClean,
    obGetContents: obGetContents,
    obStart: obStart,
    range: range,
    regexParser: regexParser,
    twingArrayMerge: twingArrayMerge,
    twingConstant: twingConstant,
    twingEnsureTraversable: twingEnsureTraversable,
    TwingErrorLoader: TwingErrorLoader,
    TwingErrorRuntime: TwingErrorRuntime,
    twingGetAttribute: twingGetAttribute,
    twingInFilter: twingInFilter,
    TwingMarkup: TwingMarkup,
    TwingProfilerProfile: TwingProfilerProfile,
    TwingSandboxSecurityError: TwingSandboxSecurityError,
    TwingSandboxSecurityNotAllowedFilterError: TwingSandboxSecurityNotAllowedFilterError,
    TwingSandboxSecurityNotAllowedFunctionError: TwingSandboxSecurityNotAllowedFunctionError,
    TwingSandboxSecurityNotAllowedTagError: TwingSandboxSecurityNotAllowedTagError,
    TwingSource: TwingSource,
    TwingTemplate: TwingTemplate
};

export = Twing;
