'use strict';

// Importing modules.
import program from 'commander'
import * as processor from './processor'

// Parses and processes command line arguments.
export default function(version, args) {
  // Setup.
  program
      .version(version)
      .usage("[options] [passwordfile] username [password]")
      .option('-b, --batch', "Use the password from the command line rather than prompting for it. This option should be used with extreme care, since the password is clearly visible on the command line. For script use see the -i option.")
      .option('-i, --stdin', "Read the password from stdin without verification (for script usage).")
      .option('-c, --create', "Create a new file.")
      .option('-n, --nofile', "Don't update file; display results on stdout.")
      .option('-m, --md5', "Use MD5 encryption for passwords. This is the default.")
      .option('-d, --crypt', "Use crypt() encryption for passwords. This algorithm limits the password length to 8 characters. This algorithm is insecure by today's standards.")
      .option('-s, --sha', "Use SHA encryption for passwords. This algorithm is insecure by today's standards.")
      .option('-p, --plaintext', "Do not encrypt the password (plaintext).")
      .option('-D, --delete', "Delete the specified user.")
      .option('-v, --verify', "Verify password. Verify that the given password matches the password of the user stored in the specified htpasswd file.");
  
  // Help option.
  program.on('--help', function () {
    console.log(` 
        Examples: 
          
          htpasswd [-cimpsDv] passwordfile username
          htpasswd -b[cmpsDv] passwordfile username password
      
          htpasswd -n[imps] username
          htpasswd -nb[mps] username password            

        `);
  });

  // Parse options.
  program.parse(args);

  // Process program output.
  processor.exec(program);
}