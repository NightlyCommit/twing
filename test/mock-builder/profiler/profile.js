const TwingProfilerProfile = require('../../../lib/twing/profiler/profile').TwingProfilerProfile;
const sinon = require('sinon');

/**
 * @param {string} name
 * @param {number} duration
 * @param {boolean} isTemplate
 * @param {string} type
 * @param {string} templateName
 * @param {Array} subProfiles
 *
 * @returns TwingProfilerProfile
 */
let generateProfile = function (name, duration, isTemplate, type, templateName, subProfiles = []) {
    let profile = new TwingProfilerProfile();

    sinon.stub(profile, 'isRoot').returns(false);
    sinon.stub(profile, 'getName').returns(name);
    sinon.stub(profile, 'getDuration').returns(duration);
    sinon.stub(profile, 'getMemoryUsage').returns(0);
    sinon.stub(profile, 'getPeakMemoryUsage').returns(0);
    sinon.stub(profile, 'isTemplate').returns(isTemplate);
    sinon.stub(profile, 'getType').returns(type);
    sinon.stub(profile, 'getTemplate').returns(templateName);
    sinon.stub(profile, 'getProfiles').returns(subProfiles);
    sinon.stub(profile, 'getIterator').returns(subProfiles[Symbol.iterator]);

    return profile;
};

let getIndexProfile = function (subProfiles = []) {
    return generateProfile('main', 1, true, 'template', 'index.twig', subProfiles);
};

let getEmbeddedBlockProfile = function (subProfiles = []) {
    return generateProfile('body', 0.0001, false, 'block', 'embedded.twig', subProfiles);
};

let getEmbeddedTemplateProfile = function (subProfiles = []) {
    return generateProfile('main', 0.0001, true, 'template', 'embedded.twig', subProfiles);
};

let getIncludedTemplateProfile = function (subProfiles = []) {
    return generateProfile('main', 0.0001, true, 'template', 'included.twig', subProfiles);
};

let getMacroProfile = function (subProfiles = []) {
    return generateProfile('foo', 0.0001, false, 'macro', 'index.twig', subProfiles);
};

module.exports.getProfile = function () {
    let profile = new TwingProfilerProfile();

    sinon.stub(profile, 'isRoot').returns(true);
    sinon.stub(profile, 'getName').returns('main');
    sinon.stub(profile, 'getDuration').returns(1);
    sinon.stub(profile, 'getMemoryUsage').returns(0);
    sinon.stub(profile, 'getPeakMemoryUsage').returns(0);

    let subProfiles = [
        getIndexProfile([
            getEmbeddedBlockProfile(),
            getEmbeddedTemplateProfile([
                getIncludedTemplateProfile()
            ]),
            getMacroProfile(),
            getEmbeddedTemplateProfile([
                getIncludedTemplateProfile()
            ])
        ])
    ];

    sinon.stub(profile, 'getProfiles').returns(subProfiles);
    sinon.stub(profile, 'getIterator').returns(subProfiles[Symbol.iterator]);

    return profile;
};