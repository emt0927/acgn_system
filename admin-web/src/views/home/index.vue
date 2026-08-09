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
                <div class="sort_item">排序:最近更新</div> 
                <div @click="isLoaded = !isLoaded">点击</div>
            </div>
        </template>
        <div class="flex flex-col justify-between w-full pt-5">
            <div
                class="flex-1 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 px-5 py-0  min-h-0 overflow-y-auto">
                <div v-for="item in 12"
                    class=" group flex flex-col w-full relative rounded-lg bg-item  shadow-[0_2px_8px_rgba(0,0,0,0.04)] transition duration-200 ease-in-out hover:-translate-y-0.5  hover:shadow-[0_6px_16px_rgba(0,0,0,0.08)]">
                    <div class="flex justify-between absolute w-full top-0 left-0 pointer-events-none z-10">
                        <div class="titleTag">
                            TV动画</div>
                        <div class="titleTag">
                            在追</div>
                    </div>
                    <div class="overflow-hidden rounded-t-lg aspect-3/4 bg-muted">
                        <span class="transition-opacity w-full h-full block ease-out duration-150"
                            :class="isLoaded ? 'opacity-100' : 'opacity-0'">
                            <img src="../../assets/ldws.jpg" alt=""
                                class="w-full h-full  block object-cover transition duration-300 ease-in-out group-hover:scale-[1.04]">
                        </span>
                    </div>
                    <div class="text-[12px] p-1.5">
                        <div class="description_title truncate">葬送的福利连</div>
                        <n-progress type="line" :percentage="percentage">28/28话</n-progress>

                        <div class="flex items-center"> <n-rate readonly :size="12" :default-value="5"
                                class="max-w-full" />
                            <div class="pl-0.75 h-5 pt-0.5 shrink-0 whitespace-nowrap">10分</div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="pagination-footer"><n-pagination v-model:page="page" :page-size="12" :item-count="100" />
            </div>
        </div>

    </MyCard>
</template>

<script setup lang="ts">
import MyCard from '@/components/MyCard.vue';
import { computed, ref } from 'vue';
// 引入mock数据
import { mockAcgnList } from '@/mock/acgnData';
console.log(mockAcgnList);
// 分页
const page = ref(3)
// 图片懒加载
const isLoaded = ref(true)

// 默认选中tabs 
// 进度
const percentage = ref(2)
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
@reference "@/style.css";

.titleTag {
    @apply py-0.5 px-1.5 text-[11px] rounded bg-black/55 text-white backdrop-blur-[2px] truncate;
}

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
        }

        .status_item.active {
            color: #4B9E5F;
        }
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