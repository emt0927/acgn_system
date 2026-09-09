<template>
    <n-drawer v-model:show="visible" :width="502" placement="right">
        <n-drawer-content :title="detail?.id ? '编辑作品' : '新增作品'" closable>
            <n-radio-group v-model:value="acgnType" name="left-size" style="margin-bottom: 16px"
                @update:value="handleTypeChange" v-if="!detail?.id">
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
                        v-model:value="oneForm[item.key]"></n-input-number>
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
</template>

<script setup lang="ts">
import type { AcgnType, MediaCardDetail } from '@/types/acgn';
import { computed, ref, watch } from 'vue';
import { FIELD_SCHEMAS, getSeriesOptions, type FieldConfig } from '../Schema';
import type { FormInst, FormRules, UploadFileInfo } from 'naive-ui';
import { uploadCoverUrlApi } from '@/api/upload';
const formRef = ref<FormInst | null>(null)
const props = defineProps<{
    active: boolean,
    detail: MediaCardDetail | null
}>()
const emit = defineEmits(['update:active', 'addDetail', 'setDetail'])
const visible = computed({
    get: () => props.active,
    set: value => emit('update:active', value)
})
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
watch(() => props.active, (isOpen) => {
    if (!isOpen) return
    if (props.detail) {
        //编辑
        // 编辑图片
        const existingUrl = props.detail.coverUrl
        oneForm.value.coverUrl = existingUrl
        FileList.value = [
            {
                id: 'existing.cover',
                name: '封面图',
                status: 'finished',
                url: existingUrl
            }
        ]
        rawFile.value = null // 编辑刚打开时，尚未选择“新文件”
        acgnType.value = props.detail.type || 'anime';
        const detailProgress = props.detail.progress
        let safeProgress
        if (acgnType.value === 'game') {
            safeProgress = { text: (detailProgress?.text) || '' }
        } else {
            safeProgress = {
                current: (detailProgress?.current) || 0,
                total: (detailProgress?.total) || 0
            }
        }
        // 重点
        const rawSeries = props.detail.series
        const safeSeries = (typeof rawSeries === 'object' && rawSeries !== null)
            ? rawSeries._id
            : rawSeries
        oneForm.value = { ...props.detail, series: safeSeries, progress: safeProgress }
        console.log(oneForm.value);
    } else {
        oneForm.value = createFrom(acgnType.value)
        oneForm.value.coverUrl = ''
        oneForm.value.type = acgnType.value
        rawFile.value = null
        FileList.value = []
    }
})
//动态的系列数据
const seriesOptions = ref()
watch(acgnType, async (newType) => {
    if (newType) {
        seriesOptions.value = await getSeriesOptions(newType)
    }
}, { immediate: true })
// 新增切换重置内容
const handleTypeChange = async (newType: AcgnType) => {
    oneForm.value = createFrom(newType)
    rawFile.value = null
    FileList.value = []
    oneForm.value.type = acgnType.value
}
//验证
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
            emit('setDetail', oneForm.value)
            result()
        } else {
            console.log('验证失败', errors);
        }
    })
}

</script>

<style scoped></style>