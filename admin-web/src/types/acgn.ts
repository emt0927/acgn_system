/**
 * anime 动漫
 * manga 漫画
 * game 游戏
 * novel 小说
 */
export type AcgnType = 'anime' | 'manga' | 'game' | 'novel'

/**
 * 追追状态
 * wish 想看(想玩)
 * doing 追更(在玩)
 * done 看过(通关)
 * dropped 弃坑(退坑)
 */
export type AcgnStatus = 'wish' | 'doing' | 'done' | 'dropped'
/**
 标签
 */
// 1. 各大类的标准细分类型定义
export type AnimeSubType = 'TV动画' | '剧场版' | 'OVA/OAD' | 'Web动画' | '特摄';
export type MangaSubType = '连载漫画' | '条漫/Webtoon' | '四格漫画' | '同人志/短篇';
export type NovelSubType = '轻小说' | '网络小说' | '实体小说';
export type GameSubType = 'RPG/JRPG' | 'ACT动作' | 'AVG/Galgame' | 'SLG策略' | 'FPS/TPS射击' | 'SIM模拟' | '卡牌/独立';

// 2. 联合类型（支持字面量智能提示 + 允许随意输入任意 string）
export type SubType =
    | AnimeSubType
    | MangaSubType
    | NovelSubType
    | GameSubType

export const SUB_TYPE_OPTIONS_MAP: Record<AcgnType, { label: string, value: string }[]> = {
    anime: [
        { label: 'TV动画', value: 'TV动画' },
        { label: '剧场版', value: '剧场版' },
        { label: 'OVA/OAD', value: 'OVA/OAD' },
        { label: 'Web动画', value: 'Web动画' },
    ],
    manga: [
        { label: '连载漫画', value: '连载漫画' },
        { label: '条漫/Webtoon', value: '条漫/Webtoon' },
        { label: '四格漫画', value: '四格漫画' },
    ],
    novel: [
        { label: '轻小说', value: '轻小说' },
        { label: '网络小说', value: '网络小说' },
        { label: '实体小说', value: '实体小说' },
    ],
    game: [
        { label: 'RPG/JRPG', value: 'RPG/JRPG' },
        { label: 'ACT动作', value: 'ACT动作' },
        { label: 'AVG/Galgame', value: 'AVG/Galgame' },
        { label: 'SLG策略', value: 'SLG策略' },
    ],
}
/*
作品
*/
// 统一进度
export interface ProgressInfo {
    /**
           * 当前进度值（28集 / 45小时 / 85%）
           */
    current?: number;
    /**
  * 总量（28集 / 100小时 / 100% 可选
  */
    total?: number;
    /**
     *  【核心】自定义显示文本。如果存在，直接优先显示此字段！
     */
    text?: string;
}
export interface MediaCardItem {
    /**id */
    id: number;
    /**作品标题 */
    title: string;
    /**图片地址 */
    coverUrl: string;
    /**作品类型 */
    type: AcgnType;        // 'anime' | 'comic' | 'game' | 'novel'
    /**左侧状态标签 */
    subType: SubType;   // 角标左侧，如: "TV动画", "RPG", "单机"
    /**状态 */
    status: AcgnStatus;     // 状态
    /**评分 */
    rating: number;         // 评分，如 10
    /**进度 */

    // 🌟 通用进度数据模型
    progress: ProgressInfo
    /**关联的系列id */
    seriesId?: number | null
}
/*
作品详情
*/
export interface MediaCardDetail {
    /** 记录唯一ID */
    id: number
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
    progress?: ProgressInfo

    /** 封面图链接 */
    coverUrl?: string

    /** 个人简评 / 吐槽 (你自己写的观后感) */
    comment?: string
    /** 作品简介 */
    introduction?: string
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
    /**关联的系列id */
    seriesId?: number
}

/*
系列数据
*/
export interface Series {
    /** 系列id*/
    id: number | string
    /** 系列类型 */
    type: AcgnType
    /** 系列标题 */
    title: string
    /** 系列封面 */
    coverUrl: string
}
/*
系列详情数据
*/
export interface SeriesDetail {
    /** 系列id*/
    id: number
    /** 系列类型 */
    type: AcgnType
    /** 系列标题 */
    title: string
    /** 系列原名 */
    originalTitle?: string
    /** 系列封面 */
    coverUrl: string
    /** 自定义标签 (如: ["奇幻", "魔法", "经典"]) */
    tags?: string[]
    /** 系列评价 */
    comment?: string
    /** 录入时间 */
    updatedAt: string
}