'use strict'

module.exports = class AppMessageMap
  constructor: () ->
    @_msgMap = [

      msgFrom: 'saveData'
      scopeFrom: ['app_analysis_getData', 'app_analysis_dataWrangler']
      msgTo: 'save table'
      scopeTo: ['app_analysis_database']
    ,
      msgFrom: 'infer data types'
      scopeFrom: [
        'app_analysis_getData',
        'app_analysis_dataWrangler',
        'app_analysis_cluster',
        'app_analysis_charts',
        'app_analysis_reliability'
      ]
      msgTo: 'infer all types'
      scopeTo: ['app_analysis_datalib']
    ,
      msgFrom: 'all types inferred'
      scopeFrom: ['app_analysis_datalib']
      msgTo: 'data types inferred'
      scopeTo: [
        'app_analysis_getData',
        'app_analysis_dataWrangler',
        'app_analysis_cluster',
        'app_analysis_charts',
        'app_analysis_reliability'
      ]
    ,
      msgFrom: 'data summary'
      scopeFrom: [
        'app_analysis_getData',
        'app_analysis_dataWrangler',
        'app_analysis_cluster',
        'app_analysis_charts',
        'app_analysis_reliability'
      ]
      msgTo: 'summary'
      scopeTo: ['app_analysis_datalib']
    ,
      msgFrom: 'summary_res'
      scopeFrom: ['app_analysis_datalib']
      msgTo: 'data summary result'
      scopeTo: [
        'app_analysis_getData',
        'app_analysis_dataWrangler',
        'app_analysis_cluster',
        'app_analysis_charts',
        'app_analysis_reliability'
      ]
    #    ,
    #      msgFrom: 'upload csv'
    #      scopeFrom: ['getData']
    #      msgTo: 'upload csv'
    #      scopeTo: ['app.utils.importer']
#    ,
    # TODO: make message mapping dynamic #SOCRFW-151
#      msgFrom: 'get table'
#      scopeFrom: ['instrPerfEval']
#      msgTo: 'get table'
#      scopeTo: ['app_analysis_database']
#    ,
#      msgFrom: 'take table'
#      scopeFrom: ['app_analysis_database']
#      msgTo: 'take table'
#      scopeTo: ['instrPerfEval']
    ,
      msgFrom: 'getData'
      scopeFrom: ['app_analysis_cluster',
        'app_analysis_getData',
        'app_analysis_dataWrangler',
        'app_analysis_charts',
        'app_analysis_reliability'
      ]
      msgTo: 'get table'
      scopeTo: ['app_analysis_database']
    ,
      msgFrom: 'take table'
      scopeFrom: ['app_analysis_database']
      msgTo: 'takeTable'
      scopeTo: ['app_analysis_cluster',
        'app_analysis_getData',
        'app_analysis_dataWrangler',
        'app_analysis_charts',
        'app_analysis_reliability'
      ]
    ]

  getMap: ->
    @_msgMap
