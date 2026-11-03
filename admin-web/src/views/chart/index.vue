<template>
    <MyCard>
        <template #cardTab>
            数据记录
        </template>
        <div class="flex flex-col w-full h-full">
            <div ref="chartRef" class="chart-box"></div>
            <div v-if="selectedRecord" class="mt-4 p-4 border-t border-gray-100">
                <div class="font-bold text-sm mb-3">
                    📅 {{ selectedRecord.date || '早期记录' }}
                    ({{ selectedRecord.type === 'series' ? '系列' : '作品' }}操作完整明细)
                </div>

                <div class="mb-3">
                    <span class="text-xs font-bold text-blue-500 mr-2">
                        新增 ({{ selectedRecord.add ?? 0 }}):
                    </span>
                    <template v-if="selectedRecord.addedTitles?.length">
                        <n-tag v-for="(title, idx) in selectedRecord.addedTitles" :key="idx" type="info" size="small"
                            class="mr-2 mb-2">
                            {{ title }}
                        </n-tag>
                    </template>
                    <span v-else class="text-xs text-gray-400">无</span>
                </div>

                <div>
                    <span class="text-xs font-bold text-red-500 mr-2">
                        清理 ({{ selectedRecord.clear ?? 0 }})：
                    </span>
                    <template v-if="selectedRecord.deletedTitles?.length">
                        <n-tag v-for="(title, idx) in selectedRecord.deletedTitles" :key="idx" type="error" size="small"
                            class="mr-2 mb-2">
                            {{ title }}
                        </n-tag>
                    </template>
                    <span v-else class="text-xs text-gray-400">无</span>
                </div>
            </div>
        </div>
    </MyCard>
</template>

<script setup lang="ts">
import { getRecordApi } from '@/api/record';
import MyCard from '@/components/MyCard.vue';
import * as echarts from 'echarts'
import { onMounted, onUnmounted, ref } from 'vue';
// echarts
const chartRef = ref<HTMLDivElement | null>(null)
let myChart: echarts.EChartsType | null = null
const selectedRecord = ref<chartsType | null>(null)
const renderChart = () => {
    if (!chartRef.value) return
    // 首次初始化画板，如果已存在则复用
    if (!myChart) {
        myChart = echarts.init(chartRef.value)
        myChart.on('click', (params) => {
            const item = recordList.value?.[params.dataIndex]
            if (item) selectedRecord.value = item
        })
    }
    const option: echarts.EChartsOption = {
        tooltip: {
            trigger: 'axis',
            confine: true,
            formatter: (params: any) => {
                const dataIndex = Array.isArray(params) ? params[0]?.dataIndex : params?.dataIndex
                if (dataIndex === undefined) return ''
                const item = recordList.value?.[dataIndex]
                if (!item) return ''
                const typeLabel = item.type === 'series' ? '系列' : '作品'

                // 🌟 3. 悬浮框最多只取前 4 部预览，绝对不撑爆高度！
                const formatPreview = (list?: string[]) => {
                    if (!list?.length) return '无'
                    const preview = list.slice(0, 4).map(t => `《${t}》`).join('、')
                    return list.length > 4 ? `${preview} ...等共 ${list.length} 部` : preview
                }

                return `
      <div style="max-width: 260px; white-space: normal; line-height: 1.6;">
        <div style="font-weight: bold; margin-bottom: 6px; border-bottom: 1px solid #eee; padding-bottom: 4px;">
          ${item.date || '未知日期'} (${typeLabel})
        </div>
        <div style="color: #409EFF; margin-bottom: 4px;">
           <b>新增 (${item.add ?? 0}):</b> ${formatPreview(item.addedTitles)}
        </div>
        <div style="color: #F56C6C; margin-bottom: 4px;">
           <b>清理 (${item.clear ?? 0}):</b> ${formatPreview(item.deletedTitles)}
        </div>
        <div style="font-size: 12px; color: #999; text-align: right; margin-top: 4px;">
           👆 点击柱子在下方查看全部明细
        </div>
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
                data: recordList.value?.map(item => item.clear),
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
onUnmounted(() => {
    window.removeEventListener('resize', handleResize)
    myChart?.dispose()
})
</script>

<style scoped>
.chart-box {
    width: 100%;
    height: 350px;
}
</style>