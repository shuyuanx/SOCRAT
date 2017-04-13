'use strict'
# import base messaging module class
BaseModuleMessageService = require 'scripts/BaseClasses/BaseModuleMessageService.coffee'
# export custom messaging service class
module.exports = class MyModuleMsgService extends BaseModuleMessageService
  # required to define module message list
  msgList:
    outgoing: []
    
console.log("HERE REACHED TO PROVE IT RUNS");
    incoming: []
    # required to be the same as module id
    scope: ['socrat_analysis_mymodule']

