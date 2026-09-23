import { loginApi } from "@/api/admin";
import { getUserInfoApi } from "@/api/user";
import { useDark, useToggle } from "@vueuse/core";
import { defineStore } from "pinia";
import { ref } from "vue";

export const useUserStore = defineStore('acng_system', () => {
    // 短期token
    const accessToken = ref('')
    // 长期token
    const refreshToken = ref('')
    // 设置token  
    const loginAction = async (data: any) => {
        const res = await loginApi(data)
        console.log(res.data);
        if (res.code === 200) {
            accessToken.value = res.data!.accessToken
            refreshToken.value = res.data!.refreshToken
            // 获取个人信息
            await getUserinfoData()
        }
        return res
    }
    // 清空一切 退出登录
    const logout = () => {
        accessToken.value = ''
        refreshToken.value = ''
        userInfo.value = { username: '', nickname: '', coverurl: '' }
        typeObj.value = {
            type: 'all',
            status: 'all',
            seriesType: 'all'
        }
    }
    // 个人资料
    const userInfo = ref({
        username: '',
        nickname: '',
        coverurl: ''
    })
    const getUserinfoData = async () => {
        try {
            console.log(accessToken.value, '我是token');
            if (!accessToken.value) return
            const res = await getUserInfoApi()
            console.log(res.data);
            userInfo.value = res.data
        } catch (error) {
            console.error('获取用户信息失败', error)
        }
    }
    const typeObj = ref({
        type: 'all',
        status: 'all',
        seriesType: 'all'
    })
    const updatetypeObj = (data: any) => {
        Object.assign(typeObj.value, data)
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
    return {
        accessToken, refreshToken, loginAction, isDark, toggleDark, logout, typeObj, updatetypeObj, userInfo,
        getUserinfoData,
    }
}, {
    persist: true
})