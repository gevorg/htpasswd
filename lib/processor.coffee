# Need utility module.
utils = require './utils'

# FS module.
fs = require 'fs'

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
 
  # Processing command.
  process: (program) ->
    if module.exports.validate program
      if not program.batch and not program.delete
        # Try to read password.
        program.password 'New password: ', (password1) ->
          program.password 'Re-type new password: ', (password2) ->
            if password1 is password2
              program.args.push password2
              module.exports.finalize program
            else
              console.error "Password verification error."
            process.stdin.destroy()
      else
        module.exports.finalize program
    else 
      program.help()
      
  # Finalizes processing by printing output or changing password file. 
  finalize: (program) ->
    if program.nofile
      console.log utils.encode program
    else       
      try
        module.exports.syncFile program
      catch error
        console.error error.message
        
  # Sync file with new data.
  syncFile: (program) ->
    passwordFile = program.args[0]
    username = program.args[1]
    writeData = utils.encode program

    found = false
    newLines = []

    if not program.create
      if not fs.existsSync passwordFile
        console.error "Cannot modify file #{passwordFile}; use '-c' to create it."
        return
        
      lines = (fs.readFileSync passwordFile, 'UTF-8').split "\n"
      
      for line, i in lines
        if (line.indexOf "#{username}:") is 0
          found = true
          
          if program.delete # Deletion case.
            console.log "Deleting password for user #{username}."
          else # Updating password.      
            newLines.push writeData
            console.log "Updating password for user #{username}."
        else if line # Remove empty lines.
          newLines.push line
            
    if not found # Adding user to existing file.
      if program.delete
        console.error "User #{username} not found."
      else 
        newLines.push writeData
        console.log "Adding password for user #{username}."
    
    # Write data.
    fs.writeFileSync passwordFile, (newLines.join "\n") + "\n", 'UTF-8'