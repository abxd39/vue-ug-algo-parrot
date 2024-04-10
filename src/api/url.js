export default {
  cv: {
    seg: '/api/v1/portal/video_seg',
    cover: '/api/v1/portal/video_cover',
    tag: '/api/v1/portal/video_tagging',
    audio:'/api/v1/portal/source_audio',
    assistants: '/api/v1/portal/assistants',
    assistantsLikeStauts: '/api/v1/portal/assistants_like_status',
    assistantsLike: '/api/v1/portal/assistants_like',
    assistantsDislike: '/api/v1/portal/assistants_dislike',
    nikkeTableauTrust: 'nikke/trusted',
    assistantTableauTrust: 'assistant/trusted'
  },
  permission: {
    add: '/api/v1/portal/add_user',
    del: '/api/v1/portal/del_user',
    update: '/api/v1/portal/update_user',
    search: '/api/v1/portal/search_user',
    operation: '/api/v1/portal/get_portal_report',
    operateData:"/api/v1/portal/operate_data"
  },
  nlp: {
    // 搜索
    intelSearch: '/api/query',
    autoSearch: '/api/autocomplete',
    searchToken: '/api/v1/auth/login',
    search: '/api/v1/intelligence/homePage/search',
    // 文本理解
    langDetection: '/opinion_language_detection/predict/',
    ner: {
      zh: '/zh/api/v2/ner',
      en: '/en/api/v2/ner',
      mul: '/mul/api/v2/ner'
    },
    gameTitle: '/api/v1/news',
    // 多语言句子表示
    multilingual: '',
    // 文本安全
    security: '/api/v1/content_security',
    hack: '/api/v1/hack',
    // 舆情分析
    sentiment: '/api/v1/sentiment_analysis',
    topic: '/api/v1/opinion_labels_demo_api',
    summary: '/summary',
    // 情感细粒度分析
    reviewProcess: '/api/v1/absa/review_process',
    // 印象评分
    aspectScore: '/api/v1/absa/aspect_score',
    opinionExpression: '/api/v1/absa/opinion_expression_list',
    contentDetail: '/api/v1/absa/content_detail',
    // 文字提取
    textExtract: '/text_extract/predict/',
    // 评论有效性
    commentEffective: '/comment_effective/predict/',
    // 评论过滤
    commentValid: '/comment_valid/predict/',
    // 关键词聚类
    keywordsCluster: '/keywords_cluster/predict/',
    summaryText: '/api/v1/portal/summary_sentence_details',
    summaryModify: '/api/v1/portal/summary_modify_sentence',
    summaryComments: '/api/v1/portal/summary_sentence_comments',
    summaryDel: '/api/v1/portal/summary_del_sentence',
    summaryRecover: '/api/v1/portal/summary_recover_sentence',
    summaryParams: '/api/v1/portal/summary_params',
    summaryHistory:'/api/v1/portal/summary_modify_history',
    // 关联词
    associatedFirstWords: '/api/v1/portal/associated_first_words',
    associatedFirstComments: '/api/v1/portal/associated_first_word_comments',
    associatedSecondWords: '/api/v1/portal/associated_second_words',
    associatedSecondComments: '/api/v1/portal/associated_second_word_comments',
    associatedThirdWords: '/api/v1/portal/associated_third_words',
    associatedThirdComments: '/api/v1/portal/associated_third_word_comments',
    associatedFirstStatistic: '/api/v1/portal/associated_statistic_first_words',
    associatedSecondStatistic: '/api/v1/portal/associated_statistic_second_words',
    associatedThirdStatistic: '/api/v1/portal/associated_statistic_third_words',
    associatedGraph: '/api/v1/portal/associated_graph',
    associatedGames: '/api/v1/portal/associated_games',
    // copywrite
    copywrite: '/api/copywrite',
    audioGenerate: '/audio_generate/predict/',
    //本地化翻译
    translationTrainingAdd:'/api/v1/portal/translation/add',
    translationTrainingQuery:'/api/v1/portal/translation/query'

  },
  kpi: {
    // 拉新数据的接口
    newQuarter: '/api/v1/portal/new_install_quarter',
    new: '/api/v1/portal/new_install_report',
    nlp: '/api/v1/portal/nlp_report',
    service: '/api/v1/portal/service_report',
    cv: '/api/v1/portal/cv_report',
    churningQuarter: '/api/v1/portal/churning_quarter',
    churning: '/api/v1/portal/churning_report',
    preChurning: '/api/v1/portal/pre_churning_report',
    automationQuarter: '/api/v1/portal/automation_quarter',
    automation: '/api/v1/portal/automation_report',
    mlflowOverview: '/mlflow/overview/',
    mlflowOverviewChart: '/mlflow/overview_chart/',
    gptPreMin: '/api/v1/portal/gpt/minute',
    gptPreDay: '/api/v1/portal/gpt/day'
  },
  login: {
    // devLogin:
    //   'https://login.iam.intlgame.com/sso/tn-869bbe512bb54c14921d85c69ae839dc/ai-72979cb3b5224f4f9a19ca6b4e2fe64c/oidc/authorize?client_id=ai-72979cb3b5224f4f9a19ca6b4e2fe64c&response_type=code&redirect_uri=http://algo.intltest11.com/&scope=openid offline_access',
    devLogin: 'http://43.134.152.100:8080/api/v1/portal/login',
    devLogout: 'http://43.134.152.100:8080/api/v1/portal/logout',
    callback: '/api/v1/portal/callback',
    prodLogin:
      'https://login.iam.intlgame.com/sso/tn-869bbe512bb54c14921d85c69ae839dc/ai-df0d6fa277114c90b21fb81edeff188b/oidc/authorize?client_id=ai-df0d6fa277114c90b21fb81edeff188b&response_type=code&redirect_uri=http://algo.intlgame.com/&scope=openid offline_access',
    prodLogout: 'https://portal.iam.intlgame.com/logout?return_to=http://algo.intlgame.com'
  },
  testing: {
    interface: '/api/v1/portal/interface_test',
    stress: '/api/v1/portal/stress_test',
    stressReport: '/api/v1/portal/stress_report',
    terminateStress: '/api/v1/portal/terminate_stress_test',
    retrieval: '/api/v1/creatives/retrieval',
    progress: '/api/v1/creatives/progress',
    interfaceList: '/api/v1/portal/interface_list',
    interfaceDel: '/api/v1/portal/interface_del'
  },
  rainbow: {
    rainbow: '/rainbowapi.configs/getdatas'
  },
  modelRegistration: {
    register: '/mlflow/register/',
    modelHistory: '/mlflow/model_history/',
    deployModel: '/mlflow/deploy_model/',
    redeployModel: '/mlflow/redeploy_model/',
    deploymentHistory: '/mlflow/get_history/',
    getConfig: '/mlflow/get_config/'
  },
  alert: {
    getAlertList: '/api/v1/alert/alert_retrieve/',
    getServiceName: '/api/v1/alert/service_list/',
    alertCreate: '/api/v1/alert/alert_create/',
    alertSwitch: '/api/v1/alert/alert_switch/'
  },
  aidraw: {
    createTask: '/api/v1/aidraw/create',
    queryByTaskName: '/api/v1/aidraw/query',
    queryByUsername: '/api/v1/aidraw/user/task/query'
  },
  automation: {
    campaign: '/api/v1/portal/automation/campaign',
    ruleAdd: '/api/v1/portal/automation/rule_add',
    ruleQuery: '/api/v1/portal/automation/rule_query',
    ruleUpdate: '/api/v1/portal/automation/rule_update',
    ruleDel: '/api/v1/portal/automation/rule_del',
    optCalculate: '/api/v1/portal/automation/opt_calculate',
    optQuery: '/api/v1/portal/automation/opt_query',
    permission: '/api/v1/portal/automation/user_game_code',
    subscribe:'/api/v1/portal/automation/subscribe'
  },
  userExraction:{
    task_list:'/api/v1/portal/get_task_list',
    task_delete:'/api/v1/portal/delete_task',
    task_commit:'/api/v1/portal/commit_task',
    task_update:'/api/v1/portal/update_tag_db',
    get_production_list:'/api/v1/portal/get_production_list',
    get_field_label_list:'/api/v1/portal/get_fieldlabel_list',
    task_schedule:'/api/v1/portal/schedule_task',
  }
}
