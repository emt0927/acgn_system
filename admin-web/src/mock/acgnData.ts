import type { AcgnItem } from "@/types/acgn";

export const mockAcgnList: AcgnItem[] = [
    {
        id: '1',
        title: '葬送的芙莉莲',
        type: 'anime',
        status: 'done',
        rating: 10,
        progress: '第 28 话',
        coverUrl: 'https://p1.ssl.qhimg.com/t01d019f9e7f41d9a24.jpg', // 找个网络图片链接
        tags: ['奇幻', '治愈', '神作'],
        comment: '完美的动画化，演出和音乐都是顶级的！',
        updatedAt: '2026-07-20'
    },
    {
        id: '2',
        title: '黑神话：悟空',
        type: 'game',
        status: 'doing',
        rating: 9,
        progress: '一周目盘丝洞',
        coverUrl: 'https://xxx.jpg',
        tags: ['动作', '西游', '单机'],
        comment: '打击感很棒，国风美术绝了。',
        updatedAt: '2026-07-28'
    }
]