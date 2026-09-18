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
            <div v-if="(seriesList?.length as number) > 0"
                class="flex-1 content-start grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-4 px-5 py-0  min-h-0 overflow-y-auto">
                <Content v-for="item in seriesList" :key="item.id" :item=item @click="openDetail"></Content>
            </div>
            <div class="flex-1 flex items-center justify-center" v-else>
                <n-empty description="暂无数据">
                </n-empty>
            </div>
            <div class="pagination-footer"><n-pagination v-model:page="page" :page-size="pageSize"
                    :item-count="total" />
            </div>
        </div>
        <SeriesModal v-model:show="showDetail" :detail="selectedItem" @open-edit="SeriesEdit"
            @openSeriesItem="getSeriesItem" @del-show="SeriesDel">
        </SeriesModal>
        <SeriesDrawer v-model:show="active" :detail="seriesItem" @setSeriesData="setSeriesData"
            @getBangumiList="getBangumiList" :importDetail="importDetail">
        </SeriesDrawer>
        <SeriesItemModal v-model:show="SeriesItemShow" :list="SeriesList" @update-Series="updateSeries"
            :newList="newSeriesList" :title="seriesTitle">
        </SeriesItemModal>
        <BangumuList v-model:show="bangumiListState" :type="bangumitype" @getBgmMedia="getBgmMedia"></BangumuList>
    </MyCard>
</template>

<script setup lang="ts">
import MyCard from '@/components/MyCard.vue';
import { computed, h, ref } from 'vue';
import Content from './components/Content.vue';
import type { AcgnType, importDetailType, MediaCardItem, Series, SeriesDetail } from '@/types/acgn.ts';
import SeriesModal from './components/SeriesModal.vue';
import SeriesDrawer from './components/SeriesDrawer.vue';
import SeriesItemModal from './components/SeriesItemModal.vue';
import { addSeriesApi, deleteSeriesApi, getSeriesAndMediaApi, getSeriesDetailApi, getSeriesListApi, putSeriesDetailApi } from '@/api/serires.ts';
// bangumi列表状态
const bangumiListState = ref(false)
const bangumitype = ref('')
const getBangumiList = (type: string) => {
    console.log(type);
    bangumitype.value = type
    bangumiListState.value = true
}
// 拿到bgm回显的数据
const rawfile = ref()
const detail = ref()
// url转file
const urlToFile = async (url: string, fileName = 'cover.jpg'): Promise<File> => {
    const res = await fetch(url)
    const blob = await res.blob()
    return new File([blob], fileName, { type: blob.type || 'image/jpeg' })
}
const importDetail = ref<importDetailType | null>(null)
const getBgmMedia = async (id: any) => {
    // bangumi获取到的详情数据 用于抽屉回显
    const res = await getBangumiDetailApi({ id, type: 'series' })
    if (res.data.coverUrl) {
        rawfile.value = await urlToFile(res.data.coverUrl)
        detail.value = { ...res.data, rawfile: rawfile.value }
        importDetail.value = detail.value
        bangumiListState.value = false
    }
}

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
    console.log(res.data?.mediaList, 123123231);
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
import { useMessage, useDialog } from 'naive-ui'
const message = useMessage()
const dialog = useDialog()
// 删除系列
const SeriesDel = async (id: string, title: string) => {
    const res = await getSeriesAndMediaApi(id)
    let del = null
    if ((res.data?.mediaList.length as number) > 0) {
        dialog.warning({
            title: '警告',
            content: () => {
                const list = res.data?.mediaList || []
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
                del = await deleteSeriesApi(id)
                message.success(del.message)
                showDetail.value = false
                await getSeriesList()
            },
        })
    } else {
        del = await deleteSeriesApi(id)
        message.success(del.message)
        showDetail.value = false
        await getSeriesList()
    }
    if (del) {
        // 记录
        await trackRecordApi('series', title, 'clear')
    }
}
// 抽屉组件传递回来的系列数据
import { getMediaListApi, updateMediaOrSreiesApi } from '@/api/media.ts';
import BangumuList from '@/components/BangumuList.vue';
import { getBangumiDetailApi } from '@/api/bangumi.ts';
import { trackRecordApi } from '@/api/record.ts';
import { useUserStore } from '@/store/index.ts';
const setSeriesData = async (data: any) => {
    if (data.id) {
        const res = await putSeriesDetailApi(data)
        message.success(res.message)
    } else {
        const res = await addSeriesApi(data)
        message.success(res.message)
        // 记录
        await trackRecordApi('series', data.title, 'add')

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
// 默认选中
const userStore = useUserStore()
const defaultSelect = computed(() => {
    return userStore.typeObj.seriesType
})
const setSelect = (key: string) => {
    userStore.updatetypeObj({ seriesType: key })
    getSeriesList()

}
// 系列数据
const seriesList = ref<Series[]>()
// 获取系列列表
const getSeriesList = async () => {
    const res = await getSeriesListApi({ page: page.value, pageSize: pageSize.value, type: defaultSelect.value })
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