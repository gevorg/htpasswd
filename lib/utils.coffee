# Importing crypto module.
crypto = require "crypto"

#  Module for utility functionalities.
module.exports =
  # Prints usage of tool.
  usage: () -> 
    console.log """
    Usage:
            htpasswd [-cpD] passwordfile username
            htpasswd -b[cpD] passwordfile username password

            htpasswd -n[p] username
            htpasswd -nb[p] username password
     -c  Create a new file.
     -n  Don't update file; display results on stdout.
     -p  Do not encrypt the password (plaintext).
     -b  Use the password from the command line rather than prompting for it.
     -D  Delete the specified user."""
  # Generates sha1 hash of password.
  sha1: (password) ->
    hash = crypto.createHash 'sha1'
    hash.update password
    hash.digest 'base64'