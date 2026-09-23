<template>
  <MyCard>
    <template #cardTab>个人资料</template>
    <div class="p-6 flex-1 flex justify-center">
      <n-form ref="formRef" :model="oneForm" :rules="rules" label-placement="left" label-width="auto"
        require-mark-placement="left" :style="{
          maxWidth: '660px', width: '400px'
        }">
        <n-popover trigger="hover">
          <template #trigger>
            <n-upload class="flex justify-center mb-6" :default-upload='false' :show-file-list="false"
              @change="setCoverUrl" accept="image/*">
              <div
                class="group relative w-24 h-24 rounded-full overflow-hidden cursor-pointer flex flex-col items-center justify-center transition-all bg-gray-50">
                <template v-if="previewUrl || oneForm.coverurl">
                  <img :src="previewUrl || oneForm.coverurl" alt="头像" class="w-full h-full object-cover" />
                </template>
                <template v-else>
                  <span class="text-2xl text-gray-400 group-hover:text-sky-500 mb-0.5 font-light">+</span>
                </template>
              </div>
            </n-upload>
          </template>
          <span>点击更换头像</span>
        </n-popover>
        <n-form-item :label="item.label" :path="item.key" v-for="item in dynamicForm" :key="item.key">
          <n-input v-if="item.key === 'username'" disabled v-model:value="oneForm[item.key]" />
          <n-input v-else v-model:value="oneForm[item.key]" :placeholder="`请输入${item.label}`" />
        </n-form-item>
        <div class="flex justify-center">
          <n-button type="primary" @click="submit">
            提交修改
          </n-button>
        </div>
      </n-form>
    </div>
  </MyCard>
</template>

<script setup lang="ts">
import MyCard from '@/components/MyCard.vue';
import { computed, ref } from 'vue';
import { formSchema } from './Schema';
import { useMessage, type FormInst, type FormRules, type UploadFileInfo } from 'naive-ui';
import { uploadCoverUrlApi } from '@/api/upload';
import { postUserInfoApi } from '@/api/user';
import { onMounted } from 'vue';
import { useUserStore } from '@/store';
// 展示数据
const dynamicForm = computed(() => {
  const schema = formSchema.filter(item => item.key !== 'coverurl')
  return schema
})
const oneForm = ref<Record<string, any>>({})
// 初始化表单结构
const createForm = () => {
  const schema = formSchema
  schema.forEach(item => {
    oneForm.value[item.key] = ''
  })
}
createForm()
// 规则
const rules = computed<FormRules>(() => {
  const rulesObj: FormRules = {}
  const schma = formSchema
  schma.forEach(item => {
    if (item.key === 'username') return
    if (item.key === 'allpassword') {
      rulesObj[item.key] = {
        trigger: ['blur', 'input'],
        validator(_rule, value: string) {
          const newPassword = oneForm.value.newpassword
          if (!value && !newPassword) {
            return true;
          }
          if (newPassword && !value) {
            return new Error('请再次确认新密码')
          }
          if (!newPassword && value) {
            return new Error('请先输入新密码')
          }
          if (value !== newPassword) {
            return new Error('两次输入的密码不一致')
          }
          return true
        }
      }
    }
    else if (item.key === 'newpassword') {
      rulesObj[item.key] = {
        trigger: ['blur', 'input'],
        validator(_rule, value: string) {
          if (!value) return true
          if (value.length < 4) {
            return new Error('新密码长度不能少于4位')
          }
          return true
        }
      }
    } else {
      rulesObj[item.key] = {
        trigger: ['blur', 'input'],
        validator(_rule, value: string) {
          if (!value) return true
          if (value.trim().length > 10) {
            return new Error(`${item.label}不能超过20个字符`)
          }
          return true
        }
      }
    }
  })
  return rulesObj
})
const rawFile = ref<File | null>(null)
// 本地预览
const previewUrl = ref<string>('')
// 图片上传
const setCoverUrl = ({ file }: { file: UploadFileInfo }) => {
  if (file.status === 'removed') {
    rawFile.value = null
    oneForm.value.coverurl = ''
    previewUrl.value = ''
    return
  }
  if (file.file) {
    rawFile.value = file.file
    previewUrl.value = URL.createObjectURL(file.file)
  }
}
const userStore = useUserStore()
onMounted(() => {
  oneForm.value.nickname = userStore.userInfo.nickname
  oneForm.value.coverurl = userStore.userInfo.coverurl
  oneForm.value.username = userStore.userInfo.username
})
// 提交
const formRef = ref<FormInst | null>(null)
const message = useMessage()
const submit = () => {
  formRef.value?.validate(async errors => {
    if (!errors) {
      try {
        if (rawFile.value) {
          const formdata = new FormData()
          formdata.append('file', rawFile.value)
          const res = await uploadCoverUrlApi(formdata)
          oneForm.value.coverurl = res.data?.url
        }
        // 存入后端
        const { coverurl, nickname, allpassword } = oneForm.value
        const res = await postUserInfoApi({ coverurl, nickname, allpassword })
        if (res.code === 200) {
          message.success(res.message)
          rawFile.value = null
          await userStore.getUserinfoData()
        } else {
          message.error(res.message)
        }
      } catch (error) {
        console.log(error);
      }
    }
  })
}
</script>

<style scoped></style>