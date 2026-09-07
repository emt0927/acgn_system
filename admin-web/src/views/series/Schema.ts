import type { SeriesDetail } from "@/types/acgn"
// 详情类型展示
type RenderType = 'url' | 'tags' | 'comment' | 'date'
/**
 * 
 *系列相关类型
 * @memberof SeriesFieldConfig
 */
// 表单渲染
export type FormType = 'input' | 'url' | 'tags' | 'textarea'
export interface SeriesFieldConfig {
    /** 左侧label */
    label: string
    /** 详情页展示类型 */
    type?: RenderType
    /** 详情页展示类型 */
    key: keyof SeriesDetail
    /** 表单渲染 */
    formType?: FormType
    /** 是否为必填项 */
    required?: boolean
    /** 非显示项 */
    editable?: boolean
    hideInDetail?: boolean

}
export const SERIES_SCHEMAS: SeriesFieldConfig[] = [
    {
        label: '封面',
        key: 'coverUrl',
        type: 'url',
        formType: 'url',
        required: true,
        hideInDetail: true
    },
    {
        label: '标题',
        key: 'title',
        formType: 'input',
        required: true
    },
    {
        label: '原名',
        key: 'originalTitle',
        formType: 'input'
    },
    {
        label: '标签',
        key: 'tags',
        type: 'tags',
        formType: 'tags'
    },
    {
        label: '评价',
        key: 'comment',
        type: 'comment',
        formType: 'textarea'
    },
    {
        label: '录入时间',
        key: 'updatedAt',
        type: 'date',
        editable: false,
        hideInDetail: true
    },
]