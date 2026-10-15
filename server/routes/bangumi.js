const express = require("express");
const router = express.Router()
const axios = require('axios')
let proxyAgent = undefined
if (process.env.NODE_ENV !== 'production') {
    const { HttpsProxyAgent } = require('https-proxy-agent')
    proxyAgent = new HttpsProxyAgent('http://127.0.0.1:7897')
}
// 过滤函数 
const getInfoboxValue = (infobox, keyName) => {
    if (!Array.isArray(infobox)) return ''
    const target = infobox.find(item => item.key === keyName)
    if (!target) return ''
    if (typeof target.value === 'string') {
        return target.value
    } else if (Array.isArray(target.value)) {
        return target.value.map(v => (typeof v === 'object' ? v.v || v.k || '' : v)).join('/')
    }
    return String(target.value)
}

// 快速搜索
router.get('/searchList', async (req, res) => {

    try {
        const { keyword, type } = req.query
        const typeMap = {
            anime: [2],
            novel: [1],
            manga: [1],
            game: [4]
        }
        const targetType = typeMap[type] || [2]
        // 请求
        const response = await axios.post('https://api.bgm.tv/v0/search/subjects', {
            keyword: keyword.trim(),
            filter: {
                type: targetType
            }
        }, {
            headers: {
                'User-Agent': 'acgn_system/1.0 (https://github.com/emt0927/acgn_system)'
            },
            timeout: 15000,
            proxy: false,
            httpsAgent: proxyAgent
        })
        // 数据清洗
        const rawList = response.data.data || []
        if (rawList.length === 0) {
            return res.json({
                code: 200,
                message: "暂无数据",
                data: []
            })
        }
        // 2. 根据不同 type 提取搜索列表的展示信息
        const formatSearchItem = (item, type) => {
            const infobox = item.infobox || []
            const base = {
                id: item.id,
                date: item.date || getInfoboxValue(infobox, '发行日期', '发售日', '开始'),
                title: item.name_cn || item.name,
                originalTitle: item.name,
                coverUrl: item.image,
            }

            // 如果是游戏 (game)
            if (type === 'game') {
                const platform = getInfoboxValue(infobox, '平台')
                const gameType = getInfoboxValue(infobox, '游戏类型')
                const developer = getInfoboxValue(infobox, '开发', '游戏开发商', '发行')
                return {
                    ...base,
                    // 既保留独立语义字段，又兼容前端原有的 3 个字段名
                    platform,
                    gameType,
                    developer,
                    director: platform,          // 对应第1栏：PC、Android、iOS、PS5
                    characterDesign: gameType,   // 对应第2栏：回合制RPG（银河冒险策略）
                    originalWork: developer,     // 对应第3栏：米哈游
                    // 官网同款一行拼接文案："2023-04-26 / PC、Android、iOS、PS5 / 回合制RPG（银河冒险策略） / 米哈游"
                    infoSummary: [base.date, platform, gameType, developer].filter(Boolean).join(' / ')
                }
            }

            // 如果是小说或漫画 (novel / manga)
            if (type === 'novel' || type === 'manga') {
                const author = getInfoboxValue(infobox, '作者', '原作')
                const publisher = getInfoboxValue(infobox, '出版社', '连载杂志')
                const status = getInfoboxValue(infobox, '页数', '话数')
                return {
                    ...base,
                    director: author,
                    characterDesign: publisher,
                    originalWork: status,
                    infoSummary: [base.date, author, publisher, status].filter(Boolean).join(' / ')
                }
            }

            // 默认：动画 (anime)
            const director = getInfoboxValue(infobox, '导演')
            const characterDesign = getInfoboxValue(infobox, '人物设定')
            const originalWork = getInfoboxValue(infobox, '原作')
            return {
                ...base,
                director,
                characterDesign,
                originalWork,
                infoSummary: [base.date, director, characterDesign, originalWork].filter(Boolean).join(' / ')
            }
        }
        const formattedList = rawList.map(item => formatSearchItem(item, type))
        res.json({
            code: 200,
            message: '搜索成功',
            data: formattedList
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({ code: 500, message: '服务器内部错误', data: [] })
    }
})
// 获取bangumi作品的详情数据
const getTags = (tags) => {
    if (!Array.isArray(tags)) return []
    return tags.slice(0, 5).map(item => item.name)
}
const cleanBangumiData = (raw, category) => {
    console.log(raw, category);
    const infobox = raw.infobox || []
    const common = {
        // 封面
        coverUrl: raw.images.medium || raw.images?.common || '',
        // 标题
        title: raw.name_cn || '',
        // 原名
        originalTitle: raw.name || '',
        // 放送时间
        startDate: raw.date || '',
        // 作品介绍
        introduction: raw.summary || '',
        // 评分
        rating: raw.rating.score ?? 0
    }
    switch (category) {
        case 'anime':
            return {
                ...common,
                author: getInfoboxValue(infobox, '原作'),
                director: getInfoboxValue(infobox, '导演'),
                // 动画公司
                studio: getInfoboxValue(infobox, '製作'),
                totalEpisodes: raw.total_episodes || 0
            }
        case 'novel':
        case 'manga':
            return {
                ...common,
                author: getInfoboxValue(infobox, '作者'),
                studio: getInfoboxValue(infobox, '出版社'),
            }
        case 'game':
            return {
                ...common,
                studio: getInfoboxValue(infobox, '开发') || getInfoboxValue(infobox, '发行') || ''
            }
        case 'series':
            return {
                ...common,
                tags: getTags(raw.tags)
            }
    }
}
router.get('/detail', async (req, res) => {
    try {
        const { id, type = 'anime' } = req.query
        const response = await axios.get(`https://api.bgm.tv/v0/subjects/${id}`, {
            headers: {
                'User-Agent': 'acgn_system/1.0 (https://github.com/emt0927/acgn_system)'
            },
            timeout: 15000,
            proxy: false,
            httpsAgent: proxyAgent
        })
        const rawList = response.data || []
        console.log(rawList, 'rawList');
        const detail = cleanBangumiData(rawList, type) || []
        return res.json({
            code: 200,
            message: "获取成功",
            data: detail
        })
    } catch (error) {
        return res.status(500).json({ code: 500, message: error.message })
    }
})
module.exports = router
