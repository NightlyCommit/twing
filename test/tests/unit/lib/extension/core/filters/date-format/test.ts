import * as tape from 'tape';
import {TwingExtensionCore} from "../../../../../../../../src/lib/extension/core";

tape('date-format', (test) => {
    let extension = new TwingExtensionCore();

    extension.setDateFormat();

    test.same(extension.getDateFormat(), ['F j, Y H:i', '%d days']);

    test.end();
});
