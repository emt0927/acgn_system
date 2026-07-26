import { defineStore } from "pinia";
import { ref } from "vue";

export const useUserStore = defineStore('acng_system', () => {
    const token = ref('')
    // 设置token  
    const setToken = (data: string) => {
        token.value = data
    }
    return { token, setToken }
}, {
    persist: true
})