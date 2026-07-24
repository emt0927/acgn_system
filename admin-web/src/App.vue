<script setup lang="ts">
import { NConfigProvider, zhCN, dateZhCN } from 'naive-ui'
</script>

<template>
    <n-config-provider :locale="zhCN" :date-locale="dateZhCN" class="config-provider">
        <router-view></router-view>
    </n-config-provider>

</template>
<style scoped>
.config-provider {
    height: 100%;
    /* 或者 100vh */
    width: 100%;
}
</style>