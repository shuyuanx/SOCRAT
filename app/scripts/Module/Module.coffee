'use strict'

###
# @name Module
# @desc Base class for SOCRAT module prototyping
###
module.exports = class Module
  constructor: (options) ->
    console.log 'MODULE CONSTRUCTOR'
    {@id = null, @components = defaultComponents, @state = defaultState} = options

  defaultComponents =
    services:
      initService: null
      messageService: null
    factories: []
    controllers: []
    directives: []

  defaultState =
    id: null
    url: null
    views:
      main:
        template: null
      sidebar:
        template: null

