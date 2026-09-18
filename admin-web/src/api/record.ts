import request from "@/utils/request";
// 记录每天添加或删除的作品or系列数量
export const trackRecordApi = (type: string, title: string, action: string) => {
    return request.post('record/', {
        type,
        title,
        action
    })
}
// 获取记录数据
export const getRecordApi = () => {
    return request.get('record/getList')
}