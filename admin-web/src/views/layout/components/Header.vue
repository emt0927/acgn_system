<template>
    <n-layout-header style="height: 64px;" bordered>
        <div class="head-left">
            <div class="title">ACNG Realm</div>
            <div class="search">
                <n-input-group>
                    <n-input :style="{ width: '50%', backgroundColor: ' rgba(255, 255, 255, 0.65) !important' }" />
                    <n-button type="primary">
                        搜索
                    </n-button>
                </n-input-group>
            </div>
        </div>
        <div class="head-right">
            <img src="../../../assets/ldws.jpg" alt="" class="avatar">
            <div class="exit" @click="exit">退出</div>
        </div>
    </n-layout-header>

</template>

<script setup lang="ts">
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

    .avatar {
        border-radius: 50%;
        width: 48px;
        height: 48px;
    }

    .exit {
        margin-left: 10px;
        cursor: pointer;
    }
}
</style>