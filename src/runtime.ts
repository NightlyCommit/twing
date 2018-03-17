import {compare} from "./twing/helper/compare";
import {count} from "./twing/helper/count";
import {each} from "./twing/helper/each";
import {getContextProxy} from "./twing/helper/get-context-proxy";
import {isCountable} from "./twing/helper/is-countable";
import {iteratorToMap} from "./twing/helper/iterator-to-map";
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
import {TwingMap} from "./twing/map";
import {TwingMarkup} from "./twing/markup";
import {echo, flush, obEndClean, obGetClean, obGetContents, obStart} from "./twing/output-buffering";
import {range} from "./twing/helper/range";
import {TwingSandboxSecurityError} from "./twing/sandbox/security-error";
import {TwingSandboxSecurityNotAllowedFilterError} from "./twing/sandbox/security-not-allowed-filter-error";
import {TwingSandboxSecurityNotAllowedFunctionError} from "./twing/sandbox/security-not-allowed-function-error";
import {TwingSandboxSecurityNotAllowedTagError} from "./twing/sandbox/security-not-allowed-tag-error";
import {TwingSource} from "./twing/source";
import {TwingTemplate} from "./twing/template";

let Twing = {
    compare: compare,
    count: count,
    each: each,
    echo: echo,
    flush: flush,
    getContextProxy: getContextProxy,
    isCountable: isCountable,
    iteratorToMap: iteratorToMap,
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
    TwingMap: TwingMap,
    TwingMarkup: TwingMarkup,
    TwingSandboxSecurityError: TwingSandboxSecurityError,
    TwingSandboxSecurityNotAllowedFilterError: TwingSandboxSecurityNotAllowedFilterError,
    TwingSandboxSecurityNotAllowedFunctionError: TwingSandboxSecurityNotAllowedFunctionError,
    TwingSandboxSecurityNotAllowedTagError: TwingSandboxSecurityNotAllowedTagError,
    TwingSource: TwingSource,
    TwingTemplate: TwingTemplate
};

export = Twing;
