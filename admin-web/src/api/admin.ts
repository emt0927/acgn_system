import request from "@/utils/request"

// 注册
interface registerType {
    username: string,
    password: string
}

export const registerApi = (data: registerType) => {
    return request.post('/auth/register', {
        ...data
    })
}

//登录
export interface tokenData {
    accessToken: string
    refreshToken: string
}
export const loginApi = (data: registerType) => {
    return request.post<tokenData>('/auth/login', {
        ...data
    })
}

// token过期 换取token
export const reToken = (token: string) => {
    return request.post<{ accessToken: string }>('/auth/refresh', {
        token
    })
}