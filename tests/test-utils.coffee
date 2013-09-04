# Importing module.
utils = require '../lib/utils'

module.exports =

  # Test for SHA1 function.
  testSHA1: (test) ->
    test.equal (utils.sha1 "devochka"), "deWaCTR7rOMysgZN3EgtgAaTzPs=", "SHA1 is wrong!"
    test.done()
    
  # Test for encode with delete option. 
  testEncodeDelete: (test) ->
    test.ok (not utils.encode {'delete': true}), "Should be empty!"
    test.done()
    
  # Test for encode with plain option.  
  testEncodePlain: (test) ->
    encoded = utils.encode {'plaintext': true, 'args': ["olga", "chexova111"]}
    test.equal encoded, "olga:chexova111", "Should be plaintext!"
    test.done()

  # Test for encode with sha1 option.
  testEncodeSHA1: (test) ->
    encoded = utils.encode {'args': ["olga", "chexova111"]}
    test.equal encoded, "olga:{SHA}Iv8c5zqtbvxiwFTxcEI6CteSx48=", "Should be sha1!"
    test.done()