import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
// 按需导入element-plus
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import { fileURLToPath } from 'url'
import { resolve, dirname } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    AutoImport({
      resolvers: [ElementPlusResolver()]
    }),
    Components({
      resolvers: [ElementPlusResolver()]
    })
  ],
  resolve: {
    alias: {
      '@': resolve(dirname(fileURLToPath(import.meta.url)), 'src')
    }
  },
  css: {
    // css预处理器
    preprocessorOptions: {
      less: {
        charset: false,
        additionalData: '@import "./src/assets/less/var.less";'
      }
    }
  },
  // configureWebpack: {
  //   externals: {
  //       './cptable': 'var cptable'
  //   }
  // },
  // 代理
  server: {
    // 设置本地环境启动端口
    port: 8888,
    // 自动打开浏览器
    open: true,
    proxy: {
      '/api/v1/portal': {
        target: 'http://127.0.0.1:5000',
        changeOrigin: true
        // rewrite: (path) => path.replace(/^\/dev/, "")
      },
      '/sd/img2img':{
        target: 'http://10.190.51.23:8080',
        changeOrigin: true
      },
      '/api/query': {
        target: 'http://101.33.43.186',
        changeOrigin: true
      },
      '/api/autocomplete': {
        target: 'http://150.109.27.56',
        changeOrigin: true
      },
      '/api/v1/auth/login': {
        target: 'http://101.32.115.250:9000',
        changeOrigin: true
      },
      '/api/v1/intelligence/homePage/search': {
        target: 'http://101.32.115.250:9000',
        changeOrigin: true
      },
      '/api/v1/opinion_language_detection': {
        target: 'http://101.32.107.175:8000',
        changeOrigin: true
      },
      '/mul/api/v2/ner': {
        target: 'http://101.32.111.49:8009',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/mul/, '')
      },
      '/zh/api/v2/ner': {
        target: 'http://101.32.143.110:8009',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/zh/, '')
      },
      '/en/api/v2/ner': {
        target: 'http://101.32.113.18:8009',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/en/, '')
      },
      '/api/v1/news': {
        target: 'http://101.32.107.189:8004',
        changeOrigin: true
      },
      '/api/v1/content_security': {
        target: 'http://101.32.172.180:8004',
        changeOrigin: true
      },
      '/api/v1/hack': {
        target: 'http://101.32.172.180:8004',
        changeOrigin: true
      },
      '/api/v1/sentiment_analysis': {
        target: 'http://101.33.47.141:8004',
        changeOrigin: true
      },
      '/api/v1/opinion_labels_demo_api': {
        target: 'http://101.32.113.144:8000',
        changeOrigin: true
      },
      '/summary': {
        target: 'http://43.134.149.250:8004',
        changeOrigin: true
      },
      '/api/v1/absa': {
        target: 'http://43.134.153.15:8080',
        changeOrigin: true
      },
      '/api/v1/creatives': {
        target: 'http://127.0.0.1:8999',
        changeOrigin: true
      },
      '/rainbowapi.configs/getdatas': {
        target: 'http://api-rainbow-out.intlgame.com:8080',
        changeOrigin: true
      },
      '/mlflow/register': {
        target: 'http://127.0.0.1:5000/',
        changeOrigin: true
      },
      '/mlflow/model_history': {
        target: 'http://101.32.247.54:8082/',
        changeOrigin: true
      },
      '/mlflow/deploy_model': {
        target: 'http://127.0.0.1:8080/',
        changeOrigin: true
      },
      '/mlflow/redeploy_model': {
        target: 'http://127.0.0.1:8080/',
        changeOrigin: true
      },
      '/mlflow/get_history': {
        target: 'http://127.0.0.1:8080/',
        changeOrigin: true
      },
      '/mlflow/get_config': {
        target: 'http://127.0.0.1:8080/',
        changeOrigin: true
      },
      '/api/v1/alert/alert_retrieve/': {
        target: 'http://101.32.247.54:8080/',
        changeOrigin: true
      },
      '/api/v1/alert/service_list/': {
        target: 'http://101.32.247.54:8080/',
        changeOrigin: true
      },
      '/api/v1/alert/alert_create/': {
        target: 'http://101.32.247.54:8080/',
        changeOrigin: true
      },
      '/api/v1/alert/alert_switch/': {
        target: 'http://101.32.247.54:8080/',
        changeOrigin: true
      },
      // aidraw
      '/api/v1/aidraw': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true
      },
      // 文字提取
      '/text_extract/predict/': {
        target: 'http://127.0.0.1:8080',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/text_extract/, '')
      },
      // 评论有效性
      '/comment_effective/predict/': {
        target: 'http://127.0.0.1:8080',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/comment_effective/, '')
      },
      // 评论过滤
      '/comment_valid/predict/': {
        target: 'http://127.0.0.1:8080',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/comment_valid/, '')
      },
      // 关键词聚类
      '/keywords_cluster/predict/': {
        target: 'http://127.0.0.1:8080',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/keywords_cluster/, '')
      },
      '/mlflow/overview': {
        target: 'http://101.32.247.54:5052/',
        changeOrigin: true
      },
      '/mlflow/overview_chart': {
        target: 'http://101.32.247.54:5052/',
        changeOrigin: true
      },
      '/api/copywrite': {
        target: 'http://101.32.133.38',
        changeOrigin: true
      },
      '/stable_diffusion/img2img/': {
        target: 'https://ua-sg-1300342648.cos.ap-singapore.myqcloud.com/',
        changeOrigin: true
      },
      '/nikke/trusted': {
        target: 'https://sg-tableau.intlgame.com/',
        changeOrigin: true, 
        rewrite: path => path.replace(/^\/nikke/, '')
      },
      '/assistant/trusted': {
        target: 'https://sg-tableau-new.intlgame.com',
        changeOrigin: true, 
        rewrite: path => path.replace(/^\/assistant/, '')
      }
    }
  }
})
