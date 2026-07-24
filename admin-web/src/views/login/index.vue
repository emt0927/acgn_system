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
                            <n-form>
                                <n-form-item-row label="用户名">
                                    <n-input />
                                </n-form-item-row>
                                <n-form-item-row label="密码">
                                    <n-input />
                                </n-form-item-row>
                            </n-form>
                            <n-button type="primary" block secondary strong>
                                登录
                            </n-button>
                        </n-tab-pane>
                        <n-tab-pane name="signup" tab="注册">
                            <n-form>
                                <n-form-item-row label="用户名">
                                    <n-input />
                                </n-form-item-row>
                                <n-form-item-row label="密码">
                                    <n-input />
                                </n-form-item-row>
                                <n-form-item-row label="重复密码">
                                    <n-input />
                                </n-form-item-row>
                            </n-form>
                            <n-button type="primary" block secondary strong>
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
console.log('我是登录');
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