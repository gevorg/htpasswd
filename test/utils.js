"use strict";

// Expect module.
const expect = require('chai').expect;

// Source.
const utils = require('../src/utils');

// Importing apache-md5 module.
const md5 = require('apache-md5');

// Importing apache-crypt module.
const crypt = require('apache-crypt');

// Utils
describe('utils', () => {
    // Tests for sha1.
    describe('#sha1', () => {
        it('hash should be correct', () => {
            // Source.
            const hash = utils.sha1("devochka");

            // Expectation.
            expect(hash).equal("deWaCTR7rOMysgZN3EgtgAaTzPs=");
        });
    });

    // Tests for encode.
    describe('#encode', () => {
        it('delete option', () => {
            // Source.
            const encoded = utils.encode({'delete': true});

            // Expectation.
            expect(encoded).to.be.undefined;
        });

        it('plain option', () => {
            // Source.
            const encoded = utils.encode({'plaintext': true, 'args': ["olga", "chexova111"]});

            // Expectation.
            expect(encoded).to.equal("chexova111");
        });

        it('sha1 option', () => {
            // Source.
            const encoded = utils.encode({'sha': true, 'args': ["olga", "chexova111"]});

            // Expectation.
            expect(encoded).to.equal("{SHA}Iv8c5zqtbvxiwFTxcEI6CteSx48=");
        });

        it('crypt option', () => {
            // Source.
            const encoded = utils.encode({'crypt': true, 'args': ["olga", "chexova111"]});

            // Expectation.
            expect(encoded).to.equal(crypt("chexova111", encoded));
        });

        it('md5 option', () => {
            // Source.
            const encoded = utils.encode({'args': ["kia", "siara"]});

            // Expectation.
            expect(encoded).to.equal(md5("siara", encoded));
        });
    });

    // Tests for verify.
    describe('#verify', () => {
        it('correct plain pass', function () {
            // Source.
            const result = utils.verify("plainPassword", "plainPassword");

            // Expectation.
            expect(result).to.be.true;
        });

        it('wrong plain pass', () => {
            // Source.
            const result = utils.verify("plainWrongPassword", "plainPassword");

            // Expectation.
            expect(result).to.be.false;
        });

        it('correct sha1 pass', () => {
            // Source.
            const result = utils.verify("{SHA}hGJRiZy8gBpNMHvs1UOTqIrRU20=", "hanna");

            // Expectation.
            expect(result).to.be.true;
        });

        it('wrong sha1 pass', () => {
            // Source.
            const result = utils.verify("{SHA}hGJRiZy8gBpNMHvs1UOTqIrRU20=", "bannana");

            // Expectation.
            expect(result).to.be.false;
        });

        it('correct crypt pass', () => {
            // Source.
            const result = utils.verify("hVmhA.naUQQ3I", "raya");

            // Expectation.
            expect(result).to.be.true;
        });

        it('wrong crypt pass', () => {
            // Source.
            const result = utils.verify("hVmhA.naUQQ3I", "serob");

            // Expectation.
            expect(result).to.be.false;
        });

        it('correct MD5 pass', () => {
            // Source.
            const result = utils.verify("$apr1$Ny3hkBdz$UReNPq7yEH6Y/D/FXUPwI/", "mia");

            // Expectation.
            expect(result).to.be.true;
        });

        it('wrong MD5 pass', () => {
            // Source.
            const result = utils.verify("$apr1$Ny3hkBdz$UReNPq7yEH6Y/D/FXUPwI/", "leo");

            // Expectation.
            expect(result).to.be.false;
        });

        it('correct short MD5 pass', () => {
            // Source.
            const result = utils.verify("$1$Ny3hkBdz$BpVVFK6YBnrFYJtmeyrrH0", "mia");

            // Expectation.
            expect(result).to.be.true;
        });

        it('wrong short MD5 pass', () => {
            // Source.
            const result = utils.verify("$1$Ny3hkBdz$UReNPq7yEH6Y/D/FXUPwI/", "leo");

            // Expectation.
            expect(result).to.be.false;
        });

        it('correct bcrypt pass', () => {
            // Source.
            const result = utils.verify("$2y$05$c4WoMPo3SXsafkva.HHa6uXQZWr7oboPiC2bT/r7q1BB8I2s0BRqC", "myPassword");

            // Expectation.
            expect(result).to.be.true;
        });

        it('correct old bcrypt pass', () => {
            // Source.
            const result = utils.verify("$2a$05$c4WoMPo3SXsafkva.HHa6uXQZWr7oboPiC2bT/r7q1BB8I2s0BRqC", "myPassword");

            // Expectation.
            expect(result).to.be.true;
        });

        it('wrong bcrypt pass', () => {
            // Source.
            const result = utils.verify("$2a$05$c4WoMPo3SXsafkva.HHa6uXQZWr7oboPiC2bT/r7q1BB8I2s0BRqC", "notMyPassword");

            // Expectation.
            expect(result).to.be.false;
        });
    });
});