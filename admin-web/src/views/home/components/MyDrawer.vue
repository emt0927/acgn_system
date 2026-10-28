<template>
    <n-drawer v-model:show="visible" :width="502" placement="right">
        <n-drawer-content :title="oneForm?.id ? '编辑作品' : '新增作品'" closable>
            <n-radio-group v-model:value="acgnType" name="left-size" style="margin-bottom: 16px"
                @update:value="handleTypeChange" v-if="!oneForm?.id">
                <n-radio-button value="anime">
                    动漫
                </n-radio-button>
                <n-radio-button value="novel">
                    小说
                </n-radio-button>
                <n-radio-button value="manga">
                    漫画
                </n-radio-button>
                <n-radio-button value="game">
                    游戏
                </n-radio-button>
            </n-radio-group>
            <n-form ref="formRef" :model="oneForm" :style="{ maxWidth: '640px' }" label-placement="left"
                label-width="auto" :key="acgnType" :rules="rules" require-mark-placement="left">
                <n-form-item label="快速导入">
                    <n-button text target="_blank" type="primary" @click="bangumiListState = true">
                        从bangumi导入
                    </n-button>
                </n-form-item>
                <n-form-item v-for="item in dynamicForm" :key="item.key" :label="item.label" :path="getItemPath(item)">
                    <n-input v-model:value="oneForm[item.key]" v-if="item.formType === 'textarea'" type="textarea"
                        :rows="3" />
                    <n-upload v-else-if="item.formType === 'url'" list-type="image-card" :max="1"
                        :default-upload="false" @change="handleFileChange" v-model:file-list="FileList">
                    </n-upload>
                    <div style="display: flex; align-items: center; gap: 8px; width: 100%;"
                        v-else-if="item.formType === 'progress-pair'">
                        <n-input-number v-model:value="oneForm.progress.current" :min="0" placeholder="当前进度"
                            style="flex: 1;" />
                        <span></span>
                        <n-input-number v-model:value="oneForm.progress.total" :min="0" placeholder="总进度"
                            style="flex: 1;" />
                    </div>
                    <n-select v-else-if="item.formType === 'select'" v-model:value="oneForm[item.key]"
                        :placeholder="`请选择${item.label}`" :options="item.options" />
                    <n-input v-model:value="oneForm[item.key].text" v-else-if="item.formType === 'progress-text'"
                        :placeholder="'请输入游玩进度'" />
                    <n-date-picker v-else-if="item.formType === 'date'" v-model:formatted-value="oneForm[item.key]"
                        value-format="yyyy-MM-dd" type="date" clearable></n-date-picker>
                    <n-input-number v-else-if="item.formType === 'rate'" :placeholder="'请进行评价 1~10分制'" style="flex: 1;"
                        v-model:value="oneForm[item.key]" :max="10"></n-input-number>
                    <n-input v-model:value="oneForm[item.key]" v-else />
                </n-form-item>
                <n-form-item>
                    <n-button @click="handleValidateClick" type="primary" style="margin-right: 20px">
                        提交
                    </n-button>
                    <n-button @click="result">
                        重置
                    </n-button>
                </n-form-item>
            </n-form>
        </n-drawer-content>
    </n-drawer>
    <BangumuList v-model:show="bangumiListState" :type="acgnType" @getBgmMedia="getBgmMedia"></BangumuList>
</template>

<script setup lang="ts">
import type { AcgnType, MediaCardDetail } from '@/types/acgn';
import { computed, ref, watch } from 'vue';
import { FIELD_SCHEMAS, getSeriesOptions, type FieldConfig } from '../Schema';
import { useMessage, type FormInst, type FormRules, type UploadFileInfo } from 'naive-ui';
import { uploadCoverUrlApi } from '@/api/upload';
import { getBangumiDetailApi } from '@/api/bangumi';
import BangumuList from '@/components/BangumuList.vue';
import { addMediaApi, putUpdateMediaApi } from '@/api/media';
import { trackRecordApi } from '@/api/record';
const formRef = ref<FormInst | null>(null)

// bangumi相关
const bangumiListState = ref(false)

const detail = ref()
// url转file
const urlToFile = async (url: string, fileName = 'cover.jpg'): Promise<File> => {
    const res = await fetch(url)
    const blob = await res.blob()
    return new File([blob], fileName, { type: blob.type || 'image/jpeg' })
}
const getBgmMedia = async (id: any) => {
    // bangumi获取到的详情数据 用于抽屉回显
    console.log(acgnType.value, id);
    const res = await getBangumiDetailApi({ id, type: acgnType.value })
    if (res.data.coverUrl) {
        const file = await urlToFile(res.data.coverUrl)
        const { totalEpisodes, ...restDetail } = res.data
        if (totalEpisodes) {
            oneForm.value.progress.total = totalEpisodes
        }
        FileList.value = [{
            id: 'existing.cover',
            name: '封面图',
            status: 'finished',
            url: res.data.coverUrl
        }]
        rawFile.value = file
        oneForm.value = { ...oneForm.value, ...restDetail }
        bangumiListState.value = false
    }
}
// 作品的不同状态
const acgnType = ref<AcgnType>('anime')

// 展示数据
const dynamicForm = computed(() => {
    const schema = FIELD_SCHEMAS[acgnType.value] || []
    return schema.filter(item => item.editable !== false).map(item => item.key === 'series' ? { ...item, options: seriesOptions.value } : item)
}

)
// 录入值
const oneForm = ref<Record<string, any>>({});
// 创建表单数据结构
const createFrom = (type: AcgnType) => {
    // 拿到对应type的数据结构 将key摘出来作为表单数据对象的key value为null 
    const schema = FIELD_SCHEMAS[type]
    const from: Record<string, any> = {}
    schema.forEach(item => {
        from[item.key] = null
    })
    // 为游戏和其他的进度做特殊格式化
    if (type === 'game') {
        from.progress = { text: '' }
    } else {
        from.progress = { current: 0, total: 0 }
    }
    return from
}
// 图片上传
const FileList = ref<UploadFileInfo[]>([])
const rawFile = ref<File | null>(null) // 专门在外面存原生文件的响应式变量
const handleFileChange = ({ file }: { file: UploadFileInfo }) => {
    if (file.status !== 'removed' && file.file) {
        rawFile.value = file.file
        oneForm.value.coverUrl = file.name
    } else {
        rawFile.value = null
        oneForm.value.coverUrl = ''

    }
}
//重置数据
const result = () => {
    oneForm.value = createFrom(acgnType.value)
    acgnType.value = 'anime'
    oneForm.value.type = 'anime'
    FileList.value = []
    rawFile.value = null
    formRef.value?.restoreValidation()
}

// 校验规则
const rules = computed<FormRules>(() => {
    const currentSchema = FIELD_SCHEMAS[acgnType.value]
    const rulesObj: FormRules = {}
    currentSchema.forEach(field => {
        if (!field.required) return
        if (field.key === 'progress') {
            if (acgnType.value === 'game') {
                rulesObj['progress.text'] = {
                    required: true,
                    message: '请输入游玩进度',
                    trigger: ['blur', 'input']
                }
            } else {
                rulesObj['progress.current'] = {
                    type: 'number',
                    required: true,
                    message: '请选择当前进度',
                    trigger: ['blur', 'input']
                }
            }
            return
        }
        // 通用校验
        const isSelect = field.formType === 'select' || field.formType === 'date' || field.formType === 'url'
        rulesObj[field.key] = {
            required: true,
            message: `请${isSelect ? '选择' : '输入'}${field.label}`,
            trigger: isSelect ? 'change' : ['blur', 'input']
        }
    })
    return rulesObj
})
const getItemPath = (item: FieldConfig) => {
    if (item.key === 'progress') {
        return acgnType.value === 'game' ? 'progress.text' : 'progress.current'
    }
    return item.key
}
const visible = ref(false)
const emit = defineEmits(['success'])
const open = async (detail?: MediaCardDetail) => {
    visible.value = true
    if (detail && detail.id) {
        FileList.value = [
            {
                id: 'existing.cover',
                name: '封面图',
                status: 'finished',
                url: detail.coverUrl
            }
        ]
        rawFile.value = null // 编辑刚打开时，尚未选择“新文件”
        acgnType.value = detail.type || 'anime';
        const detailProgress = detail.progress
        const safeProgress = acgnType.value === 'game'
            ? { text: detailProgress?.text || '' }
            : { current: detailProgress?.current || 0, total: detailProgress?.total || 0 }
        const rawSeries = detail.series
        const safeSeries = (typeof rawSeries === 'object' && rawSeries !== null) ? rawSeries._id : rawSeries
        oneForm.value = { ...detail, series: safeSeries, progress: safeProgress }
    } else {
        oneForm.value = createFrom(acgnType.value)
        oneForm.value.coverUrl = ''
        oneForm.value.type = acgnType.value
        rawFile.value = null
        FileList.value = []
    }
    seriesOptions.value = await getSeriesOptions(acgnType.value)
}
defineExpose({ open })

//动态的系列数据
const seriesOptions = ref()
watch(acgnType, async (newType) => {
    if (newType && visible.value) {
        seriesOptions.value = await getSeriesOptions(newType)
    }
})
// 新增切换重置内容
const handleTypeChange = async (newType: AcgnType) => {
    oneForm.value = createFrom(newType)
    rawFile.value = null
    FileList.value = []
    oneForm.value.type = acgnType.value
}
//验证
const message = useMessage()
const handleValidateClick = (e: MouseEvent) => {
    e.preventDefault()
    formRef.value?.validate(async (errors) => {
        if (!errors) {
            // 传图片
            if (rawFile.value) {
                const formData = new FormData()
                formData.append('file', rawFile.value)
                // 上传图片
                const res = await uploadCoverUrlApi(formData)
                oneForm.value.coverUrl = res.data?.url
            }
            if (oneForm.value.id) {
                const res = await putUpdateMediaApi(oneForm.value)
                message.success(res.message)

            } else {
                const res = await addMediaApi(oneForm.value)
                message.success(res.message)
                await trackRecordApi('midia', oneForm.value.title, 'add')
            }
            result()
            visible.value = false // 自己关掉抽屉
            emit('success')       // 喊父组件刷新列表
        } else {
            console.log('验证失败', errors);
        }
    })
}

</script>

<style scoped></style>