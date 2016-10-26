"use strict";

// Expect module.
const expect = require('chai').expect;

// FS.
const fs = require("fs");

// Utils
describe('newline', () => {
    // Tests for sha1.
    describe('#check', () => {
        it('line endings should be linux style', (done) => {
            fs.readFile(__dirname + './../bin/htpasswd', (err, data) => {
                expect(-1 === data.toString().indexOf('\n\r')).to.true;
                done();
            });
        });
    });
});