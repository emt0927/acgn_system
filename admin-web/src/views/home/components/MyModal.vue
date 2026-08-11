<template>
    <n-modal v-model:show="showModal" preset="card" title="noname" :style="{ width: '450px', height: '600px' }" content-scrollable :segmented="{ content: true, footer: true }">
        <p v-for="i in 30" :key="i" style="margin: 0 0 8px 0">
            第 {{ i }} 行内容，只有这里会滚动。
        </p>
    </n-modal>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const showModal = ref(true)
</script>

<style scoped></style>