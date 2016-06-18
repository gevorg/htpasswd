"use strict";

// Expect module.
import {expect} from 'chai'

// Source.
import * as utils from '../src/utils'

// Importing apache-md5 module.
import md5 from 'apache-md5'

// Importing apache-crypt module.
import crypt from 'apache-crypt'

// Utils
describe('utils', function () {
    // Tests for sha1.
    describe('#sha1', function () {
        it('hash should be correct', function () {
            // Source.
            const hash = utils.sha1("devochka");

            // Expectation.
            expect(hash).equal("deWaCTR7rOMysgZN3EgtgAaTzPs=");
        });
    });

    // Tests for encode.
    describe('#encode', function () {
        it('delete option', function () {
            // Source.
            const encoded = utils.encode({'delete': true});

            // Expectation.
            expect(encoded).to.be.undefined;
        });

        it('plain option', function () {
            // Source.
            const encoded = utils.encode({'plaintext': true, 'args': ["olga", "chexova111"]});

            // Expectation.
            expect(encoded).to.equal("chexova111");
        });

        it('sha1 option', function () {
            // Source.
            const encoded = utils.encode({'sha': true, 'args': ["olga", "chexova111"]});

            // Expectation.
            expect(encoded).to.equal("{SHA}Iv8c5zqtbvxiwFTxcEI6CteSx48=");
        });

        it('crypt option', function () {
            // Source.
            const encoded = utils.encode({'crypt': true, 'args': ["olga", "chexova111"]});

            // Expectation.
            expect(encoded).to.equal(crypt("chexova111", encoded));
        });

        it('md5 option', function () {
            // Source.
            const encoded = utils.encode({'args': ["kia", "siara"]});

            // Expectation.
            expect(encoded).to.equal(md5("siara", encoded));
        });
    });

    // Tests for verify.
    describe('#verify', function () {
        it('correct plain pass', function () {
            // Source.
            const result = utils.verify("plainPassword", "plainPassword");

            // Expectation.
            expect(result).to.be.true;
        });

        it('wrong plain pass', function () {
            // Source.
            const result = utils.verify("plainWrongPassword", "plainPassword");

            // Expectation.
            expect(result).to.be.false;
        });

        it('correct sha1 pass', function () {
            // Source.
            const result = utils.verify("{SHA}hGJRiZy8gBpNMHvs1UOTqIrRU20=", "hanna");

            // Expectation.
            expect(result).to.be.true;
        });

        it('wrong sha1 pass', function () {
            // Source.
            const result = utils.verify("{SHA}hGJRiZy8gBpNMHvs1UOTqIrRU20=", "bannana");

            // Expectation.
            expect(result).to.be.false;
        });

        it('correct crypt pass', function () {
            // Source.
            const result = utils.verify("hVmhA.naUQQ3I", "raya");

            // Expectation.
            expect(result).to.be.true;
        });

        it('wrong crypt pass', function () {
            // Source.
            const result = utils.verify("hVmhA.naUQQ3I", "serob");

            // Expectation.
            expect(result).to.be.false;
        });

        it('correct MD5 pass', function () {
            // Source.
            const result = utils.verify("$apr1$Ny3hkBdz$UReNPq7yEH6Y/D/FXUPwI/", "mia");

            // Expectation.
            expect(result).to.be.true;
        });

        it('wrong MD5 pass', function () {
            // Source.
            const result = utils.verify("$apr1$Ny3hkBdz$UReNPq7yEH6Y/D/FXUPwI/", "leo");

            // Expectation.
            expect(result).to.be.false;
        });

        it('correct short MD5 pass', function () {
            // Source.
            const result = utils.verify("$1$Ny3hkBdz$BpVVFK6YBnrFYJtmeyrrH0", "mia");

            // Expectation.
            expect(result).to.be.true;
        });

        it('wrong short MD5 pass', function () {
            // Source.
            const result = utils.verify("$1$Ny3hkBdz$UReNPq7yEH6Y/D/FXUPwI/", "leo");

            // Expectation.
            expect(result).to.be.false;
        });
    });
});