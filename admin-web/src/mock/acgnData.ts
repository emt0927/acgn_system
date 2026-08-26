import type { MediaCardDetail, MediaCardItem, Series, SeriesDetail } from "@/types/acgn";
import ldwsImg from '@/assets/ldws.jpg'
export const MockMedia: MediaCardItem[] = [
    {
        id: 101,
        title: "葬送的芙莉莲",
        coverUrl: ldwsImg,
        type: "anime",
        subType: "TV动画",
        status: "doing",
        rating: 10,
        progress: { current: 14, total: 28 },
        seriesId: 100
    },
    {
        id: 102,
        title: "电锯人",
        coverUrl: ldwsImg,
        type: "manga",
        subType: "Web动画",
        status: "doing",
        rating: 9,
        progress: { current: 150 }
    },
    {
        id: 103,
        title: "黑神话：悟空",
        coverUrl: ldwsImg,
        type: "game",
        subType: "ACT动作",
        status: "doing",
        rating: 5,
        progress: { text: "一周目盘丝洞" }
    }
];

// 2. 详情数据
export const mockAcgnList: MediaCardDetail[] = [
    {
        id: 101,
        title: '葬送的芙莉莲',
        originalTitle: '葬送のフリーレン',
        series: '葬送的芙莉莲',
        type: 'anime',
        subType: 'TV动画',
        status: 'doing',
        rating: 10,
        progress: { current: 14, total: 28 },
        coverUrl: ldwsImg,
        comment: '完美的动画化，演出和配乐都是顶级的！',
        author: '山田钟人 / 阿部司',
        director: '斋藤圭一郎',
        studio: 'Madhouse',
        startDate: '2023-09-29',
        finishDate: '2024-09-29',
        updatedAt: '2026-07-20'
    },
    {
        id: 102,
        title: '电锯人',
        originalTitle: 'チェンソーマン',
        series: '电锯人',
        type: 'manga',
        subType: '少年漫画',
        status: 'doing',
        rating: 9,
        progress: { current: 150 },
        coverUrl: ldwsImg,
        comment: '藤本树脑洞太大了，第二部依然不可预测。',
        author: '藤本树',
        studio: '集英社',
        startDate: '2022-01-10',
        finishDate: '2023-01-10',
        updatedAt: '2026-07-25'
    },
    {
        id: 103,
        title: '黑神话：悟空',
        originalTitle: 'Black Myth: Wukong',
        series: '西游系列',
        type: 'game',
        subType: 'ARPG',
        status: 'doing',
        rating: 5,
        progress: { text: "一周目盘丝洞" },
        coverUrl: ldwsImg,
        comment: '打击感很棒，国风美术绝了。',
        studio: '游戏科学 (Game Science)',
        startDate: '2024-08-20',
        finishDate: '2025-08-20',
        updatedAt: '2026-07-28'
    }
];

// 系列数据
export const seriesData: Series[] = [
    {
        id: 1,
        type: 'anime',
        title: '间谍过家家',
        coverUrl: ldwsImg
    },
    {
        id: 2,
        type: 'anime',
        title: '与你相恋到生命尽头',
        coverUrl: ldwsImg
    },
    {
        id: 3,
        type: 'manga',
        title: '葬送的福利连',
        coverUrl: ldwsImg
    },
    {
        id: 4,
        type: 'novel',
        title: '三日间的幸福',
        coverUrl: ldwsImg
    },
    {
        id: 5,
        type: 'game',
        title: '崩坏:星穹铁道',
        coverUrl: ldwsImg
    },
]

// 系列详情数据 
export const seriesDetail: SeriesDetail[] = [
    {
        id: 1,
        type: 'anime',
        title: '间谍过家家',
        originalTitle: 'SPY×FAMILY',
        coverUrl: ldwsImg,
        tags: ['搞笑', '日常', '家庭', '谍战'],
        comment: '非常温馨有趣的家庭喜剧，搞笑与温馨并存。',
        updatedAt: '2026-07-28'
    },
    {
        id: 2,
        type: 'anime',
        title: '与你相恋到生命尽头',
        originalTitle: '君が死ぬまで恋をしたい',
        coverUrl: ldwsImg,
        tags: ['百合', '奇幻', '校园', '情感'],
        comment: '带着奇幻与残酷色彩的百合佳作，情感描写非常细腻。',
        updatedAt: '2026-07-28'
    },
    {
        id: 3,
        type: 'manga',
        title: '葬送的芙莉莲',
        originalTitle: '葬送のフリーレン',
        coverUrl: ldwsImg,
        tags: ['奇幻', '冒险', '治愈', '神作'],
        comment: '关于时间与记忆的故事，后勇者时代的慢节奏冒险。',
        updatedAt: '2026-07-28'
    },
    {
        id: 4,
        type: 'novel',
        title: '三日间的幸福',
        originalTitle: '三日間の幸福',
        coverUrl: ldwsImg,
        tags: ['轻小说', '情感', '催泪', '奇幻'],
        comment: '三秋缒代表作，关于买卖寿命与人生价值的深刻思考。',
        updatedAt: '2026-07-28'
    },
    {
        id: 5,
        type: 'game',
        title: '崩坏:星穹铁道',
        originalTitle: 'Honkai: Star Rail',
        coverUrl: ldwsImg,
        tags: ['回合制', '二次元', '科幻', '太空奇幻'],
        comment: '太空冒险主题的回合制RPG,演出优秀,剧情梗量丰富。',
        updatedAt: '2026-07-28'
    }
];