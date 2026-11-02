<template>
    <n-modal v-model:show="acitve" :title="`添加作品(${Title})`" preset="card" :style="{ width: '450px' }"
        :segmented="{ content: true, footer: true }" :content-style="{ padding: 0 }">
        <div class="flex h-80 w-full">
            <div class="w-1/2 max-h-80 overflow-auto px-2">
                <div v-if="list!.length === 0" class="h-full w-full flex items-center justify-center">
                    <n-empty description="暂无数据">
                    </n-empty>
                </div>
                <template v-else>
                    <div class="flex justify-between border-b border-gray-200 last:border-b-0 py-2" v-for="item in list"
                        :key="item.id">
                        <n-ellipsis style="max-width:100%">
                            {{ item.title }}
                        </n-ellipsis>
                        <n-button quaternary size="tiny" @click="updateSeriesId(item.id, 'add')">
                            添加
                        </n-button>
                    </div>
                </template>
            </div>
            <n-divider vertical style="height: 100%" />
            <div class="w-1/2 max-h-80 overflow-auto px-2">
                <div v-if="newList!.length === 0" class="h-full w-full flex items-center justify-center">
                    <n-empty description="暂无数据">
                    </n-empty>
                </div>
                <template v-else>
                    <div class="flex justify-between border-b border-gray-200 last:border-b-0 py-2"
                        v-for="item in newList" :key=item.id>
                        <n-ellipsis style="max-width:100%">
                            {{ item.title }}
                        </n-ellipsis>
                        <n-button quaternary size="tiny" @click="updateSeriesId(item.id, 'delete')">
                            移除
                        </n-button>
                    </div>
                </template>
            </div>
        </div>
    </n-modal>
</template>

<script setup lang="ts">
import { getMediaListApi, updateMediaOrSreiesApi } from '@/api/media';
import { getSeriesAndMediaApi } from '@/api/serires';
import type { MediaCardItem } from '@/types/acgn';
import { useMessage } from 'naive-ui';
import { ref } from 'vue';

const emit = defineEmits(['update-Series'])
// 回传id 等待修改系列
const updateSeriesId = async (id: string, action: 'add' | 'delete') => {
    const targetSeriesId = action === 'add' ? seriesId.value : ''
    await updateMediaOrSreiesApi(id, targetSeriesId)
    await fetchLists()
    message.success(action === 'add' ? '添加成功' : '移除成功')
}
const message = useMessage()
const acitve = ref(false)
const newList = ref<MediaCardItem[]>([])
const list = ref<MediaCardItem[]>([])
const Title = ref('')
const seriesId = ref('')
const seriesType = ref('')
const fetchLists = async () => {
    // 获取初始数据和系列相关联的作品
    const [mediaRes, seriesRes] = await Promise.all([getMediaListApi(), getSeriesAndMediaApi(seriesId.value)])
    list.value = mediaRes.data?.list.filter(item => {
        const isSameType = item.type === seriesType.value
        const isCurrentOrNoSeries = item.seriesId === '' || item.seriesId !== seriesId.value
        return isSameType && isCurrentOrNoSeries
    }) ?? []
    newList.value = seriesRes.data?.mediaList ?? []
}
const open = async (data: any) => {
    if (!data) return
    const { id, type, title } = data
    Title.value = title
    seriesId.value = id
    seriesType.value = type
    acitve.value = true
    await fetchLists()
}
defineExpose({ open })
</script>

<style scoped></style>