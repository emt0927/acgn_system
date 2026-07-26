import { useUserStore } from "@/store";
import axios, { type AxiosRequestConfig } from "axios";
import { createDiscreteApi } from "naive-ui";
const { message } = createDiscreteApi(['message'])
// 1. 创建实例
const req = axios.create({
  baseURL: 'http://localhost:3000',
  timeout: 5000
});

// 2. 请求拦截器
req.interceptors.request.use(function (config) {
  // 引入user仓库
  const userStore = useUserStore()
  const token = userStore.token
  if (token) {
    config.headers.Authorization = token
  }
  return config;
}, function (error) {
  return Promise.reject(error);
});

// 3. 响应拦截器（脱皮：把 response.data 剥出来）
req.interceptors.response.use(function (response) {
  const res = response.data;
  if (res.code && res.code !== 200) {
    message.error(res.message || '业务处理失败')
    return Promise.reject(res)
  }
  return response.data;
}, function (error) {
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