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
            <div class="pagination-footer"><n-pagination v-model:page="page" :page-size="12" :item-count="100" />
            </div>
        </div>
        <SeriesModal v-model:show="showDetail" :detail="selectedItem" @open-edit="SeriesEdit"
            @openSeriesItem="getSeriesItem">
        </SeriesModal>
        <SeriesDrawer v-model:show="active" :detail="seriesItem" @setSeriesData="setSeriesData"></SeriesDrawer>
        <SeriesItemModal v-model:show="SeriesItemShow" :list="SeriesList" :id="SeriesId" @save="Save"></SeriesItemModal>
    </MyCard>
</template>

<script setup lang="ts">
import MyCard from '@/components/MyCard.vue';
import { computed, ref } from 'vue';
import Content from './components/Content.vue';
import type { AcgnType, MediaCardItem, Series, SeriesDetail } from '@/types/acgn.ts';
import { seriesData, seriesDetail } from '@/mock/acgnData.ts';
import SeriesModal from './components/SeriesModal.vue';
import SeriesDrawer from './components/SeriesDrawer.vue';
import SeriesItemModal from './components/SeriesItemModal.vue';
import { getMediaListApi } from '@/api/media.ts';
const SeriesId = ref<string | number | null>(null)
// 获取向系列添加作品需要的数据
const SeriesItemShow = ref(false)
const SeriesList = ref<MediaCardItem[] | null>(null)
const mediaList = ref<MediaCardItem[] | null>(null)
const getMediaList = async () => {
    const res = await getMediaListApi()
    mediaList.value = res.data!.list
}
getMediaList()
const getSeriesItem = (id: any, type: AcgnType) => {
    // option用的数据
    const list = mediaList.value?.filter(item => {
        const isSameType = item.type === type
        const isCurrentOrNoSeries = !item.seriesId || String(item.seriesId) === String(id)
        // 保留同类型并且将当前系列或的作品保留
        return isSameType && isCurrentOrNoSeries
    })
    SeriesList.value = list!
    SeriesId.value = id
    SeriesItemShow.value = true
}
const Save = (arr: (string | number)[]) => {
    console.log('回传的数据', arr);
    SeriesItemShow.value = false
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
const setSeriesData = (data: any) => {
    if (data.formdata) {
        console.log('我是录入');
        console.log(data);
    } else {
        console.log('我是编辑');
        console.log(data);
    }
    active.value = false
}
// 页数
const page = ref(1)
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
const seriesList = computed<Series[]>(() => {
    const data = seriesData.filter(item => item.type === defaultSelect.value)
    return data.length > 0 ? data : seriesData
})
// 详情开关
// 传递给详情页的数据
const selectedItem = ref<SeriesDetail | null>(null)
const showDetail = ref(false)
const openDetail = (id: number) => {
    showDetail.value = true
    selectedItem.value = seriesDetail.find(item => item.id === id) || null
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