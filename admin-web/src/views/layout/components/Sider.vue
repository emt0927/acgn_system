<template>
    <n-layout-sider bordered collapse-mode="width" :collapsed-width="64" :width="240" show-trigger>
        <div class="sider-content">
            <n-menu :options="menuOptions" :collapsed-width="64"></n-menu>
        </div>
    </n-layout-sider>
</template>

<script setup lang="ts">
import { NIcon, type MenuOption } from 'naive-ui';
import { h, type Component } from 'vue'
import { RouterLink } from 'vue-router';
import { BarChart as BarChartIcon } from '@vicons/ionicons5'
import { Book as BookIcon } from '@vicons/ionicons5'
import { Settings as SettingsIcon } from '@vicons/ionicons5'
import { Moon as MoonIcon } from '@vicons/ionicons5'
function renderIcon(icon: Component) {
    return () => h(NIcon, null, { default: () => h(icon) })
}
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
        key: 'go-back-home',
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
        key: 'go-back-chart',
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
        key: 'go-back-series',
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
        key: 'go-back-setting',
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
    background-color: #3B7549;
    padding-top: 24px;
    color: #fff;
}
</style>