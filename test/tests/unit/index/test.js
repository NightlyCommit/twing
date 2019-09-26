const mainIndex = require('../../../../dist/cjs/main');
const browserIndex = require('../../../../dist/cjs/browser');
const tape = require('tape');

tape.test('main and browser indexes', function (test) {
    let expected = [
        'TwingBaseNodeVisitor',
        'TwingCacheFilesystem',
        'TwingCacheNull',
        'TwingCompiler',
        'TwingEnvironment',
        'TwingError',
        'TwingErrorLoader',
        'TwingErrorRuntime',
        'TwingErrorSyntax',
        'TwingExtension',
        'TwingExtensionCore',
        'TwingExtensionSet',
        'TwingFileExtensionEscapingStrategy',
        'TwingFilter',
        'TwingFunction',
        'TwingLexer',
        'TwingLoaderArray',
        'TwingLoaderChain',
        'TwingLoaderFilesystem',
        'TwingLoaderNull',
        'TwingLoaderRelativeFilesystem',
        'TwingMarkup',
        'TwingNode',
        'TwingNodeAutoEscape',
        'TwingNodeBlock',
        'TwingNodeBlockReference',
        'TwingNodeBody',
        'TwingNodeCheckSecurity',
        'TwingNodeDeprecated',
        'TwingNodeDo',
        'TwingNodeEmbed',
        'TwingNodeExpression',
        'TwingNodeExpressionArray',
        'TwingNodeExpressionAssignName',
        'TwingNodeExpressionBinary',
        'TwingNodeExpressionBinaryAdd',
        'TwingNodeExpressionBinaryAnd',
        'TwingNodeExpressionBinaryBitwiseAnd',
        'TwingNodeExpressionBinaryBitwiseOr',
        'TwingNodeExpressionBinaryBitwiseXor',
        'TwingNodeExpressionBinaryConcat',
        'TwingNodeExpressionBinaryDiv',
        'TwingNodeExpressionBinaryEndsWith',
        'TwingNodeExpressionBinaryEqual',
        'TwingNodeExpressionBinaryFloorDiv',
        'TwingNodeExpressionBinaryGreater',
        'TwingNodeExpressionBinaryGreaterEqual',
        'TwingNodeExpressionBinaryIn',
        'TwingNodeExpressionBinaryLess',
        'TwingNodeExpressionBinaryLessEqual',
        'TwingNodeExpressionBinaryMatches',
        'TwingNodeExpressionBinaryMod',
        'TwingNodeExpressionBinaryMul',
        'TwingNodeExpressionBinaryNotEqual',
        'TwingNodeExpressionBinaryNotIn',
        'TwingNodeExpressionBinaryOr',
        'TwingNodeExpressionBinaryPower',
        'TwingNodeExpressionBinaryRange',
        'TwingNodeExpressionBinaryStartsWith',
        'TwingNodeExpressionBinarySub',
        'TwingNodeExpressionBlockReference',
        'TwingNodeExpressionCall',
        'TwingNodeExpressionConditional',
        'TwingNodeExpressionConstant',
        'TwingNodeExpressionFilter',
        'TwingNodeExpressionFilterDefault',
        'TwingNodeExpressionFunction',
        'TwingNodeExpressionGetAttr',
        'TwingNodeExpressionHash',
        'TwingNodeExpressionMethodCall',
        'TwingNodeExpressionName',
        'TwingNodeExpressionNullCoalesce',
        'TwingNodeExpressionParent',
        'TwingNodeExpressionTest',
        'TwingNodeExpressionTestConstant',
        'TwingNodeExpressionTestDefined',
        'TwingNodeExpressionUnary',
        'TwingNodeExpressionUnaryNeg',
        'TwingNodeExpressionUnaryNot',
        'TwingNodeExpressionUnaryPos',
        'TwingNodeFlush',
        'TwingNodeFor',
        'TwingNodeForLoop',
        'TwingNodeIf',
        'TwingNodeImport',
        'TwingNodeInclude',
        'TwingNodeMacro',
        'TwingNodeModule',
        'TwingNodePrint',
        'TwingNodeSandbox',
        'TwingNodeSandboxedPrint',
        'TwingNodeSet',
        'TwingNodeSpaceless',
        'TwingNodeText',
        'TwingNodeTraverser',
        'TwingNodeType',
        'TwingNodeVerbatim',
        'TwingNodeVisitorEscaper',
        'TwingNodeVisitorOptimizer',
        'TwingNodeVisitorSafeAnalysis',
        'TwingNodeVisitorSandbox',
        'TwingNodeWith',
        'TwingOperator',
        'TwingOperatorType',
        'TwingOperatorAssociativity',
        'TwingOutputBuffering',
        'TwingOutputHandler',
        'TwingParser',
        'TwingSandboxSecurityError',
        'TwingSandboxSecurityNotAllowedFilterError',
        'TwingSandboxSecurityNotAllowedFunctionError',
        'TwingSandboxSecurityNotAllowedMethodError',
        'TwingSandboxSecurityNotAllowedPropertyError',
        'TwingSandboxSecurityNotAllowedTagError',
        'TwingSandboxSecurityPolicy',
        'TwingSource',
        'TwingSourceMapNode',
        'TwingSourceMapNodeFactory',
        'TwingSourceMapNodeFactorySpaceless',
        'TwingSourceMapNodeSpaceless',
        'TwingTemplate',
        'TwingTest',
        'TwingTokenParser',
        'TwingTokenParserAutoEscape',
        'TwingTokenParserBlock',
        'TwingTokenParserDo',
        'TwingTokenParserEmbed',
        'TwingTokenParserExtends',
        'TwingTokenParserFilter',
        'TwingTokenParserFlush',
        'TwingTokenParserFor',
        'TwingTokenParserFrom',
        'TwingTokenParserIf',
        'TwingTokenParserImport',
        'TwingTokenParserInclude',
        'TwingTokenParserMacro',
        'TwingTokenParserSandbox',
        'TwingTokenParserSet',
        'TwingTokenParserSpaceless',
        'TwingTokenParserUse',
        'TwingTokenParserVerbatim',
        'TwingTokenParserWith',
        'TwingTokenStream'
    ];

    for (let key of expected) {
        test.true(mainIndex[key], `${key} is exported by main index`);
        test.true(browserIndex[key], `${key} is exported by browser index`);
    }

    for (let key in mainIndex) {
        test.true(expected.includes(key), `${key} is legit in main index`);
    }

    for (let key in browserIndex) {
        test.true(expected.includes(key), `${key} is legit in browser index`);
    }

    test.same(browserIndex.TwingLoaderFilesystem.name, 'TwingLoaderNull', 'browser export of TwingLoaderFilesystem is a noop');
    test.same(browserIndex.TwingLoaderRelativeFilesystem.name, 'TwingLoaderNull', 'browser export of TwingLoaderRelativefilesystem is a noop');
    test.same(browserIndex.TwingCacheFilesystem.name, 'TwingCacheNull', 'browser export of TwingCacheFilesystem is a noop');

    test.end();
});