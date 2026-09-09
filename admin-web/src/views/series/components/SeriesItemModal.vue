<template>
    <n-modal v-model:show="acitve" :title="`添加作品(${title})`" preset="card" :style="{ width: '450px' }"
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
import type { MediaCardItem } from '@/types/acgn';
const props = defineProps<{
    list: MediaCardItem[] | null,
    newList: MediaCardItem[] | null,
    title: string
}>()
const emit = defineEmits(['update-Series'])
// 开启组件
const acitve = defineModel<boolean>('show', { required: true })
// 回传id 等待修改系列
const updateSeriesId = (id: string, show: string) => {
    emit('update-Series', id, show)
}

</script>

<style scoped></style>