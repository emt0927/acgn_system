import type { tokenData } from "@/api/admin";
import { useDark, useToggle } from "@vueuse/core";
import { defineStore } from "pinia";
import { ref } from "vue";

export const useUserStore = defineStore('acng_system', () => {
    // 短期token
    const accessToken = ref('')
    // 长期token
    const refreshToken = ref('')
    // 设置token  
    const setToken = (data: tokenData) => {
        accessToken.value = data.accessToken
        refreshToken.value = data.refreshToken
    }
    // 清空token
    const clearToken = () => {
        accessToken.value = ''
        refreshToken.value = ''
    }

    // theme 
    const isDark = useDark({
        storageKey: 'acgn-theme'
    })
    // document.startViewTransition
    const toggleDark = (event?: MouseEvent) => {
        // 如果浏览器不支持 View Transitions，直接普通切换
        if (!document.startViewTransition) {
            isDark.value = !isDark.value
            return
        }

        // 开启原生视图过渡
        document.startViewTransition(() => {
            isDark.value = !isDark.value
        })
    }
    return { accessToken, refreshToken, setToken, isDark, toggleDark, clearToken }
}, {
    persist: true
})