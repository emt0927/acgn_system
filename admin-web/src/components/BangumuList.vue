<template>
    <n-modal v-model:show="showModal" preset="card" :style="{ width: '520px' }" :title="'快速导入-输入关键词'"
        :content-style="{ padding: 0 }">
        <n-input-group class="px-5">
            <n-input :style="{ width: '100%' }" @keydown.enter="handleSearch" v-model:value="searchValue" />
            <n-button type="primary" ghost @click="handleSearch">
                搜索
            </n-button>
        </n-input-group>
        <div class=" min-h-45 my-6 pl-5">
            <Transition name="fade" mode="out-in">
                <div v-if="loading" class="flex items-center justify-center h-45">
                    <n-spin size="medium" description="加载中..." />
                </div>
                <div class="flex items-center justify-center h-45" v-else-if="list?.length === 0">
                    <n-empty description="暂无数据">
                    </n-empty>
                </div>
                <template v-else>
                    <div class="max-h-130 overflow-auto">
                        <div class="flex mb-5" v-for="item in list" :key="item.id">
                            <div
                                class="w-20 h-30 bg-white border border-gray-200 shadow-md p-0.75 shrink-0 cursor-pointer hover:border-sky-500 hover:shadow-md">
                                <img :src="item.coverUrl" alt="" class="w-full h-full object-cover">
                            </div>
                            <div class="flex-1 flex-col min-w-0 px-2.5">
                                <div class="flex items-center">
                                    <div class="mr-1">
                                        <n-button text type="info">
                                            {{ item.title }}
                                        </n-button>
                                    </div>
                                    <span class="text-[#999] text-[10px] truncate block">{{ item.originalTitle }}</span>
                                </div>
                                <div class="pt-2.5 flex text-[#666] text-[12px]">
                                    {{ item.date }}/ {{ item.director }}/ {{ item.originalWork }}/ {{
                                        item.characterDesign }}
                                </div>
                            </div>
                        </div>
                    </div>
                </template>
            </Transition>
        </div>
    </n-modal>
</template>

<script setup lang="ts">
import { useMessage } from 'naive-ui'
const message = useMessage()
const loading = ref(false)
import { getBangumiSearchListApi } from '@/api/bangumi';
import { ref } from 'vue';
const searchValue = ref('')
const props = defineProps<{
    type: string
}>()
// 弹窗开关
const showModal = defineModel('show', { required: true })
export interface bgmSearchListType {
    /** id*/
    id: string,
    /** 中文名*/
    title: string,
    /** 原名*/
    originalTitle: string
    /** 封面*/
    coverUrl: string
    /** 导演*/
    director: string,
    /** 人物设定*/
    characterDesign: string,
    /** 原作*/
    originalWork: string,
    /** 时间*/
    date: string,

}
const list = ref<bgmSearchListType[]>([])
// 搜索 
const handleSearch = async () => {
    loading.value = true
    const res = await getBangumiSearchListApi({ keyword: searchValue.value, type: props.type })
    loading.value = false
    list.value = res.data ?? []
    console.log(list.value);
}

</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
    transition: max-height 0.3s ease, opacity 0.3s ease;
    overflow: hidden;
}

.fade-enter-from,
.fade-leave-to {
    max-height: 0 !important;
    opacity: 0;
}
</style>