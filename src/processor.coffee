# Need utility module.
utils = require './utils'

# FS module.
fs = require 'fs'

# Prompt module.
prompt = require 'prompt'

## Module for processing command.
module.exports =

  # Validates input arguments.
  validate: (program) ->
    # Only username is required.
    expectedArgs = 1
    
    ++ expectedArgs if program.batch
    ++ expectedArgs if not program.nofile
    
    # Validating argument count.
    expectedArgs is program.args.length     
 
  # Read password.
  readPassword: (program) ->
    # Prepare prompt.
    prompt.message = ""
    prompt.delimiter = ""
    
    # Prepare options.
    options = [
      {name: 'password', description: 'New password:', hidden: true}, 
      {name: 'rePassword', description: 'Re-type new password:', hidden: true}
    ]
    
    # Try to read password.
    prompt.get options, (err, result) ->
      if not err and result.password is result.rePassword
        program.args.push result.password
        console.log module.exports.finalize program
      else
        console.error "\nPassword verification error."

  # Read password from stdin.
  readPasswordStdIn: (program) ->
    password = ""

    # Reading pass.
    process.stdin.on 'data', (chunk) ->
      password += chunk

    # Finished reading.
    process.stdin.on 'end', () ->
      program.args.push password
      try
        console.log module.exports.syncFile program
      catch error
        console.error error.message

# Processing command.
  process: (program) ->
    if module.exports.validate program
      if program.stdin
        module.exports.readPasswordStdIn program
      else if not program.batch and not program.delete
        module.exports.readPassword program
      else
        module.exports.finalize program
    else 
      program.help()
      
  # Finalizes processing by printing output or changing password file. 
  finalize: (program) ->
    if program.nofile
      username = program.args[0]
      hash = utils.encode program
      # Print to stdout.
      console.log "#{username}:#{hash}"
    else
      try
        console.log module.exports.syncFile program
      catch error
        console.error error.message
        
  # Sync file with new data.
  syncFile: (program) ->
    if not program.args
      program.args = []
    if program.passwordFile
      program.args[0] = program.passwordFile
    if program.username
      program.args[1] = program.username
    if program.password
      program.args[2] = program.password
    passwordFile = program.args[0]
    username = program.args[1]
    password = program.args[2]
    hash = utils.encode program

    found = false
    newLines = []

    if not program.create
      if not program.raw
        if not fs.existsSync passwordFile
          throw new Error "Cannot modify file #{passwordFile}; use '-c' to create it."
          
        lines = (fs.readFileSync passwordFile, 'UTF-8')
      else
        lines = program.raw

      lines = lines.split "\n"
      
      for line, i in lines
        if (line.indexOf "#{username}:") is 0
          found = true

          if program.verify
            # For verification we need existing data.
            [username, hash] = line.split ":"

            if (utils.verify hash, password)
              status = "Password for user #{username} correct."
            else
              status = "Password verification failed."
          else if program.delete # Deletion case.
            status = "Deleting password for user #{username}."
          else # Updating password.      
            newLines.push "#{username}:#{hash}"
            status = "Updating password for user #{username}."
        else if line # Remove empty lines.
          newLines.push line

    if not program.verify
      if not found # Adding user to existing file.
        if program.delete
          throw new Error "User #{username} not found."
        else
          newLines.push "#{username}:#{hash}"
          status = "Adding password for user #{username}."

      # Write data.
      fs.writeFileSync passwordFile, (newLines.join "\n") + "\n", 'UTF-8'

    return status;