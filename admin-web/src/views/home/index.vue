<template>
    <MyCard>
        <template #cardTab>
            <div class="tabs">
                <div class="tabs_item" v-for="(item) in tabs" :key="item.type"
                    :class="{ active: defaultTbs === item.type }" @click="setTabs(item.type)">{{ item.name }}</div>
            </div>
        </template>
        <template #action>
            <div class="status">
                <div class="status_left">
                    <template v-for="(item, index) in currentStatusList" :key="item.key">
                        <div class="status_item" :class="{ active: currentStatus === item.key }"
                            @click="currentStatus = item.key">{{ item.label }}</div>
                        <n-divider v-if="index < currentStatusList.length - 1" vertical />
                    </template>
                </div>
                <div class="sort_item">排序:最近更新</div>
            </div>
        </template>
        <div class="w-full h-full flex flex-col justify-between">
            <div class="flex-1 grid grid-cols-5 grid-rows-2 gap-4 px-5 py-0 ">
                <div v-for="item in 10"
                    class="w-full relative rounded-lg bg-white shadow-[0 2px 8px rgba(0,0,0,0.04)] transition duration-200 ease-in-out hover:translate-y-[-3px] hover:shadow-[0_6px_16px_rgba(0,0,0,0.08)]">
                    <div class="flex justify-between absolute w-full top-0 left-0 pointer-events-none">
                        <div class="titleTag">
                            TV动画111</div>
                        <div
                            class="titleTag">
                            在追</div>
                    </div>
                    <img src="../../assets//ldws.jpg" alt=""
                        class="w-full h-[clamp(120px,18vh,240px)] block object-cover">
                    <div class="text-[12px] p-1.5">
                        <div class="description_title">葬送的福利连</div>
                        <n-progress type="line" :percentage="percentage">28/28话</n-progress>

                        <div class="flex items-center"> <n-rate readonly :size="14" />
                            <div class="pl-0.75 h-5 pt-0.5">10分</div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="pagination-footer"><n-pagination v-model:page="page" :page-size="10" :item-count="100" />
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
const page = ref(1)
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
    @apply py-0.5 px-1.5 text-[11px] rounded bg-black/55 text-white backdrop-blur-[2px];
}

.tabs {
    display: flex;

    .tabs_item {
        padding: 0 20px;
        cursor: pointer;
    }

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

.list {

    /* display: grid;
    grid-template-columns: repeat(5, 1fr);
    flex: 1;
    align-content: start;
    gap: 50px; */
    /* 让这 5 列在中间优雅居中 */
    /* padding: 0 200px; */
    .item {
        /* width: 100%;
        max-width: 220px;
        position: relative;
        border-radius: 8px;
        background: #fff;
        overflow: hidden;
        border-radius: 8px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
        transition: transform 0.2s ease, box-shadow 0.2s ease; */

        /* 鼠标悬浮微动效 */
        &:hover {
            /* transform: translateY(-3px);
            box-shadow: 0 6px 16px rgba(0, 0, 0, 0.08); */
        }

        .poster {
            /* width: 100%;
            height: clamp(120px, 18vh, 240px);
            object-fit: cover;
            display: block; */
        }

        .head_title {
            /* display: flex;
            justify-content: space-between;
            position: absolute;
            width: 100%;
            top: 0;
            left: 0;
            pointer-events: none; */

            .title_subtype,
            .title_status {
                /* padding: 2px 6px;
                font-size: 11px;
                border-radius: 4px;
                background: rgba(0, 0, 0, 0.55);
                color: #fff;
                backdrop-filter: blur(2px); */
                /* 模糊磨砂效果 */
            }
        }

        .description {
            /* font-size: 12px;
            padding: 6px; */
        }

        .rate {
            /* display: flex;
            align-items: center; */

            .rate_text {
                /* padding-left: 3px;
                height: 20px;
                padding-top: 2px; */
            }
        }

    }
}

.pagination-footer {
    margin-top: auto;
    /* 自动把分页推到最底部 */
    padding: 10px 0;
    display: flex;
    justify-content: flex-end;
    /* 右对齐 */

}
</style>