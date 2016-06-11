"use strict";

// Importing crypto module.
import crypto from 'crypto'

// Importing apache-md5 module.
import md5 from 'apache-md5'

// Importing apache-crypt module.
import crypt from 'apache-crypt'

// Generates sha1 hash of password.
export function sha1(password) {
    let hash = crypto.createHash('sha1');
    hash.update(password);

    return hash.digest('base64');
}

// Verifies if password is correct.
export function verify(hash, password) {
    if (hash.substr(0, 5) === '{SHA}') {
        hash = hash.substr(5);
        return sha1(password) === hash;
    } else if (hash.substr(0, 6) === '$apr1$' || hash.substr(0, 3) === '$1$') {
        return md5(password, hash) === hash;
    } else {
        return hash === password || crypt(password, hash) === hash;
    }
}

// Encodes password hash for output.
export function encode(program) {
    if (!program.delete) {
        // Get username and password.
        let password = program.args[program.args.length - 1];

        // Encode.
        if (!program.plaintext) {
            if (program.crypt) {
                password = crypt(password);
            } else if (program.sha) {
                password = '{SHA}' + sha1(password);
            } else {
                password = md5(password);
            }
        }

        // Return it.
        return password;
    }
}