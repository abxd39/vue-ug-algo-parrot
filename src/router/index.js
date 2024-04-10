import requestUrl from '@/api/url'
import {getCookie, roleMap} from '@/utils/api_utils'
import {createRouter, createWebHashHistory} from 'vue-router'

const routes =
    [
      {
        path: '/',
        name: 'home',
        redirect: '/index',
        // redirect: '/kpi',
        component: () => import('@/pages/home/Home.vue'),
        children: [
          {
            path: '/index',
            name: 'index',
            component: () => import('@/pages/index/Index.vue')
          },
          {
            path: '/api-doc',
            name: 'api-doc',
            component: () => import('@/pages/ieggGpt/tmp/ApiDoc.vue')
          },
          {
            path: '/document',
            name: 'document',
            component: () => import('@/pages/ieggGpt/tmp/Document.vue')
          },
          {
            path: '/seg',
            name: 'seg',
            component: () => import('@/pages/demos/cv/Seg.vue')
          },
          {
            path: '/cover',
            name: 'cover',
            component: () => import('@/pages/demos/cv/Cover.vue')
          },
          {
            path: '/tag',
            name: 'tag',
            component: () => import('@/pages/demos/cv/Tag.vue')
          },
          {
            path: '/monitor',
            name: 'monitor',
            component: () => import('@/pages/dashboard/Monitor.vue')
          },
          {
            path: '/gpt_dev',
            name: 'gpt dev',
            component: () => import('@/pages/tools/GPTDev.vue')
          },
          {
            path: '/gpt_prod',
            name: 'gpt prod',
            component: () => import('@/pages/tools/GPTProd.vue')
          },
          {
            path: '/search',
            name: 'search',
            component: () => import('@/pages/demos/nlp/Search.vue')
          },
          {
            path: '/graph',
            name: 'graph',
            component: () => import('@/pages/demos/nlp/KnowledgeGraph.vue')
          },
          {
            path: '/comprehension',
            name: 'comprehension',
            component: () => import('@/pages/demos/nlp/TextComprehension.vue')
          },
          {
            path: '/security',
            name: 'security',
            component: () => import('@/pages/demos/nlp/TextSecurity.vue')
          },
          {
            path: '/analysis',
            name: 'analysis',
            component: () =>
                import('@/pages/demos/nlp/PublicOpinionAnalysis.vue')
          },
          {
            path: '/permission',
            name: 'permission',
            component: () => import('@/pages/admin/Permission.vue')
          },
          {
            path: '/alert',
            name: 'alert',
            component: () => import('@/pages/tools/AlertManager.vue')
          },
          {
            path: '/model',
            name: 'model',
            component: () => import('@/pages/tools/ModelRegistration.vue')
          },
          {
            path: '/model_deployment',
            name: 'model_deployment',
            component: () => import('@/pages/tools/ModelDeployment.vue')
          },
          {
            path: '/kpi',
            name: 'kpi',
            component: () => import('@/pages/dashboard/Kpi.vue')
          },
          {
            path: '/testing',
            name: 'testing',
            component: () => import('@/pages/tools/Testing.vue')
          },
          {
            path: '/operation',
            name: 'operation',
            component: () => import('@/pages/admin/OperationData.vue')
          },
          {
            path: '/extraction',
            name: 'extraction',
            component: () => import('@/pages/tools/DataExtraction.vue')
          },
          {
            path: '/stress_test_admin',
            name: 'stress_test_admin',
            component: () => import('@/pages/admin/StressTesting.vue')
          },
          {
            path: '/ua',
            name: 'ua',
            component: () => import('@/pages/demos/UA.vue')
          },
          {
            path: '/platform',
            name: 'platform',
            component: () => import('@/pages/tools/Platform.vue')
          },
          {
            path: '/aidraw',
            name: 'aidraw',
            component: () => import('@/pages/tools/AiDraw.vue')
          },
          {
            path: '/automation_rule',
            name: 'automation_rule',
            component: () => import('@/pages/tools/Automation.vue')
          },
          {
            path: '/assistants',
            name: 'assistants',
            component: () => import('@/pages/demos/cv/Assistant.vue')
          },
          {
            path: '/summarization',
            name: 'summarization',
            component: () => import('@/pages/demos/nlp/TextSummarization.vue')
          },
          {
            path: '/associated',
            name: 'associated',
            component: () => import('@/pages/demos/nlp/AssociatedKeywords.vue')
          },
          {
            path: '/iegg_gpt',
            name: 'iegg_gpt',
            component: () => import('@/pages/ieggGpt/IeggGpt.vue')
          },
          {
            path: '/smart_copywriter',
            name: 'smart_copywriter',
            component: () => import('@/pages/demos/nlp/SmartCopywriter.vue')
          },
          {
            path: '/image_to_image',
            name: 'image_to_image',
            component: () => import('@/pages/demos/aigc/ImageToImage.vue')
          },
          {
            path: '/stable_diffusion_xl',
            name: 'stable_diffusion_xl',
            component: () => import('@/pages/demos/aigc/StableDiffusionXL.vue')
          },
          {
            path: '/audio_generate',
            name: 'audio_generate',
            component: () => import('@/pages/demos/aigc/AudioGenerate.vue')
          },
          {
            path: '/stable_diffusion',
            name: 'stable_diffusion',
            component: () => import('@/pages/demos/aigc/StableDiffusion.vue')
          },
          {
            path: '/nikke',
            name: 'nikke',
            component: () => import('@/pages/demos/report/NIKKE.vue')
          },
          {
            path: '/creative_assistant_nikke',
            name: 'creatives_assistant_nikke',
            component: () =>
                import('@/pages/demos/report/CreativeAssistantNIKKE.vue')
          },
          {
            path: '/creative_assistant_hok',
            name: 'creatives_assistant_hok',
            component: () =>
                import('@/pages/demos/report/CreativeAssistantHOK.vue')
          },
          {
            path: '/gpt_statistic',
            name: 'gpt_statistic',
            component: () => import('@/pages/dashboard/GptStatistic.vue')
          },
          {
            path: '/stable_diffusion_extension',
            name: 'stable_diffusion_extension',
            component: () =>
                import('@/pages/demos/aigc/StableDiffusionExtension.vue')
          },
          {
            path: '/translation_training',
            name: 'translation_training',
            component: () =>
                import('@/pages/demos/aigc/TranslationTraining.vue')
          }
        ]
      },
      {
        path: '/noPermission',
        name: 'NoPermission',
        component: () => import('@/pages/admin/NoPermission.vue')
      },
      {
        path: '/cover',
        name: 'cover',
        component: () => import('@/pages/demos/cv/Cover.vue')
      },
      {
        path: '/tag',
        name: 'tag',
        component: () => import('@/pages/demos/cv/Tag.vue')
      },
      {
        path: '/monitor',
        name: 'monitor',
        component: () => import('@/pages/dashboard/Monitor.vue')
      },
      {
        path: '/gpt_dev',
        name: 'gpt dev',
        component: () => import('@/pages/tools/GPTDev.vue')
      },
      {
        path: '/gpt_prod',
        name: 'gpt prod',
        component: () => import('@/pages/tools/GPTProd.vue')
      },
      {
        path: '/search',
        name: 'search',
        component: () => import('@/pages/demos/nlp/Search.vue')
      },
      {
        path: '/graph',
        name: 'graph',
        component: () => import('@/pages/demos/nlp/KnowledgeGraph.vue')
      },
      {
        path: '/comprehension',
        name: 'comprehension',
        component: () => import('@/pages/demos/nlp/TextComprehension.vue')
      },
      {
        path: '/security',
        name: 'security',
        component: () => import('@/pages/demos/nlp/TextSecurity.vue')
      },
      {
        path: '/analysis',
        name: 'analysis',
        component: () => import('@/pages/demos/nlp/PublicOpinionAnalysis.vue')
      },
      {
        path: '/permission',
        name: 'permission',
        component: () => import('@/pages/admin/Permission.vue')
      },
      {
        path: '/alert',
        name: 'alert',
        component: () => import('@/pages/tools/AlertManager.vue')
      },
      {
        path: '/model',
        name: 'model',
        component: () => import('@/pages/tools/ModelRegistration.vue')
      },
      {
        path: '/model_deployment',
        name: 'model_deployment',
        component: () => import('@/pages/tools/ModelDeployment.vue')
      },
      {
        path: '/kpi',
        name: 'kpi',
        component: () => import('@/pages/dashboard/Kpi.vue')
      },
      {
        path: '/testing',
        name: 'testing',
        component: () => import('@/pages/tools/Testing.vue')
      },
      {
        path: '/operation',
        name: 'operation',
        component: () => import('@/pages/admin/OperationData.vue')
      },
      {
        path: '/extraction',
        name: 'extraction',
        component: () => import('@/pages/tools/DataExtraction.vue')
      },
      {
        path: '/stress_test_admin',
        name: 'stress_test_admin',
        component: () => import('@/pages/admin/StressTesting.vue')
      },
      {
        path: '/ua',
        name: 'ua',
        component: () => import('@/pages/demos/UA.vue')
      },
      {
        path: '/platform',
        name: 'platform',
        component: () => import('@/pages/tools/Platform.vue')
      },
      {
        path: '/aidraw',
        name: 'aidraw',
        component: () => import('@/pages/tools/AiDraw.vue')
      },
      {
        path: '/automation_rule',
        name: 'automation_rule',
        component: () => import('@/pages/tools/Automation.vue')
      },
      {
        path: '/assistants',
        name: 'assistants',
        component: () => import('@/pages/demos/cv/Assistant.vue')
      },
      {
        path: '/summarization',
        name: 'summarization',
        component: () => import('@/pages/demos/nlp/TextSummarization.vue')
      },
      {
        path: '/associated',
        name: 'associated',
        component: () => import('@/pages/demos/nlp/AssociatedKeywords.vue')
      },
      {
        path: '/iegg_gpt',
        name: 'iegg_gpt',
        component: () => import('@/pages/ieggGpt/IeggGpt.vue')
      },
      {
        path: '/smart_copywriter',
        name: 'smart_copywriter',
        component: () => import('@/pages/demos/nlp/SmartCopywriter.vue')
      },
      {
        path: '/image_to_image',
        name: 'image_to_image',
        component: () => import('@/pages/demos/aigc/ImageToImage.vue')
      },
      {
        path: '/stable_diffusion_xl',
        name: 'stable_diffusion_xl',
        component: () => import('@/pages/demos/aigc/StableDiffusionXL.vue')
      },
      {
        path: '/audio_generate',
        name: 'audio_generate',
        component: () => import('@/pages/demos/aigc/AudioGenerate.vue')
      },
      {
        path: '/stable_diffusion',
        name: 'stable_diffusion',
        component: () => import('@/pages/demos/aigc/StableDiffusion.vue')
      },
      {
        path: '/nikke',
        name: 'nikke',
        component: () => import('@/pages/demos/report/NIKKE.vue')
      },
      {
        path: '/creative_assistant_nikke',
        name: 'creatives_assistant_nikke',
        component: () => import('@/pages/demos/report/CreativeAssistantNIKKE.vue')
      },
      {
        path: '/creative_assistant_hok',
        name: 'creatives_assistant_hok',
        component: () => import('@/pages/demos/report/CreativeAssistantHOK.vue')
      },
      {
        path: '/gpt_statistic',
        name: 'gpt_statistic',
        component: () => import('@/pages/dashboard/GptStatistic.vue')
      },
      {
        path: '/translation_training',
        name: 'translation_training',
        component: () => import('@/pages/demos/aigc/TranslationTraining.vue')
      },{
        path:'/user_exraction',
        name:'user_exraction',
        component:()=>import('@/pages/applications/UserExraction.vue'),
        props:true
      }
    ]

    const router = createRouter({history: createWebHashHistory(), routes})

router.beforeEach((to, from, next) => {
  sessionStorage.setItem('parrotPath', to.path)
  if (to.fullPath !== '/index') {
    // 首页不需要存
    sessionStorage.setItem('parrotFullPath', to.fullPath)
  }
  // 本地开发环境不校验
  if (import.meta.env.MODE === 'development') {
    return next()
  }
  // 刚进来首页不用校验
  if (from.path === '/') {
    return next()
  }
  // 没有权限页面不需要控制
  if (to.path === '/noPermission') {
    return next()
  }

  // 切换路由校验是否登录
  const username = getCookie('user_name')
  if (!username) {
    if (window.location.hostname === 'algo.intltest11.com') {
      top.location.href = requestUrl.login.devLogin
      return
    } else if (window.location.hostname === 'algo.intlgame.com') {
      top.location.href = requestUrl.login.prodLogin
      return
    }
  }

  // 拿到角色进行权限控制
  const role = sessionStorage.getItem('role')
  // 有角色
  if (role) {
    if (!Object.values(roleMap).includes(role)) {
      if (to.path !== '/index') {
        return next('/noPermission')
      }
    }
    // 数据权限，不能访问admin页面
    if (role === 'data' &&
        (to.path === '/permission' || to.path === '/operation' ||
         to.path === '/stress_test_admin')) {
      return next('/noPermission')
      // 开发权限，不能访问admin和kpi页面
    } else if (
        role === 'developer' &&
        (to.path === '/permission' || to.path === '/kpi' ||
         to.path === '/operation' || to.path === '/stress_test_admin')) {
      return next('/noPermission')
      // gpt权限，只能访问首页和gpt页面
    } else if (
        role === 'gpt_only' && to.path !== '/index' &&
        to.path !== '/iegg_gpt') {
      return next('/noPermission')
    }
  }
  else {
    // 没有角色, 首次登录
    if (to.path !== '/index') {
      return next('/noPermission')
    }
  }
  next()
})

export default router
