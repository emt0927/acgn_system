import request from "@/utils/request";
import type { pageData } from "./media";
import type { Series, SeriesDetail } from "@/types/acgn";
// 添加系列
export const addSeriesApi = (data: any) => {
    return request.post('/series/add', data)
}
// 获取系列列表
export const getSeriesListApi = (data?: pageData) => {
    return request.get<{ list: Series[], total: number }>('/series/get', {
        params: {
            ...data
        }
    })
}
// 获取系列详情
export const getSeriesDetailApi = (id: string) => {
    return request.get<SeriesDetail>(`/series/getDetail/${id}`)
}

//编辑系列
export const putSeriesDetailApi = (data: any) => {
    return request.put('/series/updateSeries', data)
}