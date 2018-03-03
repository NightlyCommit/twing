const TwingTestIntegrationTestCaseBase = require('../../../../../integration-test-case');

module.exports = class extends TwingTestIntegrationTestCaseBase {
    getDescription() {
        return 'Twing supports the .. operator';
    }

    getTemplates() {
        let templates = super.getTemplates();

        templates.set('index.twig', require('./index.twig'));

        return templates;
    }

    getExpected() {
        return `
0 1 2 3 4 5 6 7 8 9 10 
a b c d e f g h i j k l m n o p q r s t u v w x y z 
A B C D E F G H I J K L M N O P Q R S T U V W X Y Z 
1 2 3 4 5 6 7 8 9 10 
1 2 3 4 5 6 7 8 9
`;
    }

    getData() {
        return {
            foo: [1, 10]
        };
    }
};
