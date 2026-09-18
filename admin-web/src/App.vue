<script setup lang="ts">
import { NConfigProvider, NDialogProvider, NMessageProvider, zhCN, dateZhCN, darkTheme } from 'naive-ui'
import { useUserStore } from './store';
const userStore = useUserStore()
</script>

<template>
    <n-config-provider :locale="zhCN" :date-locale="dateZhCN" class="config-provider"
        :theme="userStore.isDark ? darkTheme : null">
        <n-message-provider :max="3">
            <n-dialog-provider>
                <router-view></router-view>
            </n-dialog-provider>
        </n-message-provider>
    </n-config-provider>
</template>
<style scoped>
.config-provider {
    height: 100dvh;
    width: 100vw;
}

/* 通过 :theme="darkTheme" 和 类名 dark 实现主题切换 */
</style>