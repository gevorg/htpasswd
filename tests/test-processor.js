// Import CoffeeScript.
require('coffee-script');

// Importing module.
var processor = require('../lib/processor');

// Test for validate only username.
exports['testValidateUsername'] = function(test) {
	var valid = processor.validate({'nofile': true, 'args': ["natalya"]});
	test.ok(valid, "Should be valid!");
	test.done();
};

// Test for validate only username, password.
exports['testValidateUsernamePass'] = function(test) {
	var program = {'nofile': true, 'batch': true, 'args': ["kiara", "superPass"]}; 
	var valid = processor.validate(program);
	test.ok(valid, "Should be valid!");
	test.done();
};

// Test for validate only username, password, file.
exports['testValidateUsernamePassFile'] = function(test) {
	var program = {'batch': true, 'args': ["pass.txt", "anna", "userPass"]}; 
	var valid = processor.validate(program);
	test.ok(valid, "Should be valid!");
	test.done();
};

// Test for validate only missing password.
exports['testValidateInvalidPass'] = function(test) {
	var program = {'batch': true, 'args': ["super.txt", "rita"]}; 
	var valid = processor.validate(program);
	test.ok(!valid, "Should be invalid!");
	test.done();
};

// Test for validate only missing file.
exports['testValidateInvalidFile'] = function(test) {
	var valid = processor.validate({'args': ["rita"]});
	test.ok(!valid, "Should be invalid!");
	test.done();
};

// Test for process password function.
exports['testProcessPassword'] = function(test) {
	var program = {'nofile': true, 'args': ["lianna"]};
	
	program.password = function(){
		test.done();
	};
	
	processor.process(program);
};

// Test for process help function.
exports['testProcessHelp'] = function(test) {
	var program = {'args': ["klara"]};
	
	program.help = function(){
		test.done();
	};
	
	processor.process(program);
};