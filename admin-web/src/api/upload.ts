import request from "@/utils/request";
// 上传图片
export const uploadCoverUrlApi = (formData: any) => {
    return request.post<{ url: string }>('/media/upload', formData)
}