import request from "@/utils/request";
// 获取个人信息
export const getUserInfoApi = () => {
    return request.get('/user/profile')
}
// 修改个人信息
export const postUserInfoApi = (data: any) => {
    console.log(data);
    return request.post('/user/profile', data)
}