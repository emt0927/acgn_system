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
        111111我是首页
    </MyCard>
</template>

<script setup lang="ts">
import MyCard from '@/components/MyCard.vue';
import { computed, ref } from 'vue';

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
</style>