<template>
    <n-modal v-model:show="showModal" preset="card" :style="{ width: '550px' }" :title="data?.seriesInfo.title"
        :segmented="{ content: true, footer: true }" :content-style="{ padding: 0 }" :auto-focus="false"
        :trap-focus="false">
        <div class="max-h-130 overflow-x-hidden overflow-y-auto">
            <div class="flex p-5">
                <div class="w-[50%] shrink-0">
                    <div v-for="item in series" :key="item.key">
                        <div class="w-full h-70" v-if="item.type === 'url'">
                            <img class="w-full h-full object-contain" :src="(data?.seriesInfo[item.key] as string)"
                                alt="">
                        </div>
                        <div class="flex py-2" v-if="!item.hideInDetail">
                            <span class="text-sm mr-3  shrink-0">{{ item.label }}:</span>
                            <div v-if="item.type === 'tags'" class="flex flex-wrap">
                                <n-tag type="success" v-for="tag in data?.seriesInfo?.[item.type]" class="m-1">
                                    {{ tag }}
                                </n-tag>
                            </div>
                            <n-ellipsis style="max-width: 100%" v-else-if="item.type === 'comment'">
                                {{ data?.seriesInfo?.[item.key] }}
                            </n-ellipsis>
                            <div v-else>{{ data?.seriesInfo?.[item.key] }}</div>
                        </div>
                    </div>


                </div>
                <div class="ml-5 flex-1">
                    <div class="flex justify-between">
                        <div class="text-sm font-bold shrink-0">相关作品</div>
                        <div>按钮</div>
                    </div>
                    <div class="flex flex-col max-h-80 overflow-hidden">
                        <div class="border border-gray-100 p-1 rounded-md" v-for="item in mediaList" :key="item.id">
                            <div class="flex">
                                <img :src="item.coverUrl" alt="" class="w-15 mr-2">
                                <div>
                                    <div class="text-xs">{{ item.title }}</div>
                                    <div class="text-xs">{{ item.subType }}</div>
                                    <div class="flex items-center"> <n-rate readonly allow-half :size="12"
                                            :value="(item.rating ?? 0) / 2" class="max-w-full" />
                                        <div class="text-xs h-5 shrink-0 whitespace-nowrap">{{ item.rating || '暂无评' }}分
                                        </div>
                                    </div>
                                    <div class="text-xs">于<n-time :time="new Date(item.updatedAt as string)" />录入</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    </n-modal>
</template>

<script setup lang="ts">
import type { SeriesWithMediaData } from '@/api/serires';
import { SERIES_SCHEMAS } from '@/views/series/Schema';
import { computed } from 'vue';

const props = defineProps<{
    data: SeriesWithMediaData | undefined
}>()
const series = computed(() => {
    const data = props.data?.seriesInfo
    if (!data) return []
    const rawSchema = SERIES_SCHEMAS || []
    return rawSchema.filter(field => disableVal(data[field.key]))
})
const mediaList = computed(() => {
    return props.data?.mediaList
})
const disableVal = (val: any) => {
    if (val === undefined || val === '' || val === null) return false
    return true
}

const showModal = defineModel<boolean>('show', { required: true })
</script>

<style scoped></style>