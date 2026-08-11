<template>
    <MyCard>
        <template #cardTab>
            <div class="tabs overflow-x-auto whitespace-nowrap">
                <div class="tabs_item px-5 cursor-pointer" v-for="(item) in tabs" :key="item.type"
                    :class="{ active: defaultTbs === item.type }" @click="setTabs(item.type)">{{ item.name }}</div>
            </div>
        </template>
        <template #action>
            <div class="status overflow-x-auto whitespace-nowrap">
                <div class="status_left">
                    <template v-for="(item, index) in currentStatusList" :key="item.key">
                        <div class="status_item" :class="{ active: currentStatus === item.key }"
                            @click="currentStatus = item.key">{{ item.label }}</div>
                        <n-divider v-if="index < currentStatusList.length - 1" vertical />
                    </template>
                </div>
                <div class="sort_item">
                    <n-dropdown trigger="hover" :options="options" @select="handleSelect" placement="bottom-start">
                        <span class="cursor-pointer h-full block flex items-center">排序:最近更新</span>
                    </n-dropdown>
                </div>
                <div class="edit"> <n-button type="tertiary">
                        点击录入
                    </n-button></div>
            </div>
        </template>
        <div class="flex flex-col justify-between w-full pt-5">
            <div
                class="flex-1 content-start grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 px-5 py-0  min-h-0 overflow-y-auto">
                <ContentCard v-for="item in MockMedia" :key="item.id" :item="item"></ContentCard>
            </div>
            <div class="pagination-footer"><n-pagination v-model:page="page" :page-size="12" :item-count="100" />
            </div>
            <!-- 抽屉组件 -->
             <MyDrawer></MyDrawer>
             <!-- 详情展示框 -->
              <MyModal></MyModal>
        </div>
    </MyCard>
</template>

<script setup lang="ts">
import MyCard from '@/components/MyCard.vue';
import { computed, ref } from 'vue';
// 引入mock数据
import { MockMedia } from '@/mock/acgnData';
import ContentCard from './components/ContentCard.vue';
import MyDrawer from './components/MyDrawer.vue';
import MyModal from './components/MyModal.vue';
console.log(MockMedia);
// 抽屉开关
// 排序选择
const options = [
    {
        label: '滨海湾金沙，新加坡',
        key: 'marina bay sands',
        disabled: true
    },
    {
        label: '布朗酒店，伦敦',
        key: 'brown\'s hotel, london'
    }
]

// 选择时触发
const handleSelect = (key: string | number) => {
    console.log('key');
}

// 分页
const page = ref(3)
// 图片懒加载
const isLoaded = ref(true)

// 默认选中tabs 

const defaultTbs = ref('all')
const tabs = [
    {
        type: 'all',
        name: '全部'
    },
    {
        type: 'anime',
        name: '动画'
    },
    {
        type: 'manga',
        name: '漫画'
    },
    {
        type: 'game',
        name: '游戏'
    },
    {
        type: 'novel',
        name: '小说'
    },
]
// 改变tabs 
const setTabs = (type: string) => {
    defaultTbs.value = type
    currentStatus.value = 'all'
}
// 默认选中状态
const currentStatus = ref('all')
const statusTextMap: Record<string, Record<string, string>> = {
    // 游戏专属文案
    game: {
        all: '全部',
        doing: '正在玩',
        wish: '想玩',
        done: '已通关',
        dropped: '退坑'
    },
    // 全部 (通用融合文案)
    all: {
        all: '全部',
        doing: '正在追/玩',
        wish: '想看/想玩',
        done: '已完/通关',
        dropped: '弃坑/退坑'
    },
    // 默认 (动画/漫画/小说通用)
    default: {
        all: '全部',
        doing: '正在追',
        wish: '想看',
        done: '看过',
        dropped: '弃坑'
    }
}
const currentStatusList = computed(() => {
    const labels = statusTextMap[defaultTbs.value] || statusTextMap.default
    return [
        { key: 'all', label: labels.all },
        { key: 'doing', label: labels.doing },
        { key: 'wish', label: labels.wish },
        { key: 'done', label: labels.done },
        { key: 'dropped', label: labels.dropped }
    ]
})
</script>

<style scoped>
.tabs {
    display: flex;

    .tabs_item.active {
        color: #4B9E5F;
    }
}

.status {
    padding: 0 20px;
    display: flex;

    .status_left {
        display: flex;
        min-width: 380px;

        .status_item {
            font-size: 14px;
            cursor: pointer;
            display: flex;
            align-items: center;
        }

        .status_item.active {
            color: #4B9E5F;
        }
    }

    .edit {
        display: flex;
        flex: 1;
        justify-content: end;
    }
}


.content-wrapper {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 100%;
    width: 100%;
}

.pagination-footer {
    padding: 10px 0;
    display: flex;
    justify-content: flex-end;
    /* 右对齐 */

}
</style>