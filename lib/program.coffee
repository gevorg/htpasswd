# Importing package.json for version info.
settings = require '../package.json'

# Importing commander module.
program = require 'commander'

# Setting up program.
program
  .version(settings.version)
  .usage("[options] [passwordfile] username [password]")
  .option('-c, --create', "Create a new file.")
  .option('-n, --nofile', "Don't update file; display results on stdout.")
  .option('-p, --plaintext', "Do not encrypt the password (plaintext).")
  .option('-b, --batch', "Use the password from the command line rather than prompting for it.")
  .option('-D, --delete', "Delete the specified user.")

# Custom help.
program.on '--help', () ->
  console.log """
    Examples: 
      
      htpasswd [-cpD] passwordfile username
      htpasswd -b[cpD] passwordfile username password
  
      htpasswd -n[p] username
      htpasswd -nb[p] username password
        
    """

# Exporting program.
module.exports = program