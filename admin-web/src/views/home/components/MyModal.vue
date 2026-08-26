<template>
    <n-modal v-model:show="visible" :title="item?.title" preset="card" :style="{ width: '450px' }"
        :segmented="{ content: true, footer: true }" :content-style="{ padding: 0 }">
        <template #header-extra>
            <n-button size="small" quaternary type="primary" @click="handleEdit">
                编辑作品
            </n-button>
            <n-button size="small" quaternary type="error" @click="handleDel">
                删除作品
            </n-button>
        </template>
        <div class=" max-h-130 overflow-x-hidden overflow-y-auto">
            <div class="border-gray-200 border-b" v-for="field in activeSchema" :key="field.key">
                <div class="flex py-3 px-6">
                    <span class="text-sm font-bold mr-3 w-16 shrink-0">{{ field.label }} :</span>
                    <n-button v-if="field.type === 'link'" text type="primary">
                        {{ item?.[field.key] }}
                    </n-button>
                    <n-image v-else-if="field.type === 'url'" :img-props="{
                        class: 'max-w-[220px] max-h-[220px] w-auto h-auto rounded-lg object-contain'
                    }" :src="ldwsImg" />
                    <div v-else-if="field.type === 'rating'" class="flex items-center">
                        <n-rate readonly allow-half :value="Number(item?.[field.key]) / 2" />
                        <span class="ml-1">{{ item?.[field.key] }}分</span>
                    </div>
                    <div v-else-if="field.type === 'state'">
                        {{ getAcgnStatusText }}
                    </div>
                    <div v-else-if="field.type === 'progress'">
                        {{ progressText }}
                    </div>
                    <div v-else>{{ item?.[field.key] }}</div>
                </div>
            </div>
        </div>
    </n-modal>
</template>

<script setup lang="ts">
// 测试图片
import ldwsImg from '@/assets/ldws.jpg'

const emit = defineEmits(['update:show', 'open-edit', 'del-show'])
import type { AcgnStatus, MediaCardDetail } from '@/types/acgn';
import { computed } from 'vue';
import { FIELD_SCHEMAS } from '../Schema';
const props = defineProps<{
    show: boolean,
    item: MediaCardDetail | null
}>()
const visible = computed({
    get: () => props.show,
    set: (val) => emit('update:show', val)
})

// 编辑回显
const handleEdit = () => {
    emit('open-edit', props.item)
}
// 删除回显
const handleDel = () => {
    emit('del-show', props.item?.id)
}

// 进度展示
const progressText = computed(() => {
    const { progress } = props.item as MediaCardDetail
    if (!progress) return '暂无进度'
    if (progress.text) return progress.text
    return `${progress.current || '--'}/${progress.total || '--'}话`
})
// 校验
const hasValue = (val: any) => {
    if (val === undefined || val === null || val === '') return false
    return true
}
const activeSchema = computed(() => {
    // 类型收紧
    const item = props.item
    if (!item) return []
    const rawSchema = FIELD_SCHEMAS[item.type] || []
    return rawSchema.filter(field => hasValue(item[field.key]))
})

// 状态文字
const getAcgnStatusText = computed(() => {
    const { type, status } = props.item as MediaCardDetail
    const isGame = type === 'game'
    const stateMap: Record<AcgnStatus, { game: string, default: string }> = {
        'wish': { game: '准备玩', default: '准备追' },
        'doing': { game: '正在玩', default: '正在追' },
        'done': { game: '已通关', default: '已追完' },
        'dropped': { game: '已退坑', default: '已弃坑' }
    }
    return stateMap[status]?.[isGame ? 'game' : 'default'] ?? ''
})
</script>

<style scoped></style>