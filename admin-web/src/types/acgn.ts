/**
 * anime 动漫
 * manga 漫画
 * game 游戏
 * novel 小说
 */
export type AcgnType = 'anime' | 'manga' | 'game' | 'novel'

/**
 * 追追状态
 * wish 想看
 * doing 在看(追更)
 * done 看过(通过)
 * dropped 弃坑
 */
export type AcgnStatus = 'wish' | 'doing' | 'done' | 'dropped'

export interface AcgnItem {
    /** 记录唯一ID */
    id: string

    /** 作品名称 (如: 新蔷薇少女) */
    title: string

    /** 🌟 原名/外文名 (如: ローゼンメイデン) */
    originalTitle?: string

    /** 🌟 所属系列 (如: 蔷薇少女) */
    series?: string

    /** 大类分类 (anime | manga | game | novel) */
    type: AcgnType

    /** 🌟 细分类型 (如: TV动画 / 剧场版 / OVA / RPG) */
    subType?: string

    /** 个人标记状态 (doing | wish | done | dropped) */
    status: AcgnStatus

    /** 个人评分 (1-10分 或 1-5星) */
    rating: number

    /** 进度 (如: 13集 / 第5卷 / 一周目通关) */
    progress: string

    /** 封面图链接 */
    coverUrl?: string

    /** 自定义标签 (如: ["奇幻", "魔法", "经典"]) */
    tags: string[]

    /** 个人简评 / 吐槽 (你自己写的观后感) */
    comment?: string

    // ================= 🌟 制作信息 (根据类型可选填写) =================
    /** 🌟 作者 / 原作 (漫画/小说主要字段，动画原作者) */
    author?: string
    /** 导演/监督 (动画独有，如: 畠山守) */
    director?: string

    /** 制作公司 / 游戏开发商 (如: スタジオディーン / 游戏科学) */
    studio?: string

    // ================= 时间记录 =================
    /** 开始看/玩的时间 */
    startDate?: string

    /** 完结/通关时间 */
    finishDate?: string

    /** 最后修改时间 */
    updatedAt: string
}