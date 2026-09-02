import type { MediaCardItem } from "@/types/acgn";
import request from "@/utils/request";

// 添加作品
export const addMediaApi = (data: any) => {
    return request.post('/media/addDetail', data)
}

//获取作品列表
export interface pageData {
    page: number,
    pageSize: number
}
export const getMediaListApi = (data: pageData) => {
    return request.get<{ list: MediaCardItem[], total: number }>('/media/getList', {
        params: {
            ...data
        }
    })
}

// 获取作品详情
export const getMediaDetailApi = (id: string) => {
    return request.get(`/media/getDetail/${id}`)
}