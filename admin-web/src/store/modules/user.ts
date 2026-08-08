import { useDark, useToggle } from "@vueuse/core";
import { defineStore } from "pinia";
import { ref } from "vue";

export const useUserStore = defineStore('acng_system', () => {
    const token = ref('')
    // 设置token  
    const setToken = (data: string) => {
        token.value = data
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
    return { token, setToken, isDark, toggleDark }
}, {
    persist: true
})