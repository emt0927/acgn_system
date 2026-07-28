<template>
    <n-layout position="absolute" class="layout-container">
        <!-- 1. 顶部-->
        <Header></Header>
        <!-- 2. 中间区域-->
        <n-layout has-sider position="absolute" style="top: 64px;">
            <!-- 左侧边栏 -->
            <Sider></Sider>
            <!-- 右侧内容区 -->
            <n-layout-content content-style="padding: 24px; min-height: 100%; box-sizing: border-box; background-color:#f5f5f5">
                <!-- 中间用一个卡片承载内容 -->
                <router-view></router-view>
            </n-layout-content>
        </n-layout>
        <!-- 3. 底部-->
           <Footer></Footer>
    </n-layout>
</template>

<script setup lang="ts">
import Footer from './components/Footer.vue';
import Header from './components/Header.vue';
import Sider from './components/Sider.vue';


</script>

<style scoped lang="scss">
/* 1. 最外层：设置背景图 */
// .layout-container {
//     /* 🌟 把这里的 url 替换成你的二次元背景图本地路径（如：@/assets/bg.jpg）或网络地址 */
//     background-image: url('../../assets/1.png');
//     background-size: cover;
//     background-position: center;
//     background-repeat: no-repeat;
// }
</style>