<template>
    <n-layout-sider bordered collapse-mode="width" class="bg-sider!"  :collapsed-width="64" :width="240" show-trigger
        :collapsed="collapsed" @collapse="collapsed = true" @expand="collapsed = false">
        <div class="sider-content">
            <n-menu :options="menuOptions" :collapsed-width="64" v-model:value="activeKey"></n-menu>
        </div>
    </n-layout-sider>
</template>

<script setup lang="ts">
import { NIcon, type MenuOption } from 'naive-ui';
import { h, ref, watch, watchEffect, type Component } from 'vue'
import { RouterLink, useRoute } from 'vue-router';
import { BarChart as BarChartIcon } from '@vicons/ionicons5'
import { Book as BookIcon } from '@vicons/ionicons5'
import { Settings as SettingsIcon } from '@vicons/ionicons5'
import { Moon as MoonIcon } from '@vicons/ionicons5'
import { useMediaQuery } from '@vueuse/core';
// 屏幕宽度小于750时候 自动收起菜单 
const collapsed = ref(false)
const isMobile = useMediaQuery('(max-width: 749px)')
watch(isMobile, (mobile) => {
    collapsed.value = mobile
}, { immediate: true })
// 菜单选项与路由同步
const activeKey = ref('')
function renderIcon(icon: Component) {
    return () => h(NIcon, null, { default: () => h(icon) })
}
const route = useRoute()
watchEffect(() => {
    activeKey.value = route.name as string || 'home'
})
// 菜单数据
const menuOptions: MenuOption[] = [
    {
        label: () => h(
            RouterLink,
            {
                to: {
                    name: 'home'
                }
            },
            { default: () => '回家' }
        ),
        key: 'home',
        icon: renderIcon(BookIcon)
    },
    {
        label: () => h(
            RouterLink,
            {
                to: {
                    name: 'chart'
                }
            },
            { default: () => '看板' }
        ),
        key: 'chart',
        icon: renderIcon(BarChartIcon)
    },
    {
        label: () => h(
            RouterLink,
            {
                to: {
                    name: 'series'
                }
            },
            { default: () => '系列' }
        ),
        key: 'series',
        icon: renderIcon(MoonIcon)

    },
    {
        label: () => h(
            RouterLink,
            {
                to: {
                    name: 'setting'
                }
            },
            { default: () => '设置' }
        ),
        key: 'setting',
        icon: renderIcon(SettingsIcon)

    }
]
// 选中样式
</script>

<style scoped lang="scss">
:deep(.n-menu-item-content--selected *) {
    color: #FFFFFF !important;
}

.n-layout-sider {
    background-color: var(--sider-bg);
    padding-top: 24px;
    color: #fff;
}
</style>