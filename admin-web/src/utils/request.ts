import { reToken } from "@/api/admin";
import { useUserStore } from "@/store";
import axios, { type AxiosRequestConfig } from "axios";
import { createDiscreteApi } from "naive-ui";
import { ref } from "vue";
import { useRouter } from "vue-router";
const { message } = createDiscreteApi(['message'])
const router = useRouter()
// 1. 创建实例
const req = axios.create({
  baseURL: 'http://localhost:3000',
  timeout: 5000
});

// 2. 请求拦截器
req.interceptors.request.use(function (config) {
  // 引入user仓库
  const userStore = useUserStore()
  const token = userStore.accessToken
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config;
}, function (error) {
  return Promise.reject(error);
});
// 无感刷新token
// 状态锁
const isRefreshing = ref(false)
// 等待队列
const retryQueue = ref<((token: string) => void)[]>([])
// 3. 响应拦截器（脱皮：把 response.data 剥出来）
req.interceptors.response.use(function (response) {
  const res = response.data;
  if (res.code && res.code !== 200) {
    message.error(res.message || '业务处理失败')
    return Promise.reject(res)
  }
  return response.data;
}, async function (error) {
  const config = error.config
  const userStore = useUserStore()
  // 长token失效了
  if (config.url === '/auth/refresh') {
    // 清空token
    userStore.clearToken()
    // 跳转到登录页
    router.replace({ name: 'login' })
    return Promise.reject(error)
  }
  if (error.response?.status === 401) {
    if (isRefreshing.value) {
      return new Promise(resolve => {
        retryQueue.value.push((newToken) => {
          config.headers.Authorization = `Bearer ${newToken}`
          resolve(request(config))
        })
      })
    }
    isRefreshing.value = true
    try {
      // 换回来的token
      const res = await reToken(userStore.refreshToken)
      userStore.accessToken = res.data?.accessToken ?? ''
      config.headers.Authorization = `Bearer ${userStore.accessToken}`
      // 重新发起等待的请求
      retryQueue.value.forEach(callback => callback(res.data?.accessToken as string))
      // 清空队列
      retryQueue.value = []
      // 重新发送当前请求
      return request(config)
    } catch (error) {
      //数新失败
      retryQueue.value = []
      userStore.clearToken()
      router.replace({ name: 'login' })
      return Promise.reject(error)
    } finally {
      isRefreshing.value = false
    }
  }
  const msg = error.response?.data?.message || error.message || '网络或服务器错误'
  message.error(msg)
  return Promise.reject(new Error(msg))
});


// 2. 🌟 核心：定义全局通用的响应结构模板
// T 专门用来代表 data 的类型，默认是 any
export interface Result<T = any> {
  code: number
  message: string
  data?: T
}

// 4. 封装带类型的 request 函数
function request<T = any>(config: AxiosRequestConfig): Promise<Result<T>> {
  return req(config) as unknown as Promise<Result<T>>
}

// 🌟 重点：给 request 函数挂载便捷方法
request.get = <T = any>(url: string, config?: AxiosRequestConfig): Promise<Result<T>> => {
  return req.get(url, config) as unknown as Promise<Result<T>>
}

request.post = <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<Result<T>> => {
  return req.post(url, data, config) as unknown as Promise<Result<T>>
}
request.put = <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<Result<T>> => {
  return req.put(url, data, config) as unknown as Promise<Result<T>>
}

request.delete = <T = any>(url: string, config?: AxiosRequestConfig): Promise<Result<T>> => {
  return req.delete(url, config) as unknown as Promise<Result<T>>
}

export default request