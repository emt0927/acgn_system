<template>
    <MyCard>
        <template #cardTab>
            作品系列
        </template>
        <template #action>
            <div class="flex justify-between">
                <div class="flex items-center cursor-pointer">
                    <div :class="['mr-10', defaultSelect === item.value ? 'text-[#4B9E5F]' : '']"
                        v-for="item in acgnSelect" :key="item.id" @click="setSelect(item.value)">{{ item.label }}</div>
                </div>
                <n-button type="tertiary" @click="setSeries">
                    添加系列
                </n-button>

            </div>
        </template>
        <div class="flex flex-col justify-between w-full pt-5">
            <div
                class="flex-1 content-start grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-4 px-5 py-0  min-h-0 overflow-y-auto">
                <Content v-for="item in seriesList" :key="item.id" :item=item @click="openDetail"></Content>
            </div>
            <div class="pagination-footer"><n-pagination v-model:page="page" :page-size="pageSize"
                    :item-count="total" />
            </div>
        </div>
        <SeriesModal v-model:show="showDetail" :detail="selectedItem" @open-edit="SeriesEdit"
            @openSeriesItem="getSeriesItem">
        </SeriesModal>
        <SeriesDrawer v-model:show="active" :detail="seriesItem" @setSeriesData="setSeriesData"></SeriesDrawer>
        <SeriesItemModal v-model:show="SeriesItemShow" :list="SeriesList" @update-Series="updateSeries"
            :newList="newSeriesList" :title="seriesTitle">
        </SeriesItemModal>
    </MyCard>
</template>

<script setup lang="ts">
import MyCard from '@/components/MyCard.vue';
import { computed, ref } from 'vue';
import Content from './components/Content.vue';
import type { AcgnType, MediaCardItem, Series, SeriesDetail } from '@/types/acgn.ts';
import SeriesModal from './components/SeriesModal.vue';
import SeriesDrawer from './components/SeriesDrawer.vue';
import SeriesItemModal from './components/SeriesItemModal.vue';
import { addSeriesApi, getSeriesAndMediaApi, getSeriesDetailApi, getSeriesListApi, putSeriesDetailApi } from '@/api/serires.ts';
// 当前的系列id
const SeriesId = ref<string>('')
// 获取向系列添加作品需要的数据
const SeriesItemShow = ref(false)

// 初始作品数据
const mediaList = ref<MediaCardItem[] | null>(null)
const MediaData = async () => {
    const res = await getMediaListApi()
    mediaList.value = res.data?.list ?? []
}
MediaData()
const Type = ref<AcgnType | null>(null)
// 该系列相关联的数据
const newSeriesList = ref<MediaCardItem[] | null>(null)
const seriesTitle = ref('')
const getSeriesItem = async (id: string, type: AcgnType, title: string) => {
    Type.value = type
    SeriesId.value = id
    seriesTitle.value = title
    // 系列相关联的作品
    const res = await getSeriesAndMediaApi(id)
    newSeriesList.value = res.data?.mediaList ?? []
    SeriesItemShow.value = true
}
// 清洗后的作品数据
const SeriesList = computed<MediaCardItem[]>(() => {
    if (!Type.value) return []
    return mediaList.value?.filter(item => {
        // 过滤出同类型并且没有系列或者是其他系列的作品
        const isSameType = item.type === Type.value
        const isCurrentOrNoSeries = item.seriesId === '' || item.seriesId !== SeriesId.value
        return isSameType && isCurrentOrNoSeries
    }) ?? []
})
// 快速修改作品的类型
const updateSeries = async (id: string, show: string) => {
    if (show === 'add') {
        // 添加类型
        await updateMediaOrSreiesApi(id, SeriesId!.value)
    } else {
        // 取消类型
        console.log(id);
        await updateMediaOrSreiesApi(id, '')
    }

    await Promise.allSettled([MediaData(), SeriesorMediaData()])
    message.success('修改成功')

}
// 系列关联的作品 
const SeriesorMediaData = async () => {
    const res = await getSeriesAndMediaApi(SeriesId.value)
    newSeriesList.value = res.data?.mediaList ?? []
}
// 抽屉开关
const active = ref(false)
//传递给抽屉组件的系列相关数据
const seriesItem = ref<SeriesDetail | null>(null)
// 新增系列
const setSeries = () => {
    seriesItem.value = null
    active.value = true
}
// 编辑系列
const SeriesEdit = (detail: SeriesDetail) => {
    seriesItem.value = detail
    active.value = true
}
// 抽屉组件传递回来的系列数据
import { useMessage } from 'naive-ui'
import { getMediaListApi, updateMediaOrSreiesApi } from '@/api/media.ts';
const message = useMessage()
const setSeriesData = async (data: any) => {
    if (data.id) {
        const res = await putSeriesDetailApi(data)
        message.success(res.message)
    } else {
        const res = await addSeriesApi(data)
        message.success(res.message)
    }
    active.value = false
    showDetail.value = false
    // 刷新数据
    getSeriesList()
}
// 页数
const page = ref(1)
const pageSize = ref(12)
const total = ref(0)
// 默认选中
const defaultSelect = ref('all')
// 类型选择
const acgnSelect = ref([
    {
        id: 0,
        label: '全部',
        value: 'all'
    },
    {
        id: 1,
        label: '动漫',
        value: 'anime'
    },
    {
        id: 2,
        label: '漫画',
        value: 'manga'
    },
    {
        id: 3,
        label: '小说',
        value: 'novel'
    },
    {
        id: 4,
        label: '游戏',
        value: 'game'
    },
])
// 类型过滤
const setSelect = (key: string) => {
    defaultSelect.value = key
}
// 系列数据
const seriesList = ref<Series[]>()
// 获取系列列表
const getSeriesList = async () => {
    const res = await getSeriesListApi({ page: page.value, pageSize: pageSize.value })
    seriesList.value = res.data?.list
    total.value = res.data!.total
    console.log('我触发了');
}
getSeriesList()
// 详情开关
// 传递给详情页的数据
const selectedItem = ref<SeriesDetail | null>(null)
const showDetail = ref(false)
const openDetail = async (id: string) => {
    const res = await getSeriesDetailApi(id)
    selectedItem.value = res.data ?? null
    showDetail.value = true

}
</script>

<style scoped>
.pagination-footer {
    padding: 10px 0;
    display: flex;
    justify-content: flex-end;
    /* 右对齐 */

}
</style>