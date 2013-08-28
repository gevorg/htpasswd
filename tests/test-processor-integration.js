// Import CoffeeScript.
require('coffee-script');

// Importing module.
var processor = require('../lib/processor');

// FS module.
var fs = require('fs');

// After each test.
exports['tearDown'] = function(callback) {
	if ( fs.existsSync("password.txt") ) {
		fs.unlinkSync("password.txt");
	}
	
	callback();
};

// Test for process with console output.
exports['testProcessConsole'] = function(test) {
	var program = {'batch': true, 'nofile': true, 'args': ["mary", "pass12"]};	
	var preservedLog = console.log;	

	console.log = function() {
		console.log = preservedLog; 
		console.log.apply(console, arguments);

		test.equals(arguments[0], "mary:{SHA}TgXU+mQ5o9ryuFPj3xhY1C6GHfE=", "Output is wrong!");
	};
	
	processor.process(program);		
	test.done();
};

// Test for process with file create.
exports['testProcessFileCreate'] = function(test) {
	var program = {'batch': true, 'create': true, 'args': ["password.txt", "gevorg", "sho"]};	

	processor.process(program);
	
	var fileData = fs.readFileSync("password.txt", 'UTF-8');
	test.equal(fileData, "gevorg:{SHA}NSjjR5VzkksaQNgdEKs0MqPtStI=\n", "File data is wrong!");
	
	test.done();
};

// Test for process with file update.
exports['testProcessFileUpdate'] = function(test) {
	fs.writeFileSync("password.txt", "mihrdat:{SHA}NSjjR5VzkksaQNgdEKs0MqPtStI=\n", 'UTF-8');
	var program = {'batch': true, 'args': ["password.txt", "mihrdat", "king"]};	
	processor.process(program);
	
	var fileData = fs.readFileSync("password.txt", 'UTF-8');
	test.equal(fileData, "mihrdat:{SHA}SBkC7BTq8/z+xr6CvWpjuXKsUX8=\n", "File data is wrong!");
	
	test.done();
};

// Test for process with file delete.
exports['testProcessFileDelete'] = function(test) {
	fs.writeFileSync("password.txt", "urmia:{SHA}NSjjR5VzkksaQNgdEKs0MqPtStI=\n", 'UTF-8');
	var program = {'delete': true, 'args': ["password.txt", "urmia"]};	
	processor.process(program);
	
	var fileData = fs.readFileSync("password.txt", 'UTF-8');
	test.equal(fileData, "\n", "File data is wrong!");
	
	test.done();
};

// Test for process with file delete not existing.
exports['testProcessFileDeleteNotExisting'] = function(test) {
	fs.writeFileSync("password.txt", "urmia:{SHA}NSjjR5VzkksaQNgdEKs0MqPtStI=\n", 'UTF-8');
	var program = {'delete': true, 'args': ["password.txt", "sonya"]};	
	
	var preservedLog = console.log;	
	console.error = function() {
		console.error = preservedLog; 
		console.error.apply(console, arguments);

		test.equals(arguments[0], "User sonya not found.", "Output is wrong!");
	};
	
	processor.process(program);
	test.done();
};

// Test for process with file add.
exports['testProcessFileAdd'] = function(test) {
	var initData = "mihrdat:{SHA}NSjjR5VzkksaQNgdEKs0MqPtStI=\n";
	fs.writeFileSync("password.txt", initData, 'UTF-8');
	
	var program = {'batch': true, 'args': ["password.txt", "tigran", "thegreat"]};	
	processor.process(program);
	
	var fileData = fs.readFileSync("password.txt", 'UTF-8');
	test.equal(fileData, initData + "tigran:{SHA}1cYTTawbHcKifj2Yn6MC8bDq7Dc=\n", 
			"File data is wrong!");
	
	test.done();
};

// Test for process with file add, not existing.
exports['testProcessFileAddNotExisting'] = function(test) {
	var program = {'batch': true, 'args': ["password.txt", "tigran", "thegreat"]};	

	var preservedLog = console.log;	
	console.error = function() {
		console.error = preservedLog; 
		console.error.apply(console, arguments);

		test.equals(arguments[0], "Cannot modify file password.txt; use '-c' to create it.", 
				"Output is wrong!");
	};
	
	processor.process(program);
	test.done();
};