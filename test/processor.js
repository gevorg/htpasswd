"use strict";

// FS.
import fs from 'fs'

// Expect module.
import {expect} from 'chai'

// Source.
import * as processor from '../src/processor'

// Processor.
describe('processor', function () {
    // Tests for exec.
    describe('#exec', function () {
        afterEach(function () {
            if (fs.existsSync("password.txt")) {
                fs.unlinkSync("password.txt");
            }
        });

        it('console output', function () {
            let program = {
                'batch': true, 'nofile': true, 'sha': true,
                'args': ["mary", "pass12"]
            };

            let preservedLog = console.log;
            console.log = function() {
                console.log = preservedLog;
                console.log.apply(console, arguments);

                expect(arguments[0]).to.equal("mary:{SHA}TgXU+mQ5o9ryuFPj3xhY1C6GHfE=");
            };

            // Source.
            processor.exec(program);
        });

        it('successful password verification', function () {
            fs.writeFileSync("password.txt", "detka:milaya\n", 'UTF-8');
            let program = {
                'batch': true, 'verify': true, plain: true,
                'args': ["password.txt", "detka", "milaya"]
            };

            let preservedLog = console.log;
            console.log = function() {
                console.log = preservedLog;
                console.log.apply(console, arguments);

                expect(arguments[0]).to.equal("Password for user detka correct.");
            };

            // Source.
            processor.exec(program);
        });

        it('failed password verification', function () {
            fs.writeFileSync("password.txt", "detka:nemilaya\n", 'UTF-8');
            let program = {
                'batch': true, 'verify': true, plain: true,
                'args': ["password.txt", "detka", "milaya"]
            };

            let preservedLog = console.log;
            console.log = function() {
                console.log = preservedLog;
                console.log.apply(console, arguments);

                expect(arguments[0]).to.equal("Password verification failed.");
            };

            // Source.
            processor.exec(program);
        });

        it('file create', function () {
            let program = {
                'batch': true, 'sha': true, 'create': true,
                'args': ["password.txt", "gevorg", "sho"]
            };

            // Source.
            processor.exec(program);

            let fileData = fs.readFileSync("password.txt", 'UTF-8');
            expect(fileData).to.equal("gevorg:{SHA}NSjjR5VzkksaQNgdEKs0MqPtStI=\n");
        });

        it('file update', function () {
            fs.writeFileSync("password.txt", "mihrdat:{SHA}NSjjR5VzkksaQNgdEKs0MqPtStI=\n", 'UTF-8');
            let program = {
                'batch': true, 'sha': true,
                'args': ["password.txt", "mihrdat", "king"]
            };

            // Source.
            processor.exec(program);

            let fileData = fs.readFileSync("password.txt", 'UTF-8');
            expect(fileData).to.equal("mihrdat:{SHA}SBkC7BTq8/z+xr6CvWpjuXKsUX8=\n");
        });

        it('file delete', function () {
            fs.writeFileSync("password.txt", "urmia:{SHA}NSjjR5VzkksaQNgdEKs0MqPtStI=\n", 'UTF-8');
            let program = {'delete': true, 'args': ["password.txt", "urmia"]};

            // Source.
            processor.exec(program);

            let fileData = fs.readFileSync("password.txt", 'UTF-8');
            expect(fileData).to.equal("\n");
        });

        it('file delete not existing', function () {
            fs.writeFileSync("password.txt", "urmia:{SHA}NSjjR5VzkksaQNgdEKs0MqPtStI=\n", 'UTF-8');
            let program = {'delete': true, 'args': ["password.txt", "sonya"]};

            let preservedLog = console.log;
            console.error = function() {
                console.error = preservedLog;
                console.error.apply(console, arguments);

                expect(arguments[0]).to.equal("User sonya not found.");
            };

            // Source.
            processor.exec(program);
        });

        it('file add', function () {
            let initData = "mihrdat:{SHA}NSjjR5VzkksaQNgdEKs0MqPtStI=\n";
            fs.writeFileSync("password.txt", initData, 'UTF-8');

            let program = {
                'sha': true, 'batch': true,
                'args': ["password.txt", "tigran", "thegreat"]
            };

            // Source.
            processor.exec(program);

            let fileData = fs.readFileSync("password.txt", 'UTF-8');
            expect(fileData).to.equal(`${initData}tigran:{SHA}1cYTTawbHcKifj2Yn6MC8bDq7Dc=\n`);
        });

        it('file add, not existing', function () {
            let program = {
                'batch': true,
                'args': ["password.txt", "tigran", "thegreat"]
            };

            let preservedLog = console.log;
            console.error = function() {
                console.error = preservedLog;
                console.error.apply(console, arguments);

                expect(arguments[0]).to.equal("Cannot modify file password.txt; use '-c' to create it.");
            };

            // Source.
            processor.exec(program);
        });

        it('help', function (done) {
            let program = {'args': ["klara"], 'help': function() {
                done();
            }};

            // Source.
            processor.exec(program);
        });
    });

    // Tests for validate.
    describe('#validate', function () {
        it('username', function () {
            // Source.
            let valid = processor.validate({'nofile': true, 'args': ["natalya"]});

            // Expectation.
            expect(valid).to.be.true;
        });

        it('username, password', function () {
            // Source.
            let valid = processor.validate({'nofile': true, 'batch': true, 'args': ["kiara", "superPass"]});

            // Expectation.
            expect(valid).to.be.true;
        });

        it('username, password, file', function () {
            // Source.
            let valid = processor.validate({'batch': true, 'args': ["pass.txt", "anna", "userPass"]});

            // Expectation.
            expect(valid).to.be.true;
        });

        it('missing password', function () {
            // Source.
            let valid = processor.validate({'batch': true, 'args': ["super.txt", "rita"]});

            // Expectation.
            expect(valid).to.be.false;
        });

        it('missing file', function () {
            // Source.
            let valid = processor.validate({'args': ["rita"]});

            // Expectation.
            expect(valid).to.be.false;
        });
    });
});
