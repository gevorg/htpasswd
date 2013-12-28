# Importing crypto module.
crypto = require 'crypto'

# Importing apache-crypt module.
crypt3 = require 'apache-crypt'

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
      hash is module.exports.sha1 password
    else
      (hash is password) or ((crypt3 password, hash) is hash)

  # Encodes password hash for output.
  encode: (program) ->
    if not program.delete
      # Get username and password.
      password = program.args[program.args.length - 1]
      # Encode.
      if not program.plaintext
        if program.crypt
          password = crypt3 password
        else
          password = '{SHA}' + module.exports.sha1 password
      # Return result.
      password