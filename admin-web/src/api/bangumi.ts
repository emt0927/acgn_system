import type { bgmSearchListType } from "@/components/BangumuList.vue";
import request from "@/utils/request";

// 搜索列表
export const getBangumiSearchListApi = (data?: any) => {
    return request.get<bgmSearchListType[]>('/bangumi/searchList', {
        params: {
            ...data

        }
    })
}
// 获取详情
export const getBangumiDetailApi = (data?: any) => {
    return request.get('/bangumi/detail', {
        params: {
            ...data
        }
    })
}