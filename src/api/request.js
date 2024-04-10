import axios from 'axios'
import { sendUserAction } from '@/utils/api_utils'

// 创建一个axios实例对象
const service = axios.create({
  // baseURL: import.meta.env.VITE_BASE_URL
})

// 在请求之前做一些处理
service.interceptors.request.use(req => {
  // 可以自定义header，jwt-token认证等
  return req
})

// 在请求之后做一些事情
service.interceptors.response.use(
  res => {
    // const { ret_code, data, message } = res.data
    // if (ret_code == "0") {
    //     return data
    // } else {
    //     ElMessage.error(message || NETWORK_ERROR)
    //     return Promise.reject(msg || NETWORK_ERROR)
    // }
    return res
  },
  err => {
    return err.message
  }
)

// 封装核心函数
function request(options) {
  if (!(options.skip_log ?? false)) {
    sendUserAction({
      page_name: options.pageName,
      api_name: options.apiName,
      query_url: options.url,
      query_params: JSON.stringify(options.data)
    })
  }
  delete options.apiName
  delete options.pageName
  delete options.skip_log
  options.method = options.method || 'get'
  if (options.method.toLowerCase() == 'get') {
    options.params = options.data
    delete options.data
  }
  return service(options)
}

export default request
