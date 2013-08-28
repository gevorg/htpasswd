# Importing crypto module.
crypto = require 'crypto'

#  Module for utility functionalities.
module.exports =

  # Generates sha1 hash of password.
  sha1: (password) ->
    hash = crypto.createHash 'sha1'
    hash.update password
    hash.digest 'base64'
  
  # Encodes username and password for output.
  encode: (program) ->
    if not program.delete
      # Get username and password.
      username = program.args[program.args.length - 2]
      password = program.args[program.args.length - 1]
      # Encode.
      if not program.plaintext
        password = '{SHA}' + module.exports.sha1 password        
      # Return result.
      username + ':' + password
      
  # Validates password based on hash.
  validate: (hash, password) ->
    if (hash.substr 0,5) is '{SHA}'
      hash = hash.substr 5
      password = module.exports.sha1 password      
    hash is password
