import request from './request'
import requestUrl from './url'

export default {
  cv: {
    seg(data) {
      return request({
        pageName: 'Video Segmetation',
        apiName: 'video_seg',
        url: requestUrl.cv.seg,
        method: 'post',
        data: data,
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        // headers: {'Content-Type': 'application/json'},
        transformRequest: [
          function(data) {
            let myForm = new FormData()
            for (let key in data) {
              myForm.append(key, data[key])
            }
            return myForm
          }
          // function(data) {
          //     data = JSON.stringify(data)
          //     return data
          // }
        ]
      })
    },
    cover(data) {
      return request({
        pageName: 'Video Cover',
        apiName: 'video_cover',
        url: requestUrl.cv.cover,
        method: 'post',
        data: data,
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        transformRequest: [function(data) {
          let myForm = new FormData()
          for (let key in data) {
            myForm.append(key, data[key])
          }
          return myForm
        }]
      })
    },
    tag(data) {
      return request({
        pageName: 'Video Tagging',
        apiName: 'video_tagging',
        url: requestUrl.cv.tag,
        method: 'post',
        data: data,
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        transformRequest: [function(data) {
          let myForm = new FormData()
          for (let key in data) {
            myForm.append(key, data[key])
          }
          return myForm
        }]
      })
    },
    assistants(data) {
      return request({
        pageName: 'Assistant',
        apiName: 'assistants',
        url: requestUrl.cv.assistants,
        method: 'post',
        data: data
      })
    },
    assistantsLikeStauts(data) {
      return request({
        pageName: 'Assistant',
        apiName: requestUrl.cv.assistantsLikeStauts.split('/').pop(),
        url: requestUrl.cv.assistantsLikeStauts,
        method: 'post',
        data: data
      })
    },
    assistantsLike(data) {
      return request({
        pageName: 'Assistant',
        apiName: requestUrl.cv.assistantsLike.split('/').pop(),
        url: requestUrl.cv.assistantsLike,
        method: 'post',
        data: data
      })
    },
    assistantsDislike(data) {
      return request({
        pageName: 'Assistant',
        apiName: requestUrl.cv.assistantsDislike.split('/').pop(),
        url: requestUrl.cv.assistantsDislike,
        method: 'post',
        data: data
      })
    },
    nikkeTableauTrust(data) {
      return request({
        pageName: 'Tagging Insights (NIKKE)',
        apiName: 'trusted',
        url: requestUrl.cv.nikkeTableauTrust,
        method: 'post',
        data: data,
        headers:
            {'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'},
        transformRequest: [function(data) {
          let myForm = new FormData()
          for (let key in data) {
            myForm.append(key, data[key])
          }
          return myForm
        }]
      })
    },
    assistantTableauTrust(data) {
      return request({
        pageName: 'Creative Assistant (NIKKE)',
        apiName: 'trusted',
        url: requestUrl.cv.assistantTableauTrust,
        method: 'post',
        data: data,
        headers:
            {'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'},
        transformRequest: [function(data) {
          let myForm = new FormData()
          for (let key in data) {
            myForm.append(key, data[key])
          }
          return myForm
        }]
      })
    }
  },
  permission: {
    addUser(data) {
      return request({
        pageName: 'Permission',
        apiName: 'add_user',
        url: requestUrl.permission.add,
        method: 'post',
        data: data
      })
    },
    searchUser(data) {
      return request({
        pageName: 'Permission',
        apiName: 'search_user',
        url: requestUrl.permission.search,
        method: 'post',
        data: data
      })
    },
    updateUser(data) {
      return request({
        pageName: 'Permission',
        apiName: 'update_user',
        url: requestUrl.permission.update,
        method: 'post',
        data: data
      })
    },
    delUser(data) {
      return request({
        pageName: 'Permission',
        apiName: 'del_user',
        url: requestUrl.permission.del,
        method: 'post',
        data: data
      })
    },
    operation(data) {
      return request({
        pageName: 'Operation Data',
        apiName: 'get_portal_report',
        url: requestUrl.permission.operation,
        method: 'post',
        data: data
      })
    },
    operationData(data) {
      return request({
        pageName: 'Operation Data',
        apiName: 'operate_data',
        url: requestUrl.permission.operateData,
        method: 'post',
        data: data
      })
    }
  },
  nlp: {
    intelSearch(data) {
      return request({
        pageName: 'Intelligent Search',
        apiName: 'query',
        url: requestUrl.nlp.intelSearch,
        method: 'get',
        data: data
      })
    },
    autoSearch(data) {
      return request({
        pageName: 'Common Search',
        apiName: 'autocomplete',
        url: requestUrl.nlp.autoSearch,
        method: 'get',
        data: data
      })
    },
    // searchToken(data) {
    //   return request({
    //     url: requestUrl.nlp.searchToken,
    //     method: 'post',
    //     data: data
    //   })
    // },
    search(data) {
      return request({
        pageName: 'Common Search',
        apiName: 'search',
        url: requestUrl.nlp.search,
        // headers: headers,
        method: 'post',
        data: data
      })
    },
    langDetection(data) {
      return request({
        pageName: 'Language Recognition',
        apiName: 'opinion_language_detection',
        url: requestUrl.nlp.langDetection,
        method: 'post',
        data: data
      })
    },
    ner(data) {
      const lang = data.language
      if (lang === 'cn') {
        return request({
          pageName: 'NER',
          apiName: 'ner',
          url: requestUrl.nlp.ner.zh,
          method: 'get',
          data: data
        })
      }
      else if (lang === 'en') {
        return request({
          pageName: 'NER',
          apiName: 'ner',
          url: requestUrl.nlp.ner.en,
          method: 'get',
          data: data
        })
      }
      else {
        return request({
          pageName: 'NER',
          apiName: 'ner',
          url: requestUrl.nlp.ner.mul,
          method: 'get',
          data: data
        })
      }
    },
    gameTitle(data) {
      return request({
        pageName: 'Game News Headlines Judge',
        apiName: 'news',
        url: requestUrl.nlp.gameTitle,
        method: 'get',
        data: data
      })
    },
    multilingual(data) {
      return request({
        pageName: 'Multilingual Sentence Representation',
        apiName: '',
        url: requestUrl.nlp.multilingual,
        method: 'get',
        data: data
      })
    },
    security(data) {
      return request({
        pageName: 'Security',
        apiName: 'content_security',
        url: requestUrl.nlp.security,
        method: 'get',
        data: data
      })
    },
    hack(data) {
      return request({
        pageName: 'Hack',
        apiName: 'hack',
        url: requestUrl.nlp.hack,
        method: 'get',
        data: data
      })
    },
    sentiment(data) {
      return request({
        pageName: 'Sentiment Analysis',
        apiName: 'sentiment_analysis',
        url: requestUrl.nlp.sentiment,
        method: 'post',
        data: data
      })
    },
    topic(data) {
      return request({
        pageName: 'Public Opinion Topic Identification',
        apiName: 'opinion_labels_demo_api',
        url: requestUrl.nlp.topic,
        method: 'post',
        data: data,
        timeout: 3 * 60 * 1000
      })
    },
    summary(data) {
      return request({
        url: requestUrl.nlp.summary,
        method: 'get',
        data: data,
        // 保留get的data放在body里面
        originalData: true
      })
    },
    reviewProcess(data) {
      return request({
        pageName: 'Aspect Based Sentiment Analysis',
        apiName: 'review_process',
        url: requestUrl.nlp.reviewProcess,
        method: 'post',
        data: data
      })
    },
    aspectScore(data) {
      return request({
        pageName: 'Read Reviews That Mention',
        apiName: 'aspect_score',
        url: requestUrl.nlp.aspectScore,
        method: 'post',
        data: data
      })
    },
    opinionExpression(data) {
      return request({
        pageName: 'Read Reviews That Mention',
        apiName: 'opinion_expression_list',
        url: requestUrl.nlp.opinionExpression,
        method: 'post',
        data: data
      })
    },
    contentDetail(data) {
      return request({
        pageName: 'Read Reviews That Mention',
        apiName: 'content_detail',
        url: requestUrl.nlp.contentDetail,
        method: 'post',
        data: data
      })
    },
    // 文字提取
    textExtract(data) {
      return request({
        pageName: 'Text Extract',
        apiName: 'predict',
        url: requestUrl.nlp.textExtract,
        method: 'post',
        data: data
      })
    },
    // 评论有效性
    commentEffective(data) {
      return request({
        pageName: 'Comment Effectiveness Analysis',
        apiName: 'predict',
        url: requestUrl.nlp.commentEffective,
        method: 'post',
        data: data
      })
    },
    // 评论有效性
    commentValid(data) {
      return request({
        pageName: 'Comment Valid Analysis',
        apiName: 'predict',
        url: requestUrl.nlp.commentValid,
        method: 'post',
        data: data
      })
    },
    // 评论有效性
    keywordsCluster(data) {
      return request({
        pageName: 'Keywords Cluster',
        apiName: 'predict',
        url: requestUrl.nlp.keywordsCluster,
        method: 'post',
        data: data
      })
    },
    // summary
    summaryText(data) {
      return request({
        pageName: 'Text Summarization',
        apiName: 'summary_sentence_details',
        url: requestUrl.nlp.summaryText,
        method: 'post',
        data: data
      })
    },
    summaryModify(data) {
      return request({
        pageName: 'Text Summarization',
        apiName: 'summary_modify_sentence',
        url: requestUrl.nlp.summaryModify,
        method: 'post',
        data: data
      })
    },
    summaryComments(data) {
      return request({
        pageName: 'Text Summarization',
        apiName: 'summary_sentence_comments',
        url: requestUrl.nlp.summaryComments,
        method: 'post',
        data: data
      })
    },
    summaryDel(data) {
      return request({
        pageName: 'Text Summarization',
        apiName: requestUrl.nlp.summaryDel.split('/').pop(),
        url: requestUrl.nlp.summaryDel,
        method: 'post',
        data: data
      })
    },
    summaryRecover(data) {
      return request({
        pageName: 'Text Summarization',
        apiName: requestUrl.nlp.summaryRecover.split('/').pop(),
        url: requestUrl.nlp.summaryRecover,
        method: 'post',
        data: data
      })
    },
    summaryParams(data) {
      return request({
        pageName: 'Text Summarization',
        apiName: requestUrl.nlp.summaryParams.split('/').pop(),
        url: requestUrl.nlp.summaryParams,
        method: 'get',
        data: data
      })
    },
    summaryHistory(data) {
      return request({
        pageName: 'Text Summarization',
        apiName: requestUrl.nlp.summaryHistory.split('/').pop,
        url: requestUrl.nlp.summaryHistory,
        method: 'get',
        data: data
      })
    },
    associatedFirstWords(data) {
      return request({
        pageName: 'Associated Keywords',
        apiName: requestUrl.nlp.associatedFirstWords.split('/').pop(),
        url: requestUrl.nlp.associatedFirstWords,
        method: 'post',
        data: data
      })
    },
    associatedFirstComments(data) {
      return request({
        pageName: 'Associated Keywords',
        apiName: requestUrl.nlp.associatedFirstComments.split('/').pop(),
        url: requestUrl.nlp.associatedFirstComments,
        method: 'post',
        data: data
      })
    },
    associatedSecondWords(data) {
      return request({
        pageName: 'Associated Keywords',
        apiName: requestUrl.nlp.associatedSecondWords.split('/').pop(),
        url: requestUrl.nlp.associatedSecondWords,
        method: 'post',
        data: data
      })
    },
    associatedSecondComments(data) {
      return request({
        pageName: 'Associated Keywords',
        apiName: requestUrl.nlp.associatedSecondComments.split('/').pop(),
        url: requestUrl.nlp.associatedSecondComments,
        method: 'post',
        data: data
      })
    },
    associatedThirdWords(data) {
      return request({
        pageName: 'Associated Keywords',
        apiName: requestUrl.nlp.associatedThirdWords.split('/').pop(),
        url: requestUrl.nlp.associatedThirdWords,
        method: 'post',
        data: data
      })
    },
    associatedThirdComments(data) {
      return request({
        pageName: 'Associated Keywords',
        apiName: requestUrl.nlp.associatedThirdComments.split('/').pop(),
        url: requestUrl.nlp.associatedThirdComments,
        method: 'post',
        data: data
      })
    },
    associatedFirstStatistic(data) {
      return request({
        pageName: 'Associated Keywords',
        apiName: requestUrl.nlp.associatedFirstStatistic.split('/').pop(),
        url: requestUrl.nlp.associatedFirstStatistic,
        method: 'post',
        data: data
      })
    },
    associatedSecondStatistic(data) {
      return request({
        pageName: 'Associated Keywords',
        apiName: requestUrl.nlp.associatedSecondStatistic.split('/').pop(),
        url: requestUrl.nlp.associatedSecondStatistic,
        method: 'post',
        data: data
      })
    },
    associatedThirdStatistic(data) {
      return request({
        pageName: 'Associated Keywords',
        apiName: requestUrl.nlp.associatedThirdStatistic.split('/').pop(),
        url: requestUrl.nlp.associatedThirdStatistic,
        method: 'post',
        data: data
      })
    },
    associatedGraph(data) {
      return request({
        pageName: 'Associated Keywords',
        apiName: requestUrl.nlp.associatedGraph.split('/').pop(),
        url: requestUrl.nlp.associatedGraph,
        method: 'post',
        data: data
      })
    },
    associatedGames(data) {
      return request({
        pageName: 'Associated Keywords',
        apiName: requestUrl.nlp.associatedGames.split('/').pop(),
        url: requestUrl.nlp.associatedGames,
        method: 'get',
        data: data
      })
    },
    copywrite(data) {
      return request({
        pageName: 'Smart Copywriter',
        apiName: requestUrl.nlp.copywrite.split('/').pop(),
        url: requestUrl.nlp.copywrite,
        method: 'post',
        data: data
      })
    },
    audioGenerate(data) {
      return request({
        pageName: 'Audio Generate',
        apiName: requestUrl.nlp.audioGenerate.split('/').pop(),
        url: requestUrl.nlp.audioGenerate,
        method: 'post',
        data: data
      })
    },
    translationTrainingAdd(data) {
      return request({
        pageName: 'translation_training',
        apiName: requestUrl.nlp.translationTrainingAdd.split('/').pop(),
        url: requestUrl.nlp.translationTrainingAdd,
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        // transformRequest: [
        //   function (data) {
        //     let myForm = new FormData()
        //     for (let key in data) {
        //       myForm.append(key, data[key])
        //     }
        //     return myForm
        //   }
        // ],
        method: 'post',
        data: data
      })
    },
    translationTrainingQuery(data) {
      return request({
        pageName: 'translation_training',
        apiName: requestUrl.nlp.translationTrainingQuery.split('/').pop(),
        url: requestUrl.nlp.translationTrainingQuery,
        method: 'post',
        data: data
      })
    }
  },
  kpi: {
    newQuarter(data) {
      return request({
        pageName: 'Audience For New Report',
        apiName: 'new_install_quarter',
        url: requestUrl.kpi.newQuarter,
        method: 'get',
        data: data
      })
    },
    new (data) {
      return request({
        pageName: 'Audience For New Report',
        apiName: 'new_install_report',
        url: requestUrl.kpi.new,
        method: 'post',
        data: data
      })
    },
    nlp(data) {
      return request({
        pageName: 'NLP Report',
        apiName: 'nlp_report',
        url: requestUrl.kpi.nlp,
        method: 'post',
        data: data
      })
    },
    service(data) {
      return request({
        pageName: 'MLFlow Service Report',
        apiName: 'service_report',
        url: requestUrl.kpi.service,
        method: 'post',
        data: data
      })
    },
    cv(data) {
      return request({
        pageName: 'CV Report',
        apiName: 'cv_report',
        url: requestUrl.kpi.cv,
        method: 'post',
        data: data
      })
    },
    churningQuarter(data) {
      return request({
        pageName: 'Audience For Churning Report',
        apiName: 'churning_quarter',
        url: requestUrl.kpi.churningQuarter,
        method: 'get',
        data: data
      })
    },
    churning(data) {
      return request({
        pageName: 'Audience For Churning Report',
        apiName: 'churning_report',
        url: requestUrl.kpi.churning,
        method: 'post',
        data: data
      })
    },
    preChurning(data) {
      return request({
        pageName: 'Audience For Churning Report',
        apiName: 'pre_churning_report',
        url: requestUrl.kpi.preChurning,
        method: 'post',
        data: data
      })
    },
    automationQuarter(data) {
      return request({
        pageName: 'Automation Report',
        apiName: 'automation_quarter',
        url: requestUrl.kpi.automationQuarter,
        method: 'get',
        data: data
      })
    },
    automation(data) {
      return request({
        pageName: 'Automation Report',
        apiName: 'automation_report',
        url: requestUrl.kpi.automation,
        method: 'post',
        data: data
      })
    },
    mlflowOverview(data) {
      return request({
        pageName: 'MLFlow Overview',
        apiName: 'mlflow_overview',
        url: requestUrl.kpi.mlflowOverview,
        method: 'post',
        data: data
      })
    },
    mlflowOverviewChart(data) {
      return request({
        pageName: 'MLFlow Overview',
        apiName: 'mlflow_overview_chart',
        url: requestUrl.kpi.mlflowOverviewChart,
        method: 'post',
        data: data
      })
    },
    gptPreMin(data) {
      return request({
        pageName: 'Gpt Statistic',
        apiName: requestUrl.kpi.gptPreMin.split('/').pop(),
        url: requestUrl.kpi.gptPreMin,
        method: 'post',
        data: data
      })
    },
    gptPreDay(data) {
      return request({
        pageName: 'Gpt Statistic',
        apiName: requestUrl.kpi.gptPreDay.split('/').pop(),
        url: requestUrl.kpi.gptPreDay,
        method: 'post',
        data: data
      })
    }
  },
  login: {
    callback(data) {
      return request({
        pageName: 'Index',
        apiName: 'callback',
        url: requestUrl.login.callback,
        method: 'get',
        data: data
      })
    }
  },
  testing: {
    interface(data) {
      return request({
        pageName: 'Testing',
        apiName: 'interface_test',
        url: requestUrl.testing.interface,
        method: 'post',
        data: data
      })
    },
    stress(data) {
      return request({
        pageName: 'Testing',
        apiName: 'stress_test',
        url: requestUrl.testing.stress,
        method: 'post',
        data: data
      })
    },
    stressReport(data) {
      return request({
        pageName: 'Testing',
        apiName: 'stress_report',
        url: requestUrl.testing.stressReport,
        method: 'post',
        data: data
      })
    },
    terminateStress(data) {
      return request({
        pageName: 'Testing',
        apiName: 'terminate_stress_test',
        url: requestUrl.testing.terminateStress,
        method: 'post',
        data: data
      })
    },
    retrieval(data) {
      return request({
        pageName: 'Data Extraction',
        apiName: 'retrieval',
        url: requestUrl.testing.retrieval,
        method: 'post',
        data: data
      })
    },
    progress(data) {
      return request({
        pageName: 'Data Extraction',
        apiName: 'progress',
        url: requestUrl.testing.progress,
        method: 'post',
        data: data
      })
    },
    interfaceList(data) {
      return request({
        pageName: 'Testing',
        apiName: 'interface_list',
        url: requestUrl.testing.interfaceList,
        method: 'post',
        data: data
      })
    },
    interfaceDel(data) {
      return request({
        pageName: 'Testing',
        apiName: 'interface_del',
        url: requestUrl.testing.interfaceDel,
        method: 'post',
        data: data
      })
    }
  },
  rainbow: {
    rainbow(data) {
      return request({
        pageName: 'Index',
        apiName: 'getdatas',
        url: requestUrl.rainbow.rainbow,
        method: 'post',
        data: data
      })
    }
  },
  modelRegistration: {
    register(data) {
      return request({
        pageName: 'Model Registration',
        apiName: 'register',
        url: requestUrl.modelRegistration.register,
        method: 'post',
        data: data,
        timeout: 5 * 60 * 1000
      })
    },
    modelHistory(data) {
      return request({
        pageName: 'Model History',
        apiName: 'model_history',
        url: requestUrl.modelRegistration.modelHistory,
        method: 'post',
        data: data
      })
    },
    deployModel(data) {
      return request({
        pageName: 'Model Deployment',
        apiName: 'deploy_model',
        url: requestUrl.modelRegistration.deployModel,
        method: 'post',
        data: data,
        timeout: 5 * 60 * 1000
      })
    },
    redeployModel(data) {
      return request({
        pageName: 'Model Deployment',
        apiName: 'redeploy_model',
        url: requestUrl.modelRegistration.redeployModel,
        method: 'post',
        data: data,
        timeout: 5 * 60 * 1000
      })
    },
    deploymentHistory(data) {
      return request({
        pageName: 'Model Deployment',
        apiName: 'get_history',
        url: requestUrl.modelRegistration.deploymentHistory,
        method: 'post',
        data: data,
        skip_log: true
      })
    },
    getConfig(data) {
      return request({
        pageName: 'Model Deployment',
        apiName: 'get_config',
        url: requestUrl.modelRegistration.getConfig,
        method: 'post',
        data: data,
        timeout: 5 * 60 * 1000
      })
    }
  },
  alert: {
    getAlertList(data) {
      return request({
        pageName: 'Alert Manager',
        apiName: 'getAlertList',
        url: requestUrl.alert.getAlertList,
        method: 'post',
        data: data
      })
    },
    getServiceName(data) {
      return request({
        pageName: 'Alert Manager',
        apiName: 'getServiceName',
        url: requestUrl.alert.getServiceName,
        method: 'post',
        data: data
      })
    },
    alertCreate(data) {
      return request({
        pageName: 'Alert Manager',
        apiName: 'alertCreate',
        url: requestUrl.alert.alertCreate,
        method: 'post',
        data: data
      })
    },
    alertSwitch(data) {
      return request({
        pageName: 'Alert Manager',
        apiName: 'alertSwitch',
        url: requestUrl.alert.alertSwitch,
        method: 'post',
        data: data
      })
    }
  },
  aidraw: {
    queryByTaskName(data) {
      return request({
        pageName: 'Task Query',
        apiName: 'queryByTaskName',
        url: requestUrl.aidraw.queryByTaskName,
        method: 'post',
        data: data
      })
    },
    queryByUsername(data) {
      return request({
        pageName: 'Task Query',
        apiName: 'queryByUsername',
        url: requestUrl.aidraw.queryByUsername,
        method: 'post',
        data: data
      })
    }
  },
  automation: {
    campaign(data) {
      return request({
        pageName: 'Automation',
        apiName: 'campaign',
        url: requestUrl.automation.campaign,
        method: 'post',
        data: data
      })
    },
    ruleAdd(data) {
      return request({
        pageName: 'Automation',
        apiName: 'rule_add',
        url: requestUrl.automation.ruleAdd,
        method: 'post',
        data: data
      })
    },
    ruleQuery(data) {
      return request({
        pageName: 'Automation',
        apiName: 'rule_query',
        url: requestUrl.automation.ruleQuery,
        method: 'post',
        data: data
      })
    },
    ruleUpdate(data) {
      return request({
        pageName: 'Automation',
        apiName: 'rule_update',
        url: requestUrl.automation.ruleUpdate,
        method: 'post',
        data: data
      })
    },
    ruleDel(data) {
      return request({
        pageName: 'Automation',
        apiName: 'rule_del',
        url: requestUrl.automation.ruleDel,
        method: 'post',
        data: data
      })
    },
    optCalculate(data) {
      return request({
        pageName: 'Automation',
        apiName: 'opt_calculate',
        url: requestUrl.automation.optCalculate,
        method: 'post',
        data: data
      })
    },
    optQuery(data) {
      return request({
        pageName: 'Automation',
        apiName: 'opt_query',
        url: requestUrl.automation.optQuery,
        method: 'post',
        data: data
      })
    },
    permission(data) {
      return request({
        pageName: 'Automation',
        apiName: 'user_game_code',
        url: requestUrl.automation.permission,
        method: 'post',
        data: data
      })
    },
    subscribe(data) {
      return request({
        pageName: 'Automation',
        apiName: 'subscribe',
        url: requestUrl.automation.subscribe,
        method: 'post',
        data: data
      })
    }
  },
  applications: {
    taskList(data) {
      return request({
        pageName: 'user_exraction',
        apiName: 'task_list',
        url: requestUrl.userExraction.task_list,
        method: 'post',
        data: data
      })
    },
    taskDelete(data) {
      return request({
        pageName: 'user_exraction',
        apiName: 'task_delete',
        url: requestUrl.userExraction.task_delete,
        method: 'post',
        data: data
      })
    },
    taskCommit(data) {
      return request({
        pageName: 'user_exraction',
        apiName: 'task_commit',
        url: requestUrl.userExraction.task_commit,
        method: 'post',
        data: data
      })
    },
    taskUpdate(data) {
      return request({
        pageName: 'user_exraction',
        apiName: 'task_update',
        url: requestUrl.userExraction.task_update,
        method: 'post',
        data: data
      })
    },
    getProductionList() {
      return request({
        pageName: 'user_exraction',
        apiName: 'get_production_list',
        url: requestUrl.userExraction.get_production_list,
        method: 'get'
      })
    },
    getFieldLabelList(data) {
      return request({
        pageName: 'user_exraction',
        apiName: 'get_field_label_list',
        url: requestUrl.userExraction.get_field_label_list,
        method: 'post',
        data: data
      })
    },
    taskSchedule(data){
      return request({
        pageName:'user_exraction',
        apiName:'task_schedule',
        url:requestUrl.userExraction.task_schedule,
        method:'post',
        data:data,
      })
    }
  }
}
