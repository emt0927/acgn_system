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
    /**记录唯一ID */
    id: string,
    /**作品名称 */
    title: string,
    /**分类 */
    type: AcgnType,
    /**个人标记状态 */
    status: AcgnStatus,
    /**个人评分 (1-10分 或 1-5星) */
    rating: number,
    /**进度 */
    progress: string,
    /**封面图链接 */
    coverUrl?: string,
    /**自定义标签 */
    tags: string[],
    /**简评 / 吐槽 */
    comment?: string,
    /**开始看/玩的时间 */
    startDate?: string,
    /**完结/通关时间 */
    finishDate?: string,
    /**最后修改时间 */
    updatedAt: string
}