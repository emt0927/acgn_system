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
export type SubType = 'TV动画' | '剧场版' | '连载漫画' | 'RPG' | 'ACT' | string;



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
    cover: string;
    /**作品类型 */
    type: AcgnType;        // 'anime' | 'comic' | 'game' | 'novel'
    /**左侧状态标签 */
    subTypeLabel: string;   // 角标左侧，如: "TV动画", "RPG", "单机"
    /**状态 */
    status: AcgnStatus;     // 状态
    /**右侧状态标签 */
    statusLabel: string;    // 角标右侧，如: "在追", "在玩", "已通关"
    /**评分 */
    rating: number;         // 评分，如 10
    /**进度 */

    // 🌟 通用进度数据模型
    progress: ProgressInfo
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

    /** 自定义标签 (如: ["奇幻", "魔法", "经典"]) */
    tags: string[]

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
}