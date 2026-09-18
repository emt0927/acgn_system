<template>
    <MyCard>
        <template #cardTab>
            数据记录
        </template>
        <div class="flex justify-center items-center w-full h-full">
            <div ref="chartRef" class="chart-box"></div>
        </div>
    </MyCard>
</template>

<script setup lang="ts">
import { getRecordApi } from '@/api/record';
import MyCard from '@/components/MyCard.vue';
import * as echarts from 'echarts'
import { onMounted, onUnmounted, ref, watch } from 'vue';
// echarts
const chartRef = ref<HTMLDivElement | null>(null)
let myChart: echarts.EChartsType | null = null
const renderChart = () => {
    if (!chartRef.value) return

    // 首次初始化画板，如果已存在则复用
    if (!myChart) {
        myChart = echarts.init(chartRef.value)
    }
    const option: echarts.EChartsOption = {
        tooltip: {
            trigger: 'axis',
            formatter: (params: any) => {
                const dataIndex = Array.isArray(params) ? params[0]?.dataIndex : params?.dataIndex
                if (dataIndex === undefined) return ''
                const item = recordList.value?.[dataIndex]
                if (!item) return ''
                const addStr = item.addedTitles?.length ? item.addedTitles.join('、') : '无'
                const clearStr = item.deletedTitles?.length ? item.deletedTitles.join('、') : '无'
                return `
      <div style="font-weight: bold; margin-bottom: 6px; border-bottom: 1px solid #eee; padding-bottom: 4px;">
        ${item.date ?? ''}
      </div>
      <div style="color: #409EFF; margin-bottom: 3px;">
         新增 (${item.add ?? 0}): ${addStr}
      </div>
      <div style="color: #F56C6C;">
         清理 (${item.clear ?? 0}): ${clearStr}
      </div>
    `
            }
        },
        xAxis: {
            type: 'category',
            data: (recordList.value || []).map(item => {
                const typeLabel = item.type === 'series' ? '系列' : '作品'
                return `${item.date}\n(${typeLabel})`
            })
        },
        yAxis: {
            type: 'value',
            minInterval: 1
        },
        series: [
            {
                name: '新增',
                type: 'bar',
                data: recordList.value?.map(item => item.add),
                itemStyle: { color: '#409EFF' }
            },
            {
                name: '删除',
                type: 'bar',
                data: recordList.value?.map(item => item.clear), // 👈 动态拆解清理数据
                itemStyle: { color: '#F56C6C' }
            }
        ]
    }
    myChart.setOption(option)
}
interface chartsType {
    _id?: string;
    date?: string;
    type?: string;
    add?: number;
    addedTitles?: string[];
    clear?: number;
    deletedTitles?: string[];
}
// 监听窗口变化自适应
const handleResize = () => myChart?.resize()
const recordList = ref<chartsType[] | null>(null)
const getRecordList = async () => {
    console.log('每次我都来');
    const res = await getRecordApi()
    console.log(res.data);
    recordList.value = res.data
}
onMounted(async () => {
    await getRecordList()
    renderChart()
    window.addEventListener('resize', handleResize)
})
watch(recordList, () => {
    renderChart()
}, { deep: true })
onUnmounted(() => {
    window.removeEventListener('resize', handleResize)
    myChart?.dispose()
})
</script>

<style scoped>
.chart-box {
    width: 100%;
    height: 350px;
    /* 💡 必须明确设置高度，否则默认高度为 0 会导致隐形 */
}
</style>