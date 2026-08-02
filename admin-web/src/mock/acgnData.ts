import type { AcgnItem } from "@/types/acgn";

export const mockAcgnList: AcgnItem[] = [
    {
        id: '1',
        title: '葬送的芙莉莲',
        originalTitle: '葬送のフリーレン',
        series: '葬送的芙莉莲',
        type: 'anime',
        subType: 'TV动画',
        status: 'done',
        rating: 10,
        progress: '第 28 话',
        coverUrl: 'https://p1.ssl.qhimg.com/t01d019f9e7f41d9a24.jpg',
        tags: ['奇幻', '治愈', '神作'],
        comment: '完美的动画化，演出和配乐都是顶级的！',
        author: '山田钟人 / 阿部司', // 原作作者
        director: '斋藤圭一郎',     // 动画导演
        studio: 'Madhouse',         // 制作公司
        startDate: '2023-09-29',
        finishDate: '2024-03-22',
        updatedAt: '2026-07-20'
    },
    {
        id: '2',
        title: '电锯人',
        originalTitle: 'チェンソーマン',
        series: '电锯人',
        type: 'manga',
        subType: '少年漫画',
        status: 'doing',
        rating: 9,
        progress: '第 150 话',
        coverUrl: 'https://p1.ssl.qhimg.com/t01d019f9e7f41d9a24.jpg',
        tags: ['热血', '邪道', '战斗'],
        comment: '藤本树脑洞太大了，第二部依然不可预测。',
        author: '藤本树',            // 漫画作者
        studio: '集英社',           // 出版社
        startDate: '2022-01-10',
        updatedAt: '2026-07-25'
    },
    {
        id: '3',
        title: '黑神话：悟空',
        originalTitle: 'Black Myth: Wukong',
        series: '西游系列',
        type: 'game',
        subType: 'ARPG',
        status: 'doing',
        rating: 9,
        progress: '一周目盘丝洞',
        coverUrl: 'https://p1.ssl.qhimg.com/t01d019f9e7f41d9a24.jpg',
        tags: ['动作', '西游', '单机', '国风'],
        comment: '打击感很棒，国风美术绝了。',
        studio: '游戏科学 (Game Science)', // 开发商
        startDate: '2024-08-20',
        updatedAt: '2026-07-28'
    }
]