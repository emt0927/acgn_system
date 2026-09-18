const express = require("express");
const router = express.Router()
const axios = require('axios')

// 过滤函数 
const getInfoboxValue = (infobox, keyName) => {
    if (!Array.isArray(infobox)) return ''
    const target = infobox.find(item => item.key === keyName)
    if (!target) return ''
    if (typeof target.value === 'string') {
        return target.value
    } else if (Array.isArray(target.value)) {
        return target.value.map(v => (typeof v === 'object' ? v.v || v.k || '' : v)).json('/')
    }
    return String(target.value)
}
// 快速搜索
router.get('/searchList', async (req, res) => {

    try {
        const { keyword, type } = req.query
        console.log(keyword, type);
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
            timeout: 8000
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
        const formattedList = rawList.map(item => ({
            id: item.id,
            date: item.date,
            title: item.name_cn || item.name,
            originalTitle: item.name,
            coverUrl: item.image,
            director: getInfoboxValue(item.infobox, '导演'),
            characterDesign: getInfoboxValue(item.infobox, '人物设定'),
            originalWork: getInfoboxValue(item.infobox, '原作')

        }))
        res.json({
            code: 200,
            message: '搜索成功',
            data: formattedList
        })
    } catch (error) {
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
            timeout: 8000
        })
        console.log(123);
        console.log(response, 'w s dsdsadasdsadsad');
        const rawList = response.data || []
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
