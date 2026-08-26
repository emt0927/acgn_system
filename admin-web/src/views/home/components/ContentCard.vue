<template>
    <div @click="handleCardClick"
        class=" cursor-pointer group flex flex-col w-full relative rounded-lg bg-item  shadow-[0_2px_8px_rgba(0,0,0,0.04)] transition duration-200 ease-in-out hover:-translate-y-0.5  hover:shadow-[0_6px_16px_rgba(0,0,0,0.08)]">
        <div class="flex justify-between absolute w-full top-0 left-0 pointer-events-none z-10">
            <div class="titleTag">
                {{ item.subType }}</div>
            <div class="titleTag">
                {{ getStatusLabel(item.type, item.status) }}</div>
        </div>
        <div class="overflow-hidden rounded-lg aspect-3/4 bg-muted relative">
            <span class="transition-opacity w-full h-full block ease-out duration-150"
                :class="true ? 'opacity-100' : 'opacity-0'">
                <img src="@/assets/ldws.jpg" alt=""
                    class="w-full h-full  block object-cover transition duration-300 ease-in-out group-hover:scale-[1.04]">
            </span>
            <div v-if="!item.progress.text" class="absolute right-0 bottom-0 titleTag">{{ displayText }}</div>
        </div>
        <div class="text-[12px] p-1.5">
            <div class="description_title truncate">{{ item.title }}</div>

            <div class="flex items-center"> <n-rate readonly allow-half :size="12" :value="(item.rating ?? 0) / 2"
                    class="max-w-full" />
                <div class="pl-0.75 h-5 pt-0.5 shrink-0 whitespace-nowrap">{{ item.rating }}分</div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { MediaCardItem } from '@/types/acgn';
import { computed } from 'vue';
import { getStatusLabel } from '../Schema';
const props = defineProps<{
    item: MediaCardItem
}>()
const emit = defineEmits<{
    (e: 'click', itemId: number): void // 点击卡片看详情
}>()
// 点击查看作品详情
const handleCardClick = () => {
    emit('click', props.item.id)
}

// 文字进度
const displayText = computed(() => {
    if (!props.item.progress) return
    const { current, total } = props.item.progress
    return `${current || '--'}/${total || '--'}话`
})
</script>

<style scoped>
@reference "@/style.css";

.titleTag {
    @apply py-0.5 px-1.5 text-[11px] rounded bg-black/55 text-white backdrop-blur-[2px] truncate;
}
</style>