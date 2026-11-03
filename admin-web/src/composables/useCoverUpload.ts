import { uploadCoverUrlApi } from '@/api/upload'
import { urlToFile } from '@/utils/file'
import type { UploadFileInfo } from 'naive-ui'
import { ref } from 'vue'
export const useCoverUpload = () => {
    const fileList = ref<UploadFileInfo[]>([])
    const rawFile = ref<File | null>(null) // 专门在外面存原生文件的响应式变量
    const setPreviewCover = (url?: string, file: File | null = null) => {
        rawFile.value = file
        fileList.value = url ? [{
            id: 'existing.cover',
            name: '封面图',
            status: 'finished',
            url
        }] : []
    }
    const setCoverFromRemoteUrl = async (url: string) => {
        const file = await urlToFile(url)
        setPreviewCover(url, file)
    }
    const handleFileChange = (
        { file }: { file: UploadFileInfo },
        onUrlUpdate: (val: string) => void
    ) => {
        if (file.status !== 'removed' && file.file) {
            rawFile.value = file.file
            onUrlUpdate(file.name)
        } else {
            rawFile.value = null
            onUrlUpdate('')
        }
    }
    const uploadIfNeeded = async (currentUrl: string) => {
        if (!rawFile.value) return currentUrl
        const formData = new FormData()
        formData.append('file', rawFile.value)
        const res = await uploadCoverUrlApi(formData)
        return res.data?.url || currentUrl
    }
    return {
        fileList,
        rawFile,
        setPreviewCover,
        setCoverFromRemoteUrl,
        handleFileChange,
        uploadIfNeeded,
    }
}