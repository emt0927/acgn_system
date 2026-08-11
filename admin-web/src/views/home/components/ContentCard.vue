<template>
    <div
        class=" cursor-pointer group flex flex-col w-full relative rounded-lg bg-item  shadow-[0_2px_8px_rgba(0,0,0,0.04)] transition duration-200 ease-in-out hover:-translate-y-0.5  hover:shadow-[0_6px_16px_rgba(0,0,0,0.08)]">
        <div class="flex justify-between absolute w-full top-0 left-0 pointer-events-none z-10">
            <div class="titleTag">
                {{ item.subTypeLabel }}</div>
            <div class="titleTag">
                {{ item.statusLabel }}</div>
        </div>
        <div class="overflow-hidden rounded-t-lg aspect-3/4 bg-muted">
            <span class="transition-opacity w-full h-full block ease-out duration-150"
                :class="true ? 'opacity-100' : 'opacity-0'">
                <img src="@/assets/ldws.jpg" alt=""
                    class="w-full h-full  block object-cover transition duration-300 ease-in-out group-hover:scale-[1.04]">
            </span>
        </div>
        <div class="text-[12px] p-1.5">
            <div class="description_title truncate">{{ item.title }}</div>
            <n-progress type="line" :percentage="percentage">{{ displayText }}</n-progress>

            <div class="flex items-center"> <n-rate readonly :size="12" :default-value="item.rating"
                    class="max-w-full" />
                <div class="pl-0.75 h-5 pt-0.5 shrink-0 whitespace-nowrap">{{ item.rating }}分</div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { MediaCardItem } from '@/types/acgn';
import { computed } from 'vue';
const props = defineProps<{
    item: MediaCardItem
}>()
// 进度
const percentage = computed(() => {
    const { current, total } = props.item.progress
    if (total && total > 0) {
        return Math.min(100, Math.round((current / total) * 100))
    }
    return Math.min(100, current)
})
// 文字进度
const displayText = computed(() => {
    const { current, total, unit, text } = props.item.progress
    //优先使用自定义文本
    if (text) return text
    if (total) return `${current}/${total}${unit || ''}`
    return `${current}${unit || ''}`
})
</script>

<style scoped>
@reference "@/style.css";

.titleTag {
    @apply py-0.5 px-1.5 text-[11px] rounded bg-black/55 text-white backdrop-blur-[2px] truncate;
}
</style>