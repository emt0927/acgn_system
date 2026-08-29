<template>
    <n-modal v-model:show="acitve" :title="'添加作品'" preset="card" :style="{ width: '450px' }"
        :segmented="{ content: true, footer: true }" :content-style="{ padding: 0 }">
        <div class="max-h-130 overflow-x-hidden overflow-y-auto">
            <n-transfer v-model:value="value" :options="options" />
            <div class="m-2 flex justify-end"><n-button @click="handleConfirm">确认</n-button></div>
        </div>
    </n-modal>
</template>

<script setup lang="ts">
import type { MediaCardItem } from '@/types/acgn';
import { computed, ref, watch } from 'vue';
const props = defineProps<{
    list: MediaCardItem[] | null
    id: number | null | string
}>()
// 开启组件
const acitve = defineModel<boolean>('show', { required: true })
const options = computed(() => {
    const list = props.list
    return list?.map(item => {
        return {
            label: item.title,
            value: item.id
        }
    })
})
const emit = defineEmits(['save'])
const value = ref<(string | number)[]>([])
watch([() => props.list, () => props.id], () => {
    if (!props.list) return
    value.value = props.list.filter(item => item.seriesId === props.id).map(item => item.id)
}, { immediate: true })
const handleConfirm = () => {
    // 保存最初的数组
    const initialKeys = props.list?.filter(item => item.seriesId === props.id).map(item => item.id)
    // 经过增删后的数组
    const currentKeys = value.value
    // 将期间被踢掉的项摘出来
    const removedKeys = initialKeys?.filter(id => !currentKeys.includes(id))

    // 为最终保留的作品添加系列id
    currentKeys.forEach(id => {
        const target = props.list?.find(item => item.id === id)
        if (target) {
            target.seriesId = props.id as number
        }
    })
    // 将踢掉的作品的系列id清空
    removedKeys?.forEach(id => {
        const target = props.list?.find(item => item.id === id)
        if (target) {
            target.seriesId = null
        }
    })
    emit('save', currentKeys)
}

</script>

<style scoped></style>