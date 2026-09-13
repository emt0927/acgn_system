import type { bgmSearchListType } from "@/components/BangumuList.vue";
import request from "@/utils/request";

// 搜索列表
export const getBangumiSearchListApi = (data?: any) => {
    console.log(data);
    return request.get<bgmSearchListType[]>('/bangumi/searchList', {
        params: {
            ...data
            
        }
    })
}