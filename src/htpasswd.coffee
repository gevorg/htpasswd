utils = require './utils'

# Exporting execution part.
module.exports = () ->
  # Parses and processes command line arguments.
  program = require './program'
  processor = require './processor'
  program.parse process.argv

# Exporting verify method.
module.exports.verify = require('./utils').verify