<template>
    <n-layout-header style="height: 64px;" bordered>
        <div class="head-left">
            <div class="title">ACNG Realm</div>
            <div class="search">
                <n-input-group>
                    <n-input :style="{ width: '50%' }" />
                    <n-button type="primary">
                        搜索
                    </n-button>
                </n-input-group>
            </div>
        </div>
        <div class="head-right">
            <div @click="userStore.toggleDark" class="flex justify-center items-center cursor-pointer">
                <n-icon size="24" color="text-sider">
                    <MoonIcon v-if="userStore.isDark" />
                    <SunnyIcon v-else />
                </n-icon>
            </div>
            <n-dropdown trigger="hover" :options="options" @select="handleSelect">
                <img :src="userStore.userInfo.coverurl" alt="" class="avatar">
            </n-dropdown>
        </div>
    </n-layout-header>

</template>

<script setup lang="ts">
import { useUserStore } from '@/store';
import { Sunny as SunnyIcon } from '@vicons/ionicons5'
import { Moon as MoonIcon } from '@vicons/ionicons5'
import { useMessage } from 'naive-ui';
import { useRouter } from 'vue-router'
const router = useRouter()
const userStore = useUserStore()
const message = useMessage()
const options = [{
    label: '退出登录',
    key: 'logout'
}, {
    label: '其他',
    key: 'any'
}]

const handleSelect = (key: string) => {
    if (key === 'logout') {
        userStore.logout()
        message.success('已退出登录')
        router.replace('/login')
    } else if (key === 'any') {
        console.log('我是其他');
    }
}

</script>
<style scoped lang="scss">
/* 3. 顶部 Header 透明度控制 */
.n-layout-header {
    line-height: 64px;
    display: flex;
    justify-content: space-between;
}

.head-left {
    display: flex;

    .title {
        width: 240px;
        text-align: center;
    }

    .search {
        display: flex;
        align-items: center;
    }

}

.head-right {
    margin-right: 90px;
    display: flex;
    align-items: center;
    flex-shrink: 0;
    white-space: nowrap;

    .avatar {
        border-radius: 50%;
        width: 48px;
        height: 48px;
        margin: 0 10px;
    }
}
</style>