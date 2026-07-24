<template>
    <div class="login">
        <div class="left">
        </div>
        <div class="admin">
            <div class="admin_box">
                <n-card class="admin_card">
                    <n-tabs class="card-tabs" default-value="signin" size="large" animated
                        pane-wrapper-style="margin: 0 -4px"
                        pane-style="padding-left: 4px; padding-right: 4px; box-sizing: border-box;">
                        <n-tab-pane name="signin" tab="登录">
                            <n-form label-placement="left" label-width="auto" :model="loginForm" ref="loginRef"
                                :rules="LoginRules">
                                <n-form-item-row label="用户名" path="username">
                                    <n-input placeholder="输入用户名" v-model:value="loginForm.username"
                                        :allow-input="noSideSpace" />
                                </n-form-item-row>
                                <n-form-item-row label="密码" path="password">
                                    <n-input placeholder="输入密码" v-model:value="loginForm.password" type="password"
                                        show-password-on="click" :maxlength="8" :allow-input="noSideSpace" />
                                </n-form-item-row>
                            </n-form>
                            <n-button type="primary" block secondary strong @click="Submit('login')">
                                登录
                            </n-button>
                        </n-tab-pane>
                        <n-tab-pane name="signup" tab="注册">
                            <n-form :model="registerForm" label-placement="left" label-width="auto" ref="registerRef"
                                :rules="RegisterRules">
                                <n-form-item-row label="用户名" path="username">
                                    <n-input placeholder="输入用户名" v-model:value="registerForm.username" />
                                </n-form-item-row>
                                <n-form-item-row label="密码" path="password">
                                    <n-input placeholder="输入密码" v-model:value="registerForm.password" type="password"
                                        show-password-on="click" :maxlength="8" :allow-input="noSideSpace"
                                        @input="handlePasswordInput" />
                                </n-form-item-row>
                                <n-form-item-row label="重复密码" path="repassword" ref="rPasswordFormItemRef">
                                    <n-input placeholder="再次输入密码" v-model:value="registerForm.repassword"
                                        type="password" show-password-on="click" :maxlength="8"
                                        :allow-input="noSideSpace" />
                                </n-form-item-row>
                            </n-form>
                            <n-button type="primary" block secondary strong @click="Submit('register')">
                                注册
                            </n-button>
                        </n-tab-pane>
                    </n-tabs>
                </n-card>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { FormInst, FormItemInst, FormItemRule, FormRules } from 'naive-ui';
import { reactive, ref } from 'vue';
import { useMessage } from 'naive-ui'
const message = useMessage()
// 去空格
const noSideSpace = (value: string) => {
    return !value.startsWith(' ') && !value.endsWith(' ')
}

// 二次校验密码
const validatePasswordSame = (rule: FormItemRule, value: string): boolean => {
    if (!value) return true
    return value === registerForm.password
}

// 首密码变了触发重复密码的校验
const rPasswordFormItemRef = ref<FormItemInst | null>(null)
const handlePasswordInput = () => {
    if (registerForm.repassword) {
        rPasswordFormItemRef.value?.validate({ trigger: 'password-input' })
    }
}

// 注册数据
const registerForm = reactive({
    username: '',
    password: '',
    repassword: ''
})


// 登录数据
const loginForm = reactive({
    username: '',
    password: ''
})

// 登录钩子
const loginRef = ref<FormInst | null>(null)
// 注册钩子
const registerRef = ref<FormInst | null>(null)

// 登录校验
const LoginRules: FormRules = {
    username: [{
        required: true,
        message: '请输入用户名',
        trigger: 'blur'
    }, {
        max: 8,
        message: '用户名不可以超过八个字哦~',
        trigger: 'blur'
    }],
    password: {
        required: true,
        message: '请输入密码',
        trigger: ['input', 'blur']
    }
}

// 注册校验
const RegisterRules: FormRules = {
    username: [{
        required: true,
        message: '请输入用户名',
        trigger: 'blur'
    }, {
        max: 8,
        message: '用户名不可以超过八个字哦~',
        trigger: 'blur'
    }],
    password: {
        required: true,
        message: '请输入密码',
        trigger: ['input', 'blur']
    },
    repassword: [
        {
            required: true,
            message: '请再次输入密码',
            trigger: ['input', 'blur']
        },
        {
            required: true,
            validator: validatePasswordSame,
            message: '两次密码输入不一致',
            trigger: ['password-input', 'blur']
        }
    ]
}

// 提交事件
const Submit = (type: string) => {
    if (type === 'login') {
        loginRef.value?.validate((errors) => {
            if (!errors) {
                message.success('验证成功')
                console.log(loginForm, 'loginForm 登录');
            } else {
                console.log(errors)
                message.error('验证失败')
            }
        })

    }
    else {
        registerRef.value?.validate((errors) => {
            if (!errors) {
                message.success('验证成功')
                console.log(registerForm, 'registerForm 注册');
            } else {
                console.log(errors)
                message.error('验证失败')
            }
        })
    }
}
</script>

<style scoped lang="scss">
.login {
    height: 100%;
    display: flex;
}

.left {
    flex: 1;
    background-image:
        linear-gradient(to right, rgba(255, 255, 255, 0) 70%, rgba(255, 255, 255, 0.8) 100%),
        url(@/assets/ldws.jpg);
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
}

.admin {
    flex: 1;
    display: flex;
    justify-content: center;

    .admin_box {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 440px;
    }
}
</style>