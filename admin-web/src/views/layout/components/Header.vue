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
            <div @click="userStore.toggleDark" class="flex justify-center items-center">
                <n-icon size="24" color="text-sider">
                    <MoonIcon  v-if="userStore.isDark"/>
                    <SunnyIcon v-else/>
                </n-icon>
            </div>
            <img src="../../../assets/ldws.jpg" alt="" class="avatar">
            <div class="exit" @click="exit">退出</div>
        </div>
    </n-layout-header>

</template>

<script setup lang="ts">
import { useUserStore } from '@/store';
import { Sunny as SunnyIcon} from '@vicons/ionicons5'
import { Moon as MoonIcon } from '@vicons/ionicons5'
const userStore = useUserStore()
// 点击退出
const exit = () => {
    console.log('我退出了');
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

    .exit {
        cursor: pointer;
    }
}
</style>