<script setup lang="ts">
import { NConfigProvider, NMessageProvider, zhCN, dateZhCN } from 'naive-ui'
</script>

<template>
    <n-config-provider :locale="zhCN" :date-locale="dateZhCN" class="config-provider">
        <n-message-provider>
            <router-view></router-view>
        </n-message-provider>
    </n-config-provider>

</template>
<style scoped>
.config-provider {
    height: 100dvh;
    width: 100vw;
}
</style>