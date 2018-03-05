import {abs} from "./twing/helper/abs";
import {defined} from "./twing/helper/defined";
import {escape} from "./twing/helper/escape";
import {formatDateInterval} from "./twing/helper/format-date-interval";
import {formatDateTime} from "./twing/helper/format-date-time";
import {getContextProxy} from "./twing/helper/get-context-proxy";
import {iconv} from "./twing/helper/iconv";
import {isCountable} from "./twing/helper/is-countable";
import {isTraversable} from "./twing/helper/is-traversable";
import {iteratorToArray} from "./twing/helper/iterator-to-array";
import {iteratorToHash} from "./twing/helper/iterator-to-hash";
import {iteratorToMap} from "./twing/helper/iterator-to-map";
import {jsonEncode} from "./twing/helper/json-encode";
import {max} from "./twing/helper/max";
import {min} from "./twing/helper/min";
import {regexParser} from "./twing/helper/regex-parser";
import {relativeDate} from "./twing/helper/relative-date";
import {TokenPosition} from "./twing/token-position";
import {TwingBaseNodeVisitor} from "./twing/base-node-visitor";
import {TwingCacheFilesystem} from "./twing/cache/filesystem";
import {TwingCacheNull} from "./twing/cache/null";
import {compareArray} from "./twing/helper/compare-to-array";
import {compareNumber} from "./twing/helper/compare-to-number";
import {compareString} from "./twing/helper/compare-to-string";
import {compareToBoolean} from "./twing/helper/compare-to-boolean";
import {compareToDateTime} from "./twing/helper/compare-to-date-time";
import {compareToNull} from "./twing/helper/compare-to-null";
import {compare} from "./twing/helper/compare";
import {TwingCompiler} from "./twing/compiler";
import {TwingEnvironment} from "./twing/environment";
import {TwingErrorLoader} from "./twing/error/loader";
import {TwingErrorRuntime} from "./twing/error/runtime";
import {TwingErrorSyntax} from "./twing/error/syntax";
import {TwingError} from "./twing/error";
import {TwingExpressionParser} from "./twing/expression-parser";
import {
    twingArrayBatch,
    twingArrayMerge,
    twingCapitalizeStringFilter,
    twingConstant,
    twingConvertEncoding,
    twingCycle,
    twingDateConverter,
    twingDateFormatFilter,
    twingDateModifyFilter,
    twingDefaultFilter,
    twingEnsureTraversable,
    twingEscapeFilter,
    twingEscapeFilterIsSafe,
    TwingExtensionCore,
    twingFirst,
    twingGetAttribute,
    twingInFilter,
    twingJoinFilter,
    twingLast,
    twingLengthFilter,
    twingLowerFilter,
    twingNumberFormatFilter,
    twingRandom,
    twingReplaceFilter,
    twingReverseFilter,
    twingRound,
    twingSlice,
    twingSortFilter,
    twingSource,
    twingSplitFilter,
    twingTestEmpty,
    twingTestIterable,
    twingTitleStringFilter,
    twingTrimFilter,
    twingUpperFilter,
    twingUrlencodeFilter
} from "./twing/extension/core";
import {TwingExtensionDebug, twingVarDump} from "./twing/extension/debug";
import {TwingExtensionEscaper, twingRawFilter} from "./twing/extension/escaper";
import {TwingExtensionOptimizer} from "./twing/extension/optimizer";
import {TwingExtensionProfiler} from "./twing/extension/profiler";
import {TwingExtensionSandbox} from "./twing/extension/sandbox";
import {TwingExtensionSet} from "./twing/extension-set";
import {TwingExtensionStaging} from "./twing/extension/staging";
import {TwingExtensionStringLoader, twingTemplateFromString} from "./twing/extension/string-loader";
import {TwingExtension} from "./twing/extension";
import {TwingFileExtensionEscapingStrategy} from "./twing/file-extension-escaping-strategy";
import {TwingFilter} from "./twing/filter";
import {TwingFunction} from "./twing/function";
import {TwingLexer} from "./twing/lexer";
import {TwingLoaderArray} from "./twing/loader/array";
import {TwingLoaderChain} from "./twing/loader/chain";
import {TwingLoaderFilesystem} from "./twing/loader/filesystem";
import {TwingMap} from "./twing/map";
import {TwingMarkup} from "./twing/markup";
import {TwingNodeAutoEscape} from "./twing/node/auto-escape";
import {TwingNodeBlockReference} from "./twing/node/block-reference";
import {TwingNodeBlock} from "./twing/node/block";
import {TwingNodeBody} from "./twing/node/body";
import {TwingNodeCheckSecurity} from "./twing/node/check-security";
import {TwingNodeDo} from "./twing/node/do";
import {TwingNodeEmbed} from "./twing/node/embed";
import {TwingNodeExpressionArray} from "./twing/node/expression/array";
import {TwingNodeExpressionAssignName} from "./twing/node/expression/assign-name";
import {TwingNodeExpressionBinaryAdd} from "./twing/node/expression/binary/add";
import {TwingNodeExpressionBinaryAnd} from "./twing/node/expression/binary/and";
import {TwingNodeExpressionBinaryBitwiseAnd} from "./twing/node/expression/binary/bitwise-and";
import {TwingNodeExpressionBinaryBitwiseOr} from "./twing/node/expression/binary/bitwise-or";
import {TwingNodeExpressionBinaryBitwiseXor} from "./twing/node/expression/binary/bitwise-xor";
import {TwingNodeExpressionBinaryConcat} from "./twing/node/expression/binary/concat";
import {TwingNodeExpressionBinaryDiv} from "./twing/node/expression/binary/div";
import {TwingNodeExpressionBinaryEndsWith} from "./twing/node/expression/binary/ends-with";
import {TwingNodeExpressionBinaryEqual} from "./twing/node/expression/binary/equal";
import {TwingNodeExpressionBinaryFloorDiv} from "./twing/node/expression/binary/floor-div";
import {TwingNodeExpressionBinaryGreaterEqual} from "./twing/node/expression/binary/greater-equal";
import {TwingNodeExpressionBinaryGreater} from "./twing/node/expression/binary/greater";
import {TwingNodeExpressionBinaryIn} from "./twing/node/expression/binary/in";
import {TwingNodeExpressionBinaryLessEqual} from "./twing/node/expression/binary/less-equal";
import {TwingNodeExpressionBinaryLess} from "./twing/node/expression/binary/less";
import {TwingNodeExpressionBinaryMatches} from "./twing/node/expression/binary/matches";
import {TwingNodeExpressionBinaryMod} from "./twing/node/expression/binary/mod";
import {TwingNodeExpressionBinaryMul} from "./twing/node/expression/binary/mul";
import {TwingNodeExpressionBinaryNotEqual} from "./twing/node/expression/binary/not-equal";
import {TwingNodeExpressionBinaryNotIn} from "./twing/node/expression/binary/not-in";
import {TwingNodeExpressionBinaryOr} from "./twing/node/expression/binary/or";
import {TwingNodeExpressionBinaryPower} from "./twing/node/expression/binary/power";
import {TwingNodeExpressionBinaryRange} from "./twing/node/expression/binary/range";
import {TwingNodeExpressionBinaryStartsWith} from "./twing/node/expression/binary/starts-with";
import {TwingNodeExpressionBinarySub} from "./twing/node/expression/binary/sub";
import {TwingNodeExpressionBinary} from "./twing/node/expression/binary";
import {TwingNodeExpressionBlockReference} from "./twing/node/expression/block-reference";
import {TwingNodeExpressionCall} from "./twing/node/expression/call";
import {TwingNodeExpressionConditional} from "./twing/node/expression/conditional";
import {TwingNodeExpressionConstant} from "./twing/node/expression/constant";
import {TwingNodeExpressionFilterDefault} from "./twing/node/expression/filter/default";
import {TwingNodeExpressionFilter} from "./twing/node/expression/filter";
import {TwingNodeExpressionFunction} from "./twing/node/expression/function";
import {TwingNodeExpressionGetAttr} from "./twing/node/expression/get-attr";
import {TwingNodeExpressionHash} from "./twing/node/expression/hash";
import {TwingNodeExpressionMethodCall} from "./twing/node/expression/method-call";
import {TwingNodeExpressionName} from "./twing/node/expression/name";
import {TwingNodeExpressionNullCoalesce} from "./twing/node/expression/null-coalesce";
import {TwingNodeExpressionParent} from "./twing/node/expression/parent";
import {TwingNodeExpressionTestConstant} from "./twing/node/expression/test/constant";
import {TwingNodeExpressionTestDefined} from "./twing/node/expression/test/defined";
import {TwingNodeExpressionTestDivisibleBy} from "./twing/node/expression/test/divisible-by";
import {TwingNodeExpressionTestEven} from "./twing/node/expression/test/even";
import {TwingNodeExpressionTestNull} from "./twing/node/expression/test/null";
import {TwingNodeExpressionTestOdd} from "./twing/node/expression/test/odd";
import {TwingNodeExpressionTestSameAs} from "./twing/node/expression/test/same-as";
import {TwingNodeExpressionTest} from "./twing/node/expression/test";
import {TwingNodeExpressionUnaryNeg} from "./twing/node/expression/unary/neg";
import {TwingNodeExpressionUnaryNot} from "./twing/node/expression/unary/not";
import {TwingNodeExpressionUnaryPos} from "./twing/node/expression/unary/pos";
import {TwingNodeExpressionUnary} from "./twing/node/expression/unary";
import {TwingNodeExpression} from "./twing/node/expression";
import {TwingNodeFlush} from "./twing/node/flush";
import {TwingNodeForLoop} from "./twing/node/for-loop";
import {TwingNodeFor} from "./twing/node/for";
import {TwingNodeIf} from "./twing/node/if";
import {TwingNodeImport} from "./twing/node/import";
import {TwingNodeInclude} from "./twing/node/include";
import {TwingNodeMacro} from "./twing/node/macro";
import {TwingNodeModule} from "./twing/node/module";
import {TwingNodePrint} from "./twing/node/print";
import {TwingNodeSandboxedPrint} from "./twing/node/sandboxed-print";
import {TwingNodeSandbox} from "./twing/node/sandbox";
import {TwingNodeSet} from "./twing/node/set";
import {TwingNodeSpaceless} from "./twing/node/spaceless";
import {TwingNodeText} from "./twing/node/text";
import {TwingNodeTraverser} from "./twing/node-traverser";
import {TwingNodeVisitorEscaper} from "./twing/node-visitor/escaper";
import {TwingNodeVisitorOptimizer} from "./twing/node-visitor/optimizer";
import {TwingNodeVisitorSafeAnalysis} from "./twing/node-visitor/safe-analysis";
import {TwingNodeVisitorSandbox} from "./twing/node-visitor/sandbox";
import {TwingNodeWith} from "./twing/node/with";
import {TwingNode} from "./twing/node";
import {TwingOutputBuffer, TwingOutputHandler} from "./twing/output-buffer";
import {TwingParser} from "./twing/parser";
import {TwingProfilerNodeEnterProfile} from "./twing/profiler/node/enter-profile";
import {TwingProfilerNodeLeaveProfile} from "./twing/profiler/node/leave-profile";
import {TwingProfilerNodeVisitorProfiler} from "./twing/profiler/node-visitor/profiler";
import {TwingProfilerProfile} from "./twing/profiler/profile";
import {range} from "./twing/helper/range";
import {TwingReflectionMethod} from "./twing/reflection-method";
import {TwingReflectionParameter} from "./twing/reflection-parameter";
import {TwingRuntimeLoaderInterface} from "./twing/runtime-loader-interface";
import {TwingSandboxSecurityError} from "./twing/sandbox/security-error";
import {TwingSandboxSecurityNotAllowedFilterError} from "./twing/sandbox/security-not-allowed-filter-error";
import {TwingSandboxSecurityNotAllowedFunctionError} from "./twing/sandbox/security-not-allowed-function-error";
import {TwingSandboxSecurityNotAllowedTagError} from "./twing/sandbox/security-not-allowed-tag-error";
import {TwingSandboxSecurityPolicy} from "./twing/sandbox/security-policy";
import {TwingSource} from "./twing/source";
import {TwingTemplateWrapper} from "./twing/template-wrapper";
import {TwingTemplate} from "./twing/template";
import {TwingTest} from "./twing/test";
import {TwingTokenParserAutoEscape} from "./twing/token-parser/auto-escape";
import {TwingTokenParserBlock} from "./twing/token-parser/block";
import {TwingTokenParserDo} from "./twing/token-parser/do";
import {TwingTokenParserEmbed} from "./twing/token-parser/embed";
import {TwingTokenParserExtends} from "./twing/token-parser/extends";
import {TwingTokenParserFilter} from "./twing/token-parser/filter";
import {TwingTokenParserFlush} from "./twing/token-parser/flush";
import {TwingTokenParserFor} from "./twing/token-parser/for";
import {TwingTokenParserFrom} from "./twing/token-parser/from";
import {TwingTokenParserIf} from "./twing/token-parser/if";
import {TwingTokenParserImport} from "./twing/token-parser/import";
import {TwingTokenParserInclude} from "./twing/token-parser/include";
import {TwingTokenParserMacro} from "./twing/token-parser/macro";
import {TwingTokenParserSandbox} from "./twing/token-parser/sandbox";
import {TwingTokenParserSet} from "./twing/token-parser/set";
import {TwingTokenParserSpaceless} from "./twing/token-parser/spaceless";
import {TwingTokenParserUse} from "./twing/token-parser/use";
import {TwingTokenParserWith} from "./twing/token-parser/with";
import {TwingTokenParser} from "./twing/token-parser";
import {TwingTokenStream} from "./twing/token-stream";
import {varDump} from "./twing/helper/var-dump";

let Twing = {
    abs: abs,
    compare: compare,
    compareArray: compareArray,
    compareNumber: compareNumber,
    compareString: compareString,
    compareToBoolean: compareToBoolean,
    compareToDateTime: compareToDateTime,
    compareToNull: compareToNull,
    defined: defined,
    escape: escape,
    formatDateInterval: formatDateInterval,
    formatDateTime: formatDateTime,
    getContextProxy: getContextProxy,
    iconv: iconv,
    isCountable: isCountable,
    isTraversable: isTraversable,
    iteratorToArray: iteratorToArray,
    iteratorToHash: iteratorToHash,
    iteratorToMap: iteratorToMap,
    jsonEncode: jsonEncode,
    max: max,
    min: min,
    range: range,
    regexParser: regexParser,
    relativeDate: relativeDate,
    TokenPosition: TokenPosition,
    twingArrayBatch: twingArrayBatch,
    twingArrayMerge: twingArrayMerge,
    TwingBaseNodeVisitor: TwingBaseNodeVisitor,
    TwingCacheFilesystem: TwingCacheFilesystem,
    TwingCacheNull: TwingCacheNull,
    twingCapitalizeStringFilter: twingCapitalizeStringFilter,
    TwingCompiler: TwingCompiler,
    twingConstant: twingConstant,
    twingConvertEncoding: twingConvertEncoding,
    twingCycle: twingCycle,
    twingDateConverter: twingDateConverter,
    twingDateFormatFilter: twingDateFormatFilter,
    twingDateModifyFilter: twingDateModifyFilter,
    twingDefaultFilter: twingDefaultFilter,
    twingEnsureTraversable: twingEnsureTraversable,
    TwingEnvironment: TwingEnvironment,
    TwingError: TwingError,
    TwingErrorLoader: TwingErrorLoader,
    TwingErrorRuntime: TwingErrorRuntime,
    TwingErrorSyntax: TwingErrorSyntax,
    twingEscapeFilter: twingEscapeFilter,
    twingEscapeFilterIsSafe: twingEscapeFilterIsSafe,
    TwingExpressionParser: TwingExpressionParser,
    TwingExtension: TwingExtension,
    TwingExtensionCore: TwingExtensionCore,
    TwingExtensionDebug: TwingExtensionDebug,
    TwingExtensionEscaper: TwingExtensionEscaper,
    TwingExtensionOptimizer: TwingExtensionOptimizer,
    TwingExtensionProfiler: TwingExtensionProfiler,
    TwingExtensionSandbox: TwingExtensionSandbox,
    TwingExtensionSet: TwingExtensionSet,
    TwingExtensionStaging: TwingExtensionStaging,
    TwingExtensionStringLoader: TwingExtensionStringLoader,
    TwingFileExtensionEscapingStrategy: TwingFileExtensionEscapingStrategy,
    TwingFilter: TwingFilter,
    twingFirst: twingFirst,
    TwingFunction: TwingFunction,
    twingGetAttribute: twingGetAttribute,
    twingInFilter: twingInFilter,
    twingJoinFilter: twingJoinFilter,
    twingLast: twingLast,
    twingLengthFilter: twingLengthFilter,
    TwingLexer: TwingLexer,
    TwingLoaderArray: TwingLoaderArray,
    TwingLoaderChain: TwingLoaderChain,
    TwingLoaderFilesystem: TwingLoaderFilesystem,
    twingLowerFilter: twingLowerFilter,
    TwingMap: TwingMap,
    TwingMarkup: TwingMarkup,
    TwingNode: TwingNode,
    TwingNodeAutoEscape: TwingNodeAutoEscape,
    TwingNodeBlock: TwingNodeBlock,
    TwingNodeBlockReference: TwingNodeBlockReference,
    TwingNodeBody: TwingNodeBody,
    TwingNodeCheckSecurity: TwingNodeCheckSecurity,
    TwingNodeDo: TwingNodeDo,
    TwingNodeEmbed: TwingNodeEmbed,
    TwingNodeExpression: TwingNodeExpression,
    TwingNodeExpressionArray: TwingNodeExpressionArray,
    TwingNodeExpressionAssignName: TwingNodeExpressionAssignName,
    TwingNodeExpressionBinary: TwingNodeExpressionBinary,
    TwingNodeExpressionBinaryAdd: TwingNodeExpressionBinaryAdd,
    TwingNodeExpressionBinaryAnd: TwingNodeExpressionBinaryAnd,
    TwingNodeExpressionBinaryBitwiseAnd: TwingNodeExpressionBinaryBitwiseAnd,
    TwingNodeExpressionBinaryBitwiseOr: TwingNodeExpressionBinaryBitwiseOr,
    TwingNodeExpressionBinaryBitwiseXor: TwingNodeExpressionBinaryBitwiseXor,
    TwingNodeExpressionBinaryConcat: TwingNodeExpressionBinaryConcat,
    TwingNodeExpressionBinaryDiv: TwingNodeExpressionBinaryDiv,
    TwingNodeExpressionBinaryEndsWith: TwingNodeExpressionBinaryEndsWith,
    TwingNodeExpressionBinaryEqual: TwingNodeExpressionBinaryEqual,
    TwingNodeExpressionBinaryFloorDiv: TwingNodeExpressionBinaryFloorDiv,
    TwingNodeExpressionBinaryGreater: TwingNodeExpressionBinaryGreater,
    TwingNodeExpressionBinaryGreaterEqual: TwingNodeExpressionBinaryGreaterEqual,
    TwingNodeExpressionBinaryIn: TwingNodeExpressionBinaryIn,
    TwingNodeExpressionBinaryLess: TwingNodeExpressionBinaryLess,
    TwingNodeExpressionBinaryLessEqual: TwingNodeExpressionBinaryLessEqual,
    TwingNodeExpressionBinaryMatches: TwingNodeExpressionBinaryMatches,
    TwingNodeExpressionBinaryMod: TwingNodeExpressionBinaryMod,
    TwingNodeExpressionBinaryMul: TwingNodeExpressionBinaryMul,
    TwingNodeExpressionBinaryNotEqual: TwingNodeExpressionBinaryNotEqual,
    TwingNodeExpressionBinaryNotIn: TwingNodeExpressionBinaryNotIn,
    TwingNodeExpressionBinaryOr: TwingNodeExpressionBinaryOr,
    TwingNodeExpressionBinaryPower: TwingNodeExpressionBinaryPower,
    TwingNodeExpressionBinaryRange: TwingNodeExpressionBinaryRange,
    TwingNodeExpressionBinaryStartsWith: TwingNodeExpressionBinaryStartsWith,
    TwingNodeExpressionBinarySub: TwingNodeExpressionBinarySub,
    TwingNodeExpressionBlockReference: TwingNodeExpressionBlockReference,
    TwingNodeExpressionCall: TwingNodeExpressionCall,
    TwingNodeExpressionConditional: TwingNodeExpressionConditional,
    TwingNodeExpressionConstant: TwingNodeExpressionConstant,
    TwingNodeExpressionFilter: TwingNodeExpressionFilter,
    TwingNodeExpressionFilterDefault: TwingNodeExpressionFilterDefault,
    TwingNodeExpressionFunction: TwingNodeExpressionFunction,
    TwingNodeExpressionGetAttr: TwingNodeExpressionGetAttr,
    TwingNodeExpressionHash: TwingNodeExpressionHash,
    TwingNodeExpressionMethodCall: TwingNodeExpressionMethodCall,
    TwingNodeExpressionName: TwingNodeExpressionName,
    TwingNodeExpressionNullCoalesce: TwingNodeExpressionNullCoalesce,
    TwingNodeExpressionParent: TwingNodeExpressionParent,
    TwingNodeExpressionTest: TwingNodeExpressionTest,
    TwingNodeExpressionTestConstant: TwingNodeExpressionTestConstant,
    TwingNodeExpressionTestDefined: TwingNodeExpressionTestDefined,
    TwingNodeExpressionTestDivisibleBy: TwingNodeExpressionTestDivisibleBy,
    TwingNodeExpressionTestEven: TwingNodeExpressionTestEven,
    TwingNodeExpressionTestNull: TwingNodeExpressionTestNull,
    TwingNodeExpressionTestOdd: TwingNodeExpressionTestOdd,
    TwingNodeExpressionTestSameAs: TwingNodeExpressionTestSameAs,
    TwingNodeExpressionUnary: TwingNodeExpressionUnary,
    TwingNodeExpressionUnaryNeg: TwingNodeExpressionUnaryNeg,
    TwingNodeExpressionUnaryNot: TwingNodeExpressionUnaryNot,
    TwingNodeExpressionUnaryPos: TwingNodeExpressionUnaryPos,
    TwingNodeFlush: TwingNodeFlush,
    TwingNodeFor: TwingNodeFor,
    TwingNodeForLoop: TwingNodeForLoop,
    TwingNodeIf: TwingNodeIf,
    TwingNodeImport: TwingNodeImport,
    TwingNodeInclude: TwingNodeInclude,
    TwingNodeMacro: TwingNodeMacro,
    TwingNodeModule: TwingNodeModule,
    TwingNodePrint: TwingNodePrint,
    TwingNodeSandbox: TwingNodeSandbox,
    TwingNodeSandboxedPrint: TwingNodeSandboxedPrint,
    TwingNodeSet: TwingNodeSet,
    TwingNodeSpaceless: TwingNodeSpaceless,
    TwingNodeText: TwingNodeText,
    TwingNodeTraverser: TwingNodeTraverser,
    TwingNodeVisitorEscaper: TwingNodeVisitorEscaper,
    TwingNodeVisitorOptimizer: TwingNodeVisitorOptimizer,
    TwingNodeVisitorSafeAnalysis: TwingNodeVisitorSafeAnalysis,
    TwingNodeVisitorSandbox: TwingNodeVisitorSandbox,
    TwingNodeWith: TwingNodeWith,
    twingNumberFormatFilter: twingNumberFormatFilter,
    TwingOutputBuffer: TwingOutputBuffer,
    TwingOutputHandler: TwingOutputHandler,
    TwingParser: TwingParser,
    TwingProfilerNodeEnterProfile: TwingProfilerNodeEnterProfile,
    TwingProfilerNodeLeaveProfile: TwingProfilerNodeLeaveProfile,
    TwingProfilerNodeVisitorProfiler: TwingProfilerNodeVisitorProfiler,
    TwingProfilerProfile: TwingProfilerProfile,
    twingRandom: twingRandom,
    twingRawFilter: twingRawFilter,
    TwingReflectionMethod: TwingReflectionMethod,
    TwingReflectionParameter: TwingReflectionParameter,
    twingReplaceFilter: twingReplaceFilter,
    twingReverseFilter: twingReverseFilter,
    twingRound: twingRound,
    TwingRuntimeLoaderInterface: TwingRuntimeLoaderInterface,
    TwingSandboxSecurityError: TwingSandboxSecurityError,
    TwingSandboxSecurityNotAllowedFilterError: TwingSandboxSecurityNotAllowedFilterError,
    TwingSandboxSecurityNotAllowedFunctionError: TwingSandboxSecurityNotAllowedFunctionError,
    TwingSandboxSecurityNotAllowedTagError: TwingSandboxSecurityNotAllowedTagError,
    TwingSandboxSecurityPolicy: TwingSandboxSecurityPolicy,
    twingSlice: twingSlice,
    twingSortFilter: twingSortFilter,
    twingSource: twingSource,
    TwingSource: TwingSource,
    twingSplitFilter: twingSplitFilter,
    TwingTemplate: TwingTemplate,
    twingTemplateFromString: twingTemplateFromString,
    TwingTemplateWrapper: TwingTemplateWrapper,
    TwingTest: TwingTest,
    twingTestEmpty: twingTestEmpty,
    twingTestIterable: twingTestIterable,
    twingTitleStringFilter: twingTitleStringFilter,
    TwingTokenParser: TwingTokenParser,
    TwingTokenParserAutoEscape: TwingTokenParserAutoEscape,
    TwingTokenParserBlock: TwingTokenParserBlock,
    TwingTokenParserDo: TwingTokenParserDo,
    TwingTokenParserEmbed: TwingTokenParserEmbed,
    TwingTokenParserExtends: TwingTokenParserExtends,
    TwingTokenParserFilter: TwingTokenParserFilter,
    TwingTokenParserFlush: TwingTokenParserFlush,
    TwingTokenParserFor: TwingTokenParserFor,
    TwingTokenParserFrom: TwingTokenParserFrom,
    TwingTokenParserIf: TwingTokenParserIf,
    TwingTokenParserImport: TwingTokenParserImport,
    TwingTokenParserInclude: TwingTokenParserInclude,
    TwingTokenParserMacro: TwingTokenParserMacro,
    TwingTokenParserSandbox: TwingTokenParserSandbox,
    TwingTokenParserSet: TwingTokenParserSet,
    TwingTokenParserSpaceless: TwingTokenParserSpaceless,
    TwingTokenParserUse: TwingTokenParserUse,
    TwingTokenParserWith: TwingTokenParserWith,
    TwingTokenStream: TwingTokenStream,
    twingTrimFilter: twingTrimFilter,
    twingUpperFilter: twingUpperFilter,
    twingUrlencodeFilter: twingUrlencodeFilter,
    twingVarDump: twingVarDump,
    varDump: varDump
};

export = Twing;
