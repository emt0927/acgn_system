import { reToken } from "@/api/admin";
import { useUserStore } from "@/store";
import axios, { type AxiosRequestConfig } from "axios";
import { createDiscreteApi } from "naive-ui";
import { ref } from "vue";
const { message } = createDiscreteApi(['message'])
import router from "@/router";
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
req.interceptors.response.use(async function (response) {
  const res = response.data;
  const config = response.config
  const userStore = useUserStore()
  // 401 长期登录
  if (res.code === 401) {
    if (config.url === '/auth/refresh') {
      // 长token也失效了
      retryQueue.value = []
      userStore.clearToken() // 清空pinia中的Token
      router.replace({ name: 'login' }) // 跳到登录页重新登录
      return
    }
    if (isRefreshing.value) {
      //将后续请求存入等待队列挂起
      return new Promise<any>(resolve => {
        retryQueue.value.push((newToken) => {
          config.headers.Authorization = `Bearer ${newToken}`
          resolve(request(config))
        })
      })
    }
    isRefreshing.value = true
    // 第一个请求进来 拿长token换一个新的短token
    try {
      const res = await reToken(userStore.refreshToken)
      if (res.code !== 200 || !res.data?.accessToken) throw new Error('校验失败')
      const newToken = res.data.accessToken
      // 更新请求头
      config.headers.Authorization = `Bearer ${newToken}`
      // 更新pinia
      userStore.accessToken = newToken
      // 遍历发送后续挂起的请求
      retryQueue.value.forEach(callback => callback(newToken))
      retryQueue.value = []
      // 重新发送当前请求
      return request(config)
    } catch (error) {
      //校验失败
      retryQueue.value = []
      userStore.clearToken()
      router.replace({ name: 'login' })
      return Promise.reject(error)
    } finally {
      isRefreshing.value = false
    }
  }
  if (res.code !== 200) {
    message.error(res.message || '业务请求失败')
    return Promise.reject(new Error(res.message))
  }
  return response.data;
}, async function (error) {
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