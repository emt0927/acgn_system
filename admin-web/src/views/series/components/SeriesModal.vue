<template>
    <n-modal v-model:show="visible" preset="card" :style="{ width: '450px' }"
        :segmented="{ content: true, footer: true }" :content-style="{ padding: 0 }">
        <template #header>
            <n-ellipsis style="max-width: 150px">
                {{ detail?.title }}
            </n-ellipsis>
        </template>
        <template #header-extra>
            <n-button size="small" quaternary type="info" @click="setSeriesItem">
                添加作品
            </n-button>
            <n-button size="small" quaternary type="primary" @click="handleEdit">
                编辑系列
            </n-button>
            <n-button size="small" quaternary type="error" @click="handleDel">
                删除系列
            </n-button>
        </template>
        <div class="max-h-130 overflow-x-hidden overflow-y-auto">
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
                    <div v-else-if="field.type === 'date'">
                        <n-time v-if="detail?.[field.key]" :time="new Date(detail[field.key] as string)"
                            format="yyyy-MM-dd HH:mm" />
                    </div>
                    <div v-else>{{ detail?.[field.key] }}</div>
                </div>
            </div>
        </div>
    </n-modal>
</template>

<script setup lang="ts">
import type { SeriesDetail } from '@/types/acgn';
import { computed, h, ref } from 'vue';
import { SERIES_SCHEMAS } from '../Schema';
import { deleteSeriesApi, getSeriesAndMediaApi, getSeriesDetailApi } from '@/api/serires';
import { useDialog, useMessage } from 'naive-ui';
import { trackRecordApi } from '@/api/record';
const detail = ref<SeriesDetail | null>(null)
// modal开关
const visible = ref(false)
const open = async (id: string) => {
    try {
        const res = await getSeriesDetailApi(id)
        detail.value = res.data ?? null
        console.log(detail.value, 'detail');
    } catch (error) {

    }
    visible.value = true
}
const emit = defineEmits(['open-edit', 'open-SeriesItem', 'del-success'])

defineExpose({ open })
// 向系列里添加作品
const setSeriesItem = () => {
    emit('open-SeriesItem', detail.value?.id, detail.value?.type, detail.value?.title)
}
// 编辑回显
const handleEdit = () => {
    visible.value = false
    emit('open-edit', detail.value)
}
// 删除回显
const dialog = useDialog()
const message = useMessage()
const handleDel = async () => {
    if (!detail.value) return
    const { id, title } = detail.value
    const executeDelete = async () => {
        const del = await deleteSeriesApi(id)
        message.success(del.message)
        await trackRecordApi('series', title, 'clear') // 无论哪个分支，删完都能稳稳记上日志！
        visible.value = false // 自己把详情弹窗关掉
        emit('del-success') 
    }
    const res = await getSeriesAndMediaApi(id)
    const list = res.data?.mediaList ?? []
    if (list.length > 0) {
        dialog.warning({
            title: '警告',
            content: () => {
                const mediaNames = list.map((item: any) => typeof item === 'string' ? item : (item.title || item.name)).join('、')
                return h('div', null, [h('p', { style: 'margin-bottom: 8px;' }, '该系列存在关联作品，强行删除后以下作品将失去所属系列：'),
                h('div', {
                    style: 'color: #d03050; font-weight: bold; background: rgba(208, 48, 80, 0.08); padding: 8px 12px; border-radius: 4px; word-break: break-all;'
                }, mediaNames || '无关联作品信息')])
            },
            positiveText: '确定',
            negativeText: '不确定',
            draggable: true,
            onPositiveClick: async () => {
                await executeDelete()
            },
        })
    } else {
        await executeDelete()
    }
}
// 校验
const hasValue = (val: any) => {
    if (val === undefined || val === null || val === '' || val.length === 0) return false
    return true
}
const activeSchema = computed(() => {
    const item = detail.value as SeriesDetail
    if (!item) return []
    return SERIES_SCHEMAS.filter(Field => hasValue(item[Field.key]))
})
</script>

<style scoped></style>