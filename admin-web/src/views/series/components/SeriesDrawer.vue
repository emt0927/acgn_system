<template>
    <n-drawer v-model:show="active" :width="502">
        <n-drawer-content :title="oneForm?.id ? '编辑系列' : '新增系列'">
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
                label-width="auto" :key="acgnType" require-mark-placement="left" :rules="rules">
                <n-form-item label="快速导入">
                    <n-button text target="_blank" type="primary" @click="bangumiListState = true">
                        从bangumi导入
                    </n-button>
                </n-form-item>
                <n-form-item v-for="item in dynamicForm" :key="item.key" :label="item.label" :path="item.key">
                    <n-upload v-if="item.type === 'url'" :default-upload='false' :max="1" list-type="image-card"
                        v-model:file-list="FileList" @change="setCoverUrl">
                    </n-upload>
                    <n-dynamic-tags v-model:value="oneForm[item.key]" v-else-if="item.formType === 'tags'" :max="5" />
                    <n-input v-model:value="oneForm[item.key]" v-else-if="item.formType === 'textarea'" type="textarea"
                        :rows="3" :placeholder="`请输入${item.label}`" />
                    <n-input v-else v-model:value="oneForm[item.key]" :placeholder="`请输入${item.label}`" />
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
import type { AcgnType, SeriesDetail } from '@/types/acgn';
import { computed, ref } from 'vue';
import { SERIES_SCHEMAS } from '../Schema';
import { useMessage, type FormInst, type FormRules, type UploadFileInfo } from 'naive-ui';
import { uploadCoverUrlApi } from '@/api/upload';
import { getBangumiDetailApi } from '@/api/bangumi';
import BangumuList from '@/components/BangumuList.vue';
import { addSeriesApi, putSeriesDetailApi } from '@/api/serires';
import { trackRecordApi } from '@/api/record';

// 作品的不同状态
const acgnType = ref<AcgnType>('anime')
// 切换类型重置数据
const handleTypeChange = () => {
    oneForm.value.type = acgnType.value
    oneForm.value = createFrom()
    FileList.value = []
    rawFile.value = null
}
// 显示数据
const dynamicForm = computed(() => {
    const schema = SERIES_SCHEMAS
    return schema.filter(item => item.editable !== false)
})
// 录入值
const oneForm = ref<Record<string, any>>({});
// 创建表单结构
const createFrom = () => {
    const schema = SERIES_SCHEMAS
    const form: Record<string, any> = {}
    schema.forEach(item => {
        if (item.key === 'tags') {
            form[item.key] = []
        } else {
            form[item.key] = null
        }
    })
    return form
}
// bangumi列表状态
const bangumiListState = ref(false)
// url转file
const urlToFile = async (url: string, fileName = 'cover.jpg'): Promise<File> => {
    const res = await fetch(url)
    const blob = await res.blob()
    return new File([blob], fileName, { type: blob.type || 'image/jpeg' })
}

// 拿到bgm回显的数据
const getBgmMedia = async (id: any) => {
    // bangumi获取到的详情数据 用于抽屉回显
    const res = await getBangumiDetailApi({ id, type: 'series' })
    if (res.data.coverUrl) {
        const file = await urlToFile(res.data.coverUrl)
        FileList.value = [{
            id: 'existing.cover',
            name: '封面图',
            status: 'finished',
            url: res.data.coverUrl
        }]
        rawFile.value = file
        oneForm.value = { ...oneForm.value, ...res.data }
        bangumiListState.value = false
    }
}
// 图片上传
const FileList = ref<UploadFileInfo[]>([])
const rawFile = ref<File | null>(null) // 专门在外面存原生文件的响应式变量
const setCoverUrl = ({ file }: { file: UploadFileInfo }) => {
    if (file.status !== 'removed' && file.file) {
        rawFile.value = file.file
        oneForm.value.coverUrl = file.name
    } else {
        rawFile.value = null
        oneForm.value.coverUrl = ''
    }
}
const active = ref(false)
const open = async (detail?: SeriesDetail) => {
    active.value = true
    if (detail && detail.id) {
        acgnType.value = detail.type || 'anime'
        oneForm.value = {
            ...detail,
            tags: detail.tags || []
        }
        // 编辑图片
        FileList.value = [{
            id: 'existing.cover',
            name: '封面图',
            status: 'finished',
            url: detail.coverUrl
        }]
        rawFile.value = null // 编辑刚打开时，尚未选择“新文件”
    } else {
        oneForm.value = createFrom()
        oneForm.value.type = acgnType.value
        rawFile.value = null
        FileList.value = []
    }
}
defineExpose({ open })
// 规则
const rules = computed<FormRules>(() => {
    const rulesObj: FormRules = {}
    const Schema = SERIES_SCHEMAS
    Schema.forEach(item => {
        if (!item.required) return
        const isSelect = item.formType === 'url'
        rulesObj[item.key] = {
            required: true,
            message: `请${isSelect ? '选择' : '输入'}${item.label}`,
            trigger: isSelect ? 'change' : ['blur', 'input']
        }
    })
    return rulesObj
})
// 表单ref
const formRef = ref<FormInst | null>(null)
const emit = defineEmits(['success'])
const message = useMessage()
// 提交校验
const handleValidateClick = (e: MouseEvent) => {
    e.preventDefault() // 阻止默认事件
    formRef.value?.validate(async errors => {
        if (!errors) {
            if (rawFile.value) {
                const formdata = new FormData()
                formdata.append('file', rawFile.value)
                const res = await uploadCoverUrlApi(formdata)
                oneForm.value.coverUrl = res.data?.url
            }
            if (oneForm.value.id) {
                const res = await putSeriesDetailApi(oneForm.value)
                message.success(res.message)
            } else {
                const res = await addSeriesApi(oneForm.value)
                message.success(res.message)
                // 记录
                await trackRecordApi('series', oneForm.value.title, 'add')
            }
            result()
            active.value = false
            emit('success')       // 喊父组件刷新列表
        } else {
            console.log('校验失败', errors);
        }
    })
}

// 重置表单
const result = () => {
    oneForm.value = createFrom()
    FileList.value = []
    rawFile.value = null
    formRef.value?.restoreValidation()
}
</script>

<style scoped></style>