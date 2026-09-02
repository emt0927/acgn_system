import { seriesData } from "@/mock/acgnData";
import { SUB_TYPE_OPTIONS_MAP, type AcgnType, type MediaCardDetail } from "@/types/acgn"

// 四种渲染状态
type RenderType = 'rating' | 'block' | 'link' | 'state' | 'progress' | 'url' | 'date'

// 通用状态选项
export const COMMON_STATUS_OPTIONS = [
    { label: '准备追', value: 'wish' },
    { label: '正在追', value: 'doing' },
    { label: '已追完', value: 'done' },
    { label: '已弃坑', value: 'dropped' },
];

// 2. 游戏专用的状态选项
export const GAME_STATUS_OPTIONS = [
    { label: '准备玩', value: 'wish' },
    { label: '正在玩', value: 'doing' },
    { label: '已通关', value: 'done' },
    { label: '已退坑', value: 'dropped' },
];

// 状态的文字转换
export const getStatusLabel = (type: string, status: string) => {
    const options = type === 'game' ? GAME_STATUS_OPTIONS : COMMON_STATUS_OPTIONS
    const match = options.find(item => item.value === status)
    return match ? match.label : '未知'
}
// 表单type
export type FormType =
    | 'input'
    | 'textarea'
    | 'select'
    | 'rate'
    | 'date'
    | 'url'
    | 'progress-pair' // 非游戏：{ current, total }
    | 'progress-text'; // 游戏：{ text }

export interface FieldConfig {
    label: string,
    key: keyof MediaCardDetail,
    type?: RenderType, // 详情展示用
    formType?: FormType, // 表单输入控件类型
    editable?: boolean,
    options?: { label: string; value: any }[],
    required?: boolean // 是否为必填项
}
// 公共类型
// 头部
const COMMON_HEADER: FieldConfig[] = [
    { label: '封面', key: 'coverUrl', type: 'url', required: true, formType: 'url' },
    { label: '标题', key: 'title', required: true },
    { label: '原名', key: 'originalTitle' }
]
// 尾部
const getCommonFooter = (type: AcgnType): FieldConfig[] => {
    const isGame = type === 'game'
    return [
        {
            label: isGame ? '游戏进度' : '追更进度',
            key: 'progress',
            type: 'progress',
            formType: isGame ? 'progress-text' : 'progress-pair',
            required: true
        },
        {
            label: '状态',
            key: 'status',
            type: 'state',
            formType: 'select',
            options: isGame ? GAME_STATUS_OPTIONS : COMMON_STATUS_OPTIONS,
            required: true
        },
        { label: '评分', key: 'rating', type: 'rating', formType: 'rate' },
        { label: '个人点评', key: 'comment', type: 'block', formType: 'textarea' },
        { label: '作品介绍', key: 'introduction', formType: 'textarea' },
        { label: '开始时间', key: 'startDate', formType: 'date' },
        { label: '结束时间', key: 'finishDate', formType: 'date' },
        { label: '添加时间', key: 'updatedAt', editable: false, type: 'date' },
    ]
}

// 系列函数
const getSeries = (type: AcgnType): FieldConfig => {
    const schema = seriesData.filter(item => item.type === type)
    const arr = schema.map(item => {
        return {
            label: item.title,
            value: String(item.id)
        }
    })
    return {
        label: '系列',
        key: 'series',
        type: 'link',
        formType: 'select',
        options: arr
    }
}
// 划分具体差异
export const FIELD_SCHEMAS: Record<AcgnType, FieldConfig[]> = {
    anime: [
        ...COMMON_HEADER,
        getSeries('anime'),
        { label: '类型', key: 'subType', required: true, formType: 'select', options: SUB_TYPE_OPTIONS_MAP['anime'] },
        { label: '原作', key: 'author' },
        { label: '导演', key: 'director' },
        { label: '动画公司', key: 'studio' },
        ...getCommonFooter('anime')
    ],
    game: [
        ...COMMON_HEADER,
        getSeries('game'),
        { label: '类型', key: 'subType', required: true, formType: 'select', options: SUB_TYPE_OPTIONS_MAP['game'] },
        { label: '游戏公司', key: 'studio', required: true },
        ...getCommonFooter('game')
    ],
    manga: [
        ...COMMON_HEADER,
        getSeries('manga'),
        { label: '类型', key: 'subType', required: true, formType: 'select', options: SUB_TYPE_OPTIONS_MAP['manga'] },
        { label: '原作', key: 'author' },
        { label: '出版社', key: 'studio' },
        ...getCommonFooter('manga')
    ],
    novel: [
        ...COMMON_HEADER,
        getSeries('novel'),
        { label: '类型', key: 'subType', required: true, formType: 'select', options: SUB_TYPE_OPTIONS_MAP['novel'] },
        { label: '原作', key: 'author' },
        { label: '出版社', key: 'studio' },
        ...getCommonFooter('novel')
    ],
}
// 原作 作者 / 原作 (漫画/小说主要字段，动画原作者)
// 导演 动漫独有
// 制作公司 游戏独有

