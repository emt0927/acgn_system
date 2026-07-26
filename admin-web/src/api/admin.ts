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
export interface loginData {
    token: string
}
export const loginApi = (data: registerType) => {
    return request.post<loginData>('/auth/login', {
        ...data
    })
}