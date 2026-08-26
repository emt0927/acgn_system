<template>
    <div @click="handleClick"
        class="cursor-pointer group flex flex-col w-full relative rounded-lg bg-item  shadow-[0_2px_8px_rgba(0,0,0,0.04)] transition duration-200 ease-in-out hover:-translate-y-0.5  hover:shadow-[0_6px_16px_rgba(0,0,0,0.08)]"">
       <div class=" overflow-hidden rounded-lg aspect-3/4 bg-muted relative">
        <span class="transition-opacity w-full h-full block ease-out duration-150"
            :class="true ? 'opacity-100' : 'opacity-0'">
            <img src="@/assets/ldws.jpg" alt=""
                class="w-full h-full  block object-cover transition duration-300 ease-in-out group-hover:scale-[1.04]">
        </span>
    </div>
    <div class="text-[14px] p-1.5 min-h-12.5">
        <n-ellipsis style="max-width: 100%">
            {{ item.title }}
        </n-ellipsis>
    </div>
    </div>
</template>

<script setup lang="ts">
import type { Series } from '@/types/acgn';

const props = defineProps<{
    item: Series
}>()
const emit = defineEmits(['click'])
const handleClick = () => {
    emit('click', props.item.id)
}
</script>

<style scoped></style>