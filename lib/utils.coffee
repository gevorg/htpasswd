# Importing crypto module.
crypto = require 'crypto'

# Importing crypt3 module.
crypt3 = require 'crypt3'

#  Module for utility functionalities.
module.exports =

  # Generates sha1 hash of password.
  sha1: (password) ->
    hash = crypto.createHash 'sha1'
    hash.update password
    hash.digest 'base64'

  # Verifies if password is correct.
  verify: (hash, password) ->
    if (hash.substr 0, 5) is '{SHA}'
      hash = hash.substr 5
      password = module.exports.sha1 password
    (hash is password) or ((crypt3 password, hash) is hash)

  # Encodes password hash for output.
  encode: (program) ->
    if not program.delete
      # Get username and password.
      password = program.args[program.args.length - 1]
      # Encode.
      if not program.plaintext
        if program.crypt
          password = crypt3 password, (crypt3.createSalt().substr 3, 2)
        else
          password = '{SHA}' + module.exports.sha1 password
      # Return result.
      password