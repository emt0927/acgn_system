<template>
    <n-card class="card">
        <div class="header">
            <slot name="cardTab"> #header-extra</slot>
        </div>
        <div class="action">
            <slot name="action">@action</slot>
        </div>
        <slot>卡片内容</slot>
    </n-card>
</template>

<script setup lang="ts">
// cardTab为自定义顶栏分类
// action为状态与控制条
// 默认slot为内容
</script>

<style scoped lang="scss">
.card {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
}

.header {
    padding: 20px 24px;
    margin: -20px -24px 0 -24px;
}

.action {
    padding: 20px 24px;
    background-color: #fafafc;
    // margin: 0 -24px 16px -24px;
    margin: 0 -24px;
}
</style>