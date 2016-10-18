"use strict";

// FS.
const fs = require('fs');

// Expect module.
const expect = require('chai').expect;

// Source.
const processor = require('../src/processor');

// Processor.
describe('processor', () => {
    // Tests for exec.
    describe('#exec', () => {
        afterEach(() => {
            if (fs.existsSync("password.txt")) {
                fs.unlinkSync("password.txt");
            }
        });

        it('console output', (done) => {
            const program = {
                'batch': true, 'nofile': true, 'sha': true,
                'args': ["mary", "pass12"]
            };

            const preservedLog = console.log;
            console.log = function () {
                console.log = preservedLog;
                console.log.apply(console, arguments);

                expect(arguments[0]).to.equal("mary:{SHA}TgXU+mQ5o9ryuFPj3xhY1C6GHfE=");
                done();
            };

            // Source.
            processor.exec(program);
        });

        it('successful password verification', (done) => {
            fs.writeFileSync("password.txt", "detka:milaya\n", 'UTF-8');
            const program = {
                'batch': true, 'verify': true, plain: true,
                'args': ["password.txt", "detka", "milaya"]
            };

            const preservedLog = console.log;
            console.log = function () {
                console.log = preservedLog;
                console.log.apply(console, arguments);

                expect(arguments[0]).to.equal("Password for user detka correct.");
                done();
            };

            // Source.
            processor.exec(program);
        });

        it('failed password verification', (done) => {
            fs.writeFileSync("password.txt", "detka:nemilaya\n", 'UTF-8');
            const program = {
                'batch': true, 'verify': true, plain: true,
                'args': ["password.txt", "detka", "milaya"]
            };

            const preservedLog = console.log;
            console.log = function () {
                console.log = preservedLog;
                console.log.apply(console, arguments);

                expect(arguments[0]).to.equal("Password verification failed.");
                done();
            };

            // Source.
            processor.exec(program);
        });

        it('file create', () => {
            const program = {
                'batch': true, 'sha': true, 'create': true,
                'args': ["password.txt", "gevorg", "sho"]
            };

            // Source.
            processor.exec(program);

            const fileData = fs.readFileSync("password.txt", 'UTF-8');
            expect(fileData).to.equal("gevorg:{SHA}NSjjR5VzkksaQNgdEKs0MqPtStI=\n");
        });

        it('file update', () => {
            fs.writeFileSync("password.txt", "mihrdat:{SHA}NSjjR5VzkksaQNgdEKs0MqPtStI=\n", 'UTF-8');
            const program = {
                'batch': true, 'sha': true,
                'args': ["password.txt", "mihrdat", "king"]
            };

            // Source.
            processor.exec(program);

            const fileData = fs.readFileSync("password.txt", 'UTF-8');
            expect(fileData).to.equal("mihrdat:{SHA}SBkC7BTq8/z+xr6CvWpjuXKsUX8=\n");
        });

        it('file delete', () => {
            fs.writeFileSync("password.txt", "urmia:{SHA}NSjjR5VzkksaQNgdEKs0MqPtStI=\n", 'UTF-8');
            const program = {'delete': true, 'args': ["password.txt", "urmia"]};

            // Source.
            processor.exec(program);

            const fileData = fs.readFileSync("password.txt", 'UTF-8');
            expect(fileData).to.equal("\n");
        });

        it('file delete not existing', (done) => {
            fs.writeFileSync("password.txt", "urmia:{SHA}NSjjR5VzkksaQNgdEKs0MqPtStI=\n", 'UTF-8');
            const program = {'delete': true, 'args': ["password.txt", "sonya"]};

            const preservedLog = console.log;
            console.error = function () {
                console.error = preservedLog;
                console.error.apply(console, arguments);

                expect(arguments[0]).to.equal("User sonya not found.");
                done();
            };

            // Source.
            processor.exec(program);
        });

        it('file add', () => {
            const initData = "mihrdat:{SHA}NSjjR5VzkksaQNgdEKs0MqPtStI=\n";
            fs.writeFileSync("password.txt", initData, 'UTF-8');

            const program = {
                'sha': true, 'batch': true,
                'args': ["password.txt", "tigran", "thegreat"]
            };

            // Source.
            processor.exec(program);

            const fileData = fs.readFileSync("password.txt", 'UTF-8');
            expect(fileData).to.equal(`${initData}tigran:{SHA}1cYTTawbHcKifj2Yn6MC8bDq7Dc=\n`);
        });

        it('file add, not existing', (done) => {
            const program = {
                'batch': true,
                'args': ["password.txt", "tigran", "thegreat"]
            };

            const preservedLog = console.log;
            console.error = function () {
                console.error = preservedLog;
                console.error.apply(console, arguments);

                expect(arguments[0]).to.equal("Cannot modify file password.txt; use '-c' to create it.");
                done();
            };

            // Source.
            processor.exec(program);
        });

        it('help', (done) => {
            const program = {'args': ["klara"], 'help': function() {
                done();
            }};

            // Source.
            processor.exec(program);
        });
    });

    // Tests for validate.
    describe('#validate', () => {
        it('username', () => {
            // Source.
            const valid = processor.validate({'nofile': true, 'args': ["natalya"]});

            // Expectation.
            expect(valid).to.be.true;
        });

        it('username, password', () => {
            // Source.
            const valid = processor.validate({'nofile': true, 'batch': true, 'args': ["kiara", "superPass"]});

            // Expectation.
            expect(valid).to.be.true;
        });

        it('username, password, file', () => {
            // Source.
            const valid = processor.validate({'batch': true, 'args': ["pass.txt", "anna", "userPass"]});

            // Expectation.
            expect(valid).to.be.true;
        });

        it('missing password', () => {
            // Source.
            const valid = processor.validate({'batch': true, 'args': ["super.txt", "rita"]});

            // Expectation.
            expect(valid).to.be.false;
        });

        it('missing file', () => {
            // Source.
            const valid = processor.validate({'args': ["rita"]});

            // Expectation.
            expect(valid).to.be.false;
        });
    });
});
