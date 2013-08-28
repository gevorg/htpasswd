// Import CoffeeScript.
require('coffee-script');

// Importing module.
var utils = require('../lib/utils');

// Test for ssh1 function.
exports['testSHA1'] = function(test) {
	test.equal(utils.sha1("devochka"), "deWaCTR7rOMysgZN3EgtgAaTzPs=", "SHA1 is wrong!");
	test.done();
};

// Test for encode with delete option.
exports['testEncodeDelete'] = function(test) {
	test.ok(!utils.encode({'delete': true}), "Should be empty!");
	test.done();
};

// Test for encode with plain option.
exports['testEncodePlain'] = function(test) {
	var encoded = utils.encode({'plaintext': true, 'args': ["olga", "chexova111"]});
	test.equal(encoded, "olga:chexova111", "Should be plaintext!");
	test.done();
};

// Test for encode with sha1 option.
exports['testEncodeSHA1'] = function(test) {
	var encoded = utils.encode({'args': ["olga", "chexova111"]});
	test.equal(encoded, "olga:{SHA}Iv8c5zqtbvxiwFTxcEI6CteSx48=", "Should be sha1!");
	test.done();
};

// Test for validate with plain option true.
exports['testValidatePlain'] = function(test) {
	var valid = utils.validate("mia", "mia");
	test.ok(valid, "Must be valid!");
	test.done();
};

// Test for validate with plain option false.
exports['testValidatePlainInvalid'] = function(test) {
	var valid = utils.validate("mia", "sonia");
	test.ok(!valid, "Must be invalid!");
	test.done();
};

// Test for validate with SHA1 option true.
exports['testValidateSHA1'] = function(test) {
	var valid = utils.validate("{SHA}8a8oDtHqW4mb6fZGjoW5zio6FjU=", "appleofmyeye");
	test.ok(valid, "Must be valid!");
	test.done();
};

// Test for validate with SHA1 option false.
exports['testValidateSHA1Invalid'] = function(test) {
	var valid = utils.validate("{SHA}Iv8c5zqtbvxiwFTxcEI6CteSx48=", "theotherwoman");
	test.ok(!valid, "Must be invalid!");
	test.done();
};
