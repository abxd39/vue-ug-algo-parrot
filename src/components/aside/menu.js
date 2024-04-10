// 菜单，目前是前端写死
export default [
  {name: 'index', label: 'Index', icon: 'homeFilled', path: '/index'}, {
    name: 'iegg gpt',
    label: 'IEGG-GPT',
    icon: 'Comment',
    path: '/iegg_gpt',
  },
  {
    name: 'tmp',
    label: 'TMP',
    icon: 'HelpFilled',
    path: '/tmp',
    children: [
      {name: 'api', label: 'API DOCUMENT', icon: '', path: '/api-doc'}
    ]
  },
  {
    name: 'aigc',
    label: 'AIGC',
    icon: 'grid',
    path: '/aigc',
    children: [
      {
        name: 'imageToImage',
        label: 'Image To Image',
        icon: '',
        path: '/image_to_image'
      },
      {
        name: 'audio generate',
        label: 'Audio Generate',
        icon: '',
        path: '/audio_generate'
      },
      {
        name: 'stable_diffusion_xl',
        label: 'Stable Diffusion XL',
        icon: '',
        path: '/stable_diffusion_xl'
      },
      {
        name: 'stable_diffusion',
        label: 'Stable Diffusion',
        icon: '',
        path: '/stable_diffusion'
       },
      {
        name: 'stable_diffusion_extension',
        label: 'Stable Diffusion(Extension)',
        icon: '',
        path: '/stable_diffusion_extension'
      },
      {
        name: 'Translation Training',
        label: 'Translation Training',
        icon: '',
        path: '/translation_training'
      }
    ]
  },
  {
    name: 'dashboard',
    label: 'Dashboard',
    icon: 'histogram',
    path: '/dashboard',
    children: [
      {name: 'kpi', label: 'KPI', icon: '', path: '/kpi'}, {
        name: 'gpt_statistic',
        label: 'GPT Statistic',
        icon: '',
        path: '/gpt_statistic'
      }
    ]
  },
  {
    name: 'creative insights',
    label: 'Creative Insights',
    icon: 'helpFilled',
    path: '/insights',
    children: [
      {
        name: 'video segmetation',
        label: 'Video Segmetation',
        icon: '',
        path: '/seg'
      },
      {name: 'video cover', label: 'Video Cover', icon: '', path: '/cover'},
      {name: 'video tagging', label: 'Video Tagging', icon: '', path: '/tag'},
      {name: 'assistant', label: 'Assistant', icon: '', path: '/assistants'}
    ]
  },
  {
    name: 'applications',
    label: 'Applications',
    icon: 'helpFilled',
    path: '/demos',
    children: [
      {
        name: 'nlp',
        label: 'NLP',
        icon: 'helpFilled',
        path: '/nlp',
        children: [
          {name: 'search', label: 'Search', icon: '', path: '/search'}, {
            name: 'text comprehension',
            label: 'Text Comprehension',
            icon: '',
            path: '/comprehension'
          },
          {
            name: 'text security',
            label: 'Text Security',
            icon: '',
            path: '/security'
          },
          {
            name: 'public opinion analysis',
            label: 'Public Opinion Analysis',
            icon: '',
            path: '/analysis'
          },
          {
            name: 'text summarization',
            label: 'Text Summarization',
            icon: '',
            path: '/summarization'
          },
          {
            name: 'Associated Keywords',
            label: 'Associated Keywords',
            icon: '',
            path: '/associated'
          },
          {
            name: 'Smart Copywriter',
            label: 'Smart Copywriter',
            icon: '',
            path: '/smart_copywriter'
          }
        ]
      },
      {
        name: ' creative insights report',
        label: 'Creative Insights Report',
        icon: 'helpFilled',
        path: '/report',
        children: [
          {
            name: 'tagging insights (nikke)',
            label: 'Tagging Insights (NIKKE)',
            icon: '',
            path: '/nikke'
          },
          {
            name: 'creative assistant (nikke)',
            label: 'Creative Assistant (NIKKE)',
            icon: '',
            path: '/creative_assistant_nikke'
          },
          {
            name: 'creative assistant (hok)',
            label: 'Creative Assistant (HOK)',
            icon: '',
            path: '/creative_assistant_hok'
          }
        ]
      },
      {name: 'UA', label: 'UA', icon: '', path: '/ua'}, {
        name: 'automation_rule',
        label: 'Auto Planning',
        icon: '',
        path: '/automation_rule'
      },{
        name:'user_exraction',
        label:'User Exraction',
        path:'/user_exraction'
      }
    ]
  },
  {
    name: 'tools',
    label: 'Tools',
    icon: 'tools',
    path: '/tools',
    children: [
      {name: 'monitor', label: 'Monitor', icon: '', path: '/monitor'}, {
        name: 'gpt proxy dev',
        label: 'GPT Proxy Dev',
        icon: '',
        path: '/gpt_dev'
      },
      {
        name: 'gpt proxy prod',
        label: 'GPT Proxy Prod',
        icon: '',
        path: '/gpt_prod'
      },
      {name: 'alert manager', label: 'Alert Manager', icon: '', path: '/alert'},
      {
        name: 'model registration',
        label: 'Model Registration',
        icon: '',
        path: '/model'
      },
      {
        name: 'model deployment',
        label: 'Model Deployment',
        icon: '',
        path: '/model_deployment'
      },
      {name: 'testing', label: 'Testing', icon: '', path: '/testing'}, {
        name: 'extraction',
        label: 'Data Extraction',
        icon: '',
        path: '/extraction'
      },
      {name: 'platform', label: 'Platform', icon: '', path: '/platform'},
      // {
      //   name: 'aidraw',
      //   label: 'AiDraw',
      //   icon: '',
      //   path: '/aidraw'
      // },
    ]
  },
  {
    name: 'admin',
    label: 'Admin',
    icon: 'avatar',
    path: '/admin',
    children: [
      {name: 'permission', label: 'Permission', icon: '', path: '/permission'},
      {
        name: 'operation',
        label: 'Operation Data',
        icon: '',
        path: '/operation'
      },
      {
        name: 'stress_test_admin',
        label: 'Stress Testing Data',
        icon: '',
        path: '/stress_test_admin'
      }
    ]
  }
]
