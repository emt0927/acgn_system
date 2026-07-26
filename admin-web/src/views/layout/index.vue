<template>
    <n-layout position="absolute" class="layout-container">
        <!-- 1. 顶部 Header -->
        <n-layout-header style="height: 64px;" bordered>
            <div class="head-left">
                <div class="title">ACNG Realm</div>
                <div class="search">
                    <n-input-group>
                        <n-input :style="{ width: '50%', backgroundColor:' rgba(255, 255, 255, 0.65) !important' }" />
                        <n-button type="primary" >
                            搜索
                        </n-button>
                    </n-input-group>
                </div>
            </div>
            <div class="head-right">
                <img src="../../assets/ldws.jpg" alt="" class="avatar">
                <div class="exit" @click="exit">退出</div>
            </div>
        </n-layout-header>

        <!-- 2. 中间区域：Sider + Content -->
        <n-layout has-sider position="absolute" style="top: 64px; bottom: 48px;">
            <!-- 左侧边栏 -->
            <n-layout-sider bordered collapse-mode="width" :collapsed-width="100" :width="240" show-trigger>
                <div class="sider-content">海淀桥</div>
            </n-layout-sider>

            <!-- 右侧内容区 -->
            <n-layout-content content-style="padding: 24px; min-height: 100%; box-sizing: border-box;">
                <!-- 中间用一个卡片承载内容，既能看清字，又能隐约透出背景 -->
                <div class="main-card">
                    <router-view>平山道</router-view>
                </div>
            </n-layout-content>
        </n-layout>

        <!-- 3. 底部 Footer -->
        <n-layout-footer position="absolute" style="height: 48px; bottom: 0; padding: 0 24px;" bordered>
            <div class="footer-content">成府路</div>
        </n-layout-footer>
    </n-layout>
</template>

<script setup lang="ts">
// 点击退出
const exit = () => {
    console.log('我退出了');
}
</script>

<style scoped lang="scss">
/* 1. 最外层：设置背景图 */
.layout-container {
    /* 🌟 把这里的 url 替换成你的二次元背景图本地路径（如：@/assets/bg.jpg）或网络地址 */
    background-image: url('../../assets/1.png');
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
}

/* 2. 穿透清除 Naive UI 内部组件默认的纯白底色，避免挡住背景图 */
:deep(.n-layout),
:deep(.n-layout-footer),
:deep(.n-layout-scroll-container) {
    background-color: transparent !important;
}

/* 3. 顶部 Header 透明度控制 */
.n-layout-header {
    /* 💡 最后一个参数 0.75 就是透明度，数值越小越透（范围 0 ~ 1） */
    background-color: rgba(255, 255, 255, 0.6) !important;
    backdrop-filter: blur(5px);
    /* 建议保留毛玻璃，防止背景图花哨导致看清字 */
    border-bottom: 1px solid rgba(229, 231, 235, 0.6) !important;
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

/* 4. 左侧 Sider 透明度控制 */
.n-layout-sider {
    background-color: rgba(255, 255, 255, 0.6) !important;
    backdrop-filter: blur(5px);
    border-right: 1px solid rgba(229, 231, 235, 0.6) !important;
}

.sider-content {
    padding: 16px;
    color: #374151;
}

/* 5. 右侧内容区背景：保持透明，靠内部的 .main-card 控制透光度 */
.n-layout-content {
    background-color: transparent !important;
}

/* 6. 中间内容卡片：这里的透明度建议设高一点（如 0.85），方便后续阅读表格和表单 */
.main-card {
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    padding: 24px;
    /* 💡 调节这里的 0.85：数值越低越透背景，数值越高看文字越清晰 */
    background-color: rgba(255, 255, 255, 0.25);
    backdrop-filter: blur(2.5px);
    border-radius: 4px;
    border: 1px solid rgba(255, 255, 255, 0.5);
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.05);
    color: #111827;
}

/* 7. 底部 Footer 透明度控制 */
.n-layout-footer {
    background-color: rgba(255, 255, 255, 0.6) !important;
    backdrop-filter: blur(10px);
    border-top: 1px solid rgba(229, 231, 235, 0.6) !important;
}

.footer-content {
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
}
</style>