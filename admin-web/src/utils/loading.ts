import { ref } from "vue";

export const isLoading = ref(false)
// loading计数
let requestCount = 0

// 开启
export const showLoading = () => {
    if (requestCount === 0) {
        isLoading.value = true
    }
    requestCount++
}
// 关闭
export const hideLoading = () => {
    if (requestCount <= 0) return
    requestCount--
    if (requestCount === 0) {
        isLoading.value = false
    }
}