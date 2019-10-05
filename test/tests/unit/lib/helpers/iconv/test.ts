import * as tape from 'tape';
import {iconv} from "../../../../../../src/lib/helpers/iconv";

tape('iconv', function(test) {
    test.test('is non destructive', function(test) {
        test.same(iconv('ISO-8859-1', 'UTF-8', iconv('UTF-8', 'ISO-8859-1', Buffer.from('Äé'))).toString(), 'Äé');

        test.end();
    });

    test.end();
});