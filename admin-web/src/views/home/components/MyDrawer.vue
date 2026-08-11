<template>
    <n-drawer v-model:show="active" :width="502" placement="right">
        <n-drawer-content title="斯通纳" closable>
            《斯通纳》是美国作家约翰·威廉姆斯在 1965 年出版的小说。
        </n-drawer-content>
    </n-drawer>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const active = ref(false)
</script>

<style scoped></style>