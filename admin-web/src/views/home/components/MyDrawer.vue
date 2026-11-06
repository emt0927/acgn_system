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
                <n-form-item v-for="item in dynamicForm" :key="item.key" :label="item.label"
                    :path="item.rulePath || item.key">
                    <n-input v-model:value="oneForm[item.key]" v-if="item.formType === 'textarea'" type="textarea"
                        :rows="3" />
                    <n-upload v-else-if="item.formType === 'url'" list-type="image-card" :max="1"
                        :default-upload="false" @change="handleFileChange($event, (val) => oneForm.coverUrl = val)"
                        v-model:file-list="fileList">
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
                    <n-button @click="reset">
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
import { createMediaForm, FIELD_SCHEMAS } from '../Schema';
import { useMessage, type FormInst, type FormRules, } from 'naive-ui';
import { getBangumiDetailApi } from '@/api/bangumi';
import BangumuList from '@/components/BangumuList.vue';
import { addMediaApi, putUpdateMediaApi } from '@/api/media';
import { trackRecordApi } from '@/api/record';
import { useCoverUpload } from '@/composables/useCoverUpload';
import { getSeriesListApi } from '@/api/serires';
const formRef = ref<FormInst | null>(null)
const { fileList, setPreviewCover, setCoverFromRemoteUrl, handleFileChange, uploadIfNeeded } = useCoverUpload()
// bangumi相关
const bangumiListState = ref(false)
const getBgmMedia = async (id: any) => {
    // bangumi获取到的详情数据 用于抽屉回显
    const res = await getBangumiDetailApi({ id, type: acgnType.value })
    if (res.data.coverUrl) {
        const { totalEpisodes, ...restDetail } = res.data
        if (totalEpisodes) {
            oneForm.value.progress.total = totalEpisodes
        }
        await setCoverFromRemoteUrl(res.data.coverUrl)
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

//重置数据
const reset = () => {
    oneForm.value = createMediaForm('anime')
    acgnType.value = 'anime'
    setPreviewCover()
    formRef.value?.restoreValidation()
}
// 校验规则
const rules = computed<FormRules>(() => {
    const currentSchema = FIELD_SCHEMAS[acgnType.value] || []
    const rulesObj: FormRules = {}
    currentSchema.forEach(field => {
        if (!field.required) return
        const path = field.rulePath || field.key
        const isSelect = field.formType === 'select' || field.formType === 'date' || field.formType === 'url'
        rulesObj[path] = {
            required: true,
            type: field.formType === 'progress-pair' ? 'number' : 'string',
            message: `请${isSelect ? '选择' : '输入'}${field.label}`,
            trigger: isSelect ? 'change' : ['blur', 'input']
        }
    })
    return rulesObj
})
// 系列函数
 const getSeriesOptions = async (type: AcgnType) => {
    const data = await getSeriesListApi()
    const list = data.data?.list || []
    return list.filter(item => item.type === type).map(item => ({
        label: item.title,
        value: item.id
    }))
}
const visible = ref(false)
const emit = defineEmits(['success'])
const open = async (detail?: MediaCardDetail) => {
    visible.value = true
    setPreviewCover(detail?.coverUrl)
    acgnType.value = detail?.type || 'anime';
    oneForm.value = createMediaForm(acgnType.value, detail)
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
    oneForm.value = createMediaForm(newType)
    setPreviewCover()
    seriesOptions.value = await getSeriesOptions(newType)
}
//验证
const message = useMessage()
const handleValidateClick = (e: MouseEvent) => {
    e.preventDefault()
    formRef.value?.validate(async (errors) => {
        if (!errors) {
            // 传图片
                oneForm.value.coverUrl = await uploadIfNeeded(oneForm.value.coverUrl)
            if (oneForm.value.id) {
                const res = await putUpdateMediaApi(oneForm.value)
                message.success(res.message)
            } else {
                const res = await addMediaApi(oneForm.value)
                message.success(res.message)
                await trackRecordApi('media', oneForm.value.title, 'add')
            }
            reset()
            visible.value = false // 自己关掉抽屉
            emit('success')       // 喊父组件刷新列表
        } else {
            console.log('验证失败', errors);
        }
    })
}

</script>

<style scoped></style>