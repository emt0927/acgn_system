<template>
    <n-modal v-model:show="visible" :title="detail?.title" preset="card" :style="{ width: '450px' }"
        :segmented="{ content: true, footer: true }" :content-style="{ padding: 0 }">
        <template #header-extra>
            <n-button size="small" quaternary type="primary" @click="handleEdit">
                编辑系列
            </n-button>
            <n-button size="small" quaternary type="error" @click="handleDel">
                删除系列
            </n-button>
        </template>
        <div class=" max-h-130 overflow-x-hidden overflow-y-auto">
            <div class="border-gray-200 border-b" v-for="field in activeSchema" :key="field.key">
                <div class="flex py-3 px-6">
                    <span class="text-sm font-bold mr-3 w-16 shrink-0">{{ field.label }} :</span>
                    <n-image v-if="field.type === 'url'" :img-props="{
                        class: 'max-w-[220px] max-h-[220px] w-auto h-auto rounded-lg object-contain'
                    }" :src="detail?.[field.key]"></n-image>
                    <div class="flex" v-else-if="field.type === 'tags'">
                        <n-tag type="success" v-for="item in detail?.[field.key]" class="mr-2">
                            {{ item }}
                        </n-tag>
                    </div>
                    <n-ellipsis style="max-width: 100%" :line-clamp="2" v-else-if="field.type === 'comment'">
                        {{ detail?.[field.key] }}
                    </n-ellipsis>
                    <div v-else>{{ detail?.[field.key] }}</div>
                </div>
            </div>
        </div>
    </n-modal>
</template>

<script setup lang="ts">
import type { SeriesDetail } from '@/types/acgn';
import { computed } from 'vue';
import { SERIES_SCHEMAS } from '../Schema';

const props = defineProps<{
    detail: SeriesDetail | null
    show: boolean

}>()
const emit = defineEmits(['update:show', 'open-edit', 'del-show'])
// modal开关
const visible = computed({
    get: () => props.show,
    set: (val) => emit('update:show', val)
})
// 编辑回显
const handleEdit = () => {
    emit('open-edit', props.detail)
}
// 删除回显
const handleDel = () => {
    emit('del-show', props.detail?.id)
}
// 校验
const hasValue = (val: any) => {
    if (val === undefined || val === null || val === '') return false
    return true
}
const activeSchema = computed(() => {
    const item = props.detail as SeriesDetail
    return SERIES_SCHEMAS.filter(Field => hasValue(item[Field.key]))
})
</script>

<style scoped></style>