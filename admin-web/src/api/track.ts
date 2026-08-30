import request from "@/utils/request";

export interface TrackLog {
    mediaId: string | number    // 作品 ID
    title: string       // 作品名称
    type: string    // 分类（anime/manga/game/novel）
}
// 埋点 记录被点击过的作品
export const trackClickMediaApi = (data: TrackLog) => {
    // request.post('api/chack', data)
}

// 测试
export const getTest = () => {
    return request.post('/media/test')
}